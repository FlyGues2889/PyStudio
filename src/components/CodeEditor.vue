<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import { EditorTab, ConsoleOutput, AppConfig, FSItem } from '../types';
import { pythonRunner } from '../utils/pythonRunner';
import { useI18n } from '../utils/i18n';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import MD3Input from './MD3Components/MD3Input.vue';
import MD3SearchResultBadge from './MD3Components/MD3SearchResultBadge.vue';
import MD3IconButton from './MD3Components/MD3IconButton.vue';
import MD3Button from './MD3Components/MD3Button.vue';

const { t } = useI18n();

const props = defineProps<{
  tabs: EditorTab[];
  activeTabId: string | null;
  config: AppConfig;
  workspaceFiles: FSItem[];
  consoleOutputs: ConsoleOutput[];
  activeTutorialSource?: { id: string; title: string } | null;
}>();

const emit = defineEmits<{
  (e: 'select-tab', tabId: string): void;
  (e: 'close-tab', tabId: string): void;
  (e: 'content-change', tabId: string, newContent: string): void;
  (e: 'save-tab', tabId: string): void;
  (e: 'clear-console'): void;
  (e: 'add-console-output', output: ConsoleOutput): void;
  (e: 'contextmenu-editor', event: MouseEvent): void;
  (e: 'contextmenu-terminal', event: MouseEvent): void;
  (e: 'return-to-tutorial', topicId: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lineNumbersRef = ref<HTMLDivElement | null>(null);
const codeHighlightRef = ref<HTMLPreElement | null>(null);
const terminalContainerRef = ref<HTMLDivElement | null>(null);

const isExecuting = ref(false);
const isTerminalOpen = ref(true);
const cursorLine = ref(1);
const cursorCol = ref(1);

const terminalHeight = ref(120);
const isResizingTerminal = ref(false);
let startY = 0;
let startHeight = 0;

const startResizeTerminal = (e: MouseEvent) => {
  e.preventDefault();
  isResizingTerminal.value = true;
  startY = e.clientY;
  startHeight = terminalHeight.value;

  window.addEventListener('mousemove', handleResizeTerminal);
  window.addEventListener('mouseup', stopResizeTerminal);
};

const handleResizeTerminal = (e: MouseEvent) => {
  if (!isResizingTerminal.value) return;
  const deltaY = startY - e.clientY;
  const newHeight = startHeight + deltaY;
  terminalHeight.value = Math.max(100, Math.min(newHeight, window.innerHeight - 150));
};

const stopResizeTerminal = () => {
  isResizingTerminal.value = false;
  window.removeEventListener('mousemove', handleResizeTerminal);
  window.removeEventListener('mouseup', stopResizeTerminal);
};

const getLogTypeClass = (out: ConsoleOutput) => {
  const text = out.text || '';
  if (out.type === 'error' || out.type === 'stderr' || text.includes('[ERROR]') || text.includes('Error:') || text.includes('Traceback')) {
    return 'log-error';
  }
  if (out.type === 'warning' || text.includes('[WARN]') || text.includes('Warning:')) {
    return 'log-warning';
  }
  if (out.type === 'system' || out.type === 'info' || text.includes('[INFO]') || text.startsWith('▶')) {
    return 'log-system';
  }
  return 'log-stdout';
};

const activeTab = computed(() => {
  return props.tabs.find((t) => t.id === props.activeTabId) || null;
});

// Detect language from file extension
const getLanguage = (fileName: string) => {
  if (!fileName) return 'python';
  if (fileName.endsWith('.py')) return 'python';
  if (fileName.endsWith('.js')) return 'javascript';
  if (fileName.endsWith('.ts')) return 'typescript';
  if (fileName.endsWith('.json')) return 'json';
  if (fileName.endsWith('.html') || fileName.endsWith('.htm')) return 'xml';
  if (fileName.endsWith('.css')) return 'css';
  if (fileName.endsWith('.md')) return 'markdown';
  return 'python';
};

const getTabIcon = (fileName: string) => {
  if (!fileName) return 'code_blocks';
  const lower = fileName.toLowerCase();
  if (
    lower.endsWith('.py') ||
    lower.endsWith('.js') ||
    lower.endsWith('.ts') ||
    lower.endsWith('.json') ||
    lower.endsWith('.html') ||
    lower.endsWith('.css')
  ) {
    return 'code_blocks';
  }
  return 'text_snippet';
};

// Offline syntax highlighting computed property
const highlightedCode = computed(() => {
  if (!activeTab.value) return '';
  const lang = getLanguage(activeTab.value.name);
  const code = activeTab.value.content || '';
  try {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value + '\n';
    }
    return hljs.highlightAuto(code).value + '\n';
  } catch (e) {
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
  }
});

// Line numbers generation
const linesCount = computed(() => {
  if (!activeTab.value) return 1;
  return activeTab.value.content.split('\n').length || 1;
});

// Line numbers that match find text
const matchedLineNumbers = computed(() => {
  const set = new Set<number>();
  if (!showFindBar.value || !findText.value || !activeTab.value) return set;
  const lines = activeTab.value.content.split('\n');
  const query = findText.value.toLowerCase();
  lines.forEach((lineText, idx) => {
    if (lineText.toLowerCase().includes(query)) {
      set.add(idx + 1);
    }
  });
  return set;
});

// Sync scrolling between textarea, line numbers, and highlight layer
const handleScroll = () => {
  if (textareaRef.value) {
    if (lineNumbersRef.value) {
      lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop;
    }
    if (codeHighlightRef.value) {
      codeHighlightRef.value.scrollTop = textareaRef.value.scrollTop;
      codeHighlightRef.value.scrollLeft = textareaRef.value.scrollLeft;
    }
  }
};

// Track cursor position
const updateCursorPosition = () => {
  if (!textareaRef.value) return;
  const text = textareaRef.value.value;
  const selStart = textareaRef.value.selectionStart;

  const lines = text.substring(0, selStart).split('\n');
  cursorLine.value = lines.length;
  cursorCol.value = lines[lines.length - 1].length + 1;
};

// Handle Tab key, Enter key auto-indentation, and shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  if (!activeTab.value || !textareaRef.value) return;

  // Ctrl+S / Cmd+S => Save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    emit('save-tab', activeTab.value.id);
    return;
  }

  // Ctrl+F => Find
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    openFindBar();
    return;
  }

  // Ctrl+H => Replace
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
    e.preventDefault();
    openReplaceBar();
    return;
  }

  // Ctrl+Enter / Cmd+Enter => Run Code
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    handleRunCode();
    return;
  }

  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const val = el.value;

  // Tab Key => Insert 4 spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    const tabSpaces = ' '.repeat(props.config.tabSize || 4);
    const newContent = val.substring(0, start) + tabSpaces + val.substring(end);
    emit('content-change', activeTab.value.id, newContent);

    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + tabSpaces.length;
      updateCursorPosition();
    });
    return;
  }

  // Enter Key => Auto Indentation
  if (e.key === 'Enter') {
    const currentLineStart = val.lastIndexOf('\n', start - 1) + 1;
    const currentLine = val.substring(currentLineStart, start);
    const indentMatch = currentLine.match(/^\s*/);
    let indent = indentMatch ? indentMatch[0] : '';

    // Extra indent if line ends with colon ':'
    if (currentLine.trim().endsWith(':')) {
      indent += ' '.repeat(props.config.tabSize || 4);
    }

    if (indent.length > 0) {
      e.preventDefault();
      const newContent = val.substring(0, start) + '\n' + indent + val.substring(end);
      emit('content-change', activeTab.value.id, newContent);

      nextTick(() => {
        el.selectionStart = el.selectionEnd = start + 1 + indent.length;
        updateCursorPosition();
      });
    }
  }
};

const handleInput = (e: Event) => {
  if (!activeTab.value) return;
  const target = e.target as HTMLTextAreaElement;
  emit('content-change', activeTab.value.id, target.value);
  updateCursorPosition();
};

// Run Python Code
const handleRunCode = async () => {
  if (!activeTab.value || isExecuting.value) return;

  isExecuting.value = true;
  isTerminalOpen.value = true;

  emit('add-console-output', {
    id: Math.random().toString(36).substring(2),
    type: 'system',
    text: `▶ Executing ${activeTab.value.name}...`,
    timestamp: new Date().toLocaleTimeString()
  });

  const code = activeTab.value.content;
  await pythonRunner.runCode(code, props.workspaceFiles, (out) => {
    emit('add-console-output', out);
  }, props.config?.demoMode);

  isExecuting.value = false;
};

// Undo & Redo History State Tracking per Tab
const historyMap = ref<Record<string, { stack: string[]; index: number }>>({});
let historyDebounceTimer: any = null;

const canUndo = computed(() => {
  if (!props.activeTabId) return false;
  const h = historyMap.value[props.activeTabId];
  return !!h && h.index > 0;
});

const canRedo = computed(() => {
  if (!props.activeTabId) return false;
  const h = historyMap.value[props.activeTabId];
  return !!h && h.index < h.stack.length - 1;
});

const handleUndo = () => {
  if (!activeTab.value) return;
  const h = historyMap.value[activeTab.value.id];
  if (h && h.index > 0) {
    h.index--;
    const targetContent = h.stack[h.index];
    emit('content-change', activeTab.value.id, targetContent);
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.focus();
        updateCursorPosition();
      }
    });
  }
};

const handleRedo = () => {
  if (!activeTab.value) return;
  const h = historyMap.value[activeTab.value.id];
  if (h && h.index < h.stack.length - 1) {
    h.index++;
    const targetContent = h.stack[h.index];
    emit('content-change', activeTab.value.id, targetContent);
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.focus();
        updateCursorPosition();
      }
    });
  }
};

// Track content changes to record undo/redo history snapshots
watch(
  () => [props.activeTabId, activeTab.value?.content],
  ([newTabId, newContent]) => {
    if (!newTabId || newContent === undefined) return;
    const tabId = newTabId as string;
    const content = newContent as string;

    if (!historyMap.value[tabId]) {
      historyMap.value[tabId] = { stack: [content], index: 0 };
      return;
    }

    const h = historyMap.value[tabId];
    if (content === h.stack[h.index]) return;

    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = setTimeout(() => {
      if (!historyMap.value[tabId]) return;
      const curH = historyMap.value[tabId];
      if (content === curH.stack[curH.index]) return;

      const newStack = curH.stack.slice(0, curH.index + 1);
      newStack.push(content);
      if (newStack.length > 50) newStack.shift();
      historyMap.value[tabId] = {
        stack: newStack,
        index: newStack.length - 1
      };
    }, 250);
  },
  { immediate: true }
);

// Ctrl + Mouse Wheel Font Zooming
const handleWheelZoom = (e: WheelEvent) => {
  if (props.config.enableWheelZoom !== false && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    const currentSize = props.config.fontSize || 15;
    if (e.deltaY < 0) {
      props.config.fontSize = Math.min(24, currentSize + 1);
    } else if (e.deltaY > 0) {
      props.config.fontSize = Math.max(12, currentSize - 1);
    }
  }
};

// Find and Replace state & logic
const showFindBar = ref(false);
const showReplaceBar = ref(false);
const findText = ref('');
const replaceText = ref('');
const findInputRef = ref<HTMLInputElement | null>(null);
const currentMatchIndex = ref(0);

const matchIndices = computed(() => {
  if (!findText.value || !activeTab.value) return [];
  const text = activeTab.value.content;
  const query = findText.value.toLowerCase();
  const indices: number[] = [];
  let pos = 0;
  while ((pos = text.toLowerCase().indexOf(query, pos)) !== -1) {
    indices.push(pos);
    pos += Math.max(1, query.length);
  }
  return indices;
});

const currentMatchNum = computed(() => {
  if (matchIndices.value.length === 0) return 0;
  return currentMatchIndex.value + 1;
});

const currentMatchedLineNumber = computed(() => {
  if (!showFindBar.value || !findText.value || matchIndices.value.length === 0) return null;
  const activePos = matchIndices.value[currentMatchIndex.value];
  if (activePos === undefined || !activeTab.value) return null;
  return activeTab.value.content.substring(0, activePos).split('\n').length;
});

watch([findText, () => activeTab.value?.id], () => {
  currentMatchIndex.value = 0;
  if (matchIndices.value.length > 0) {
    jumpToMatch(0, false);
  }
});

const jumpToMatch = (idx: number, focusEditor = false) => {
  if (!textareaRef.value || matchIndices.value.length === 0) return;
  const total = matchIndices.value.length;
  const normalized = ((idx % total) + total) % total;
  currentMatchIndex.value = normalized;

  const pos = matchIndices.value[normalized];
  const queryLen = findText.value.length;

  if (focusEditor) {
    textareaRef.value.focus();
  }
  textareaRef.value.setSelectionRange(pos, pos + queryLen);
  updateCursorPosition();

  const content = textareaRef.value.value;
  const targetLine = content.substring(0, pos).split('\n').length;
  const fontPx = props.config.fontSize || 15;
  const lineHeight = fontPx * 1.5;
  const targetScrollTop = Math.max(0, (targetLine - 4) * lineHeight);

  textareaRef.value.scrollTop = targetScrollTop;
  handleScroll();
};

const openFindBar = () => {
  showFindBar.value = true;
  showReplaceBar.value = false;
  nextTick(() => {
    findInputRef.value?.focus();
    if (matchIndices.value.length > 0) {
      jumpToMatch(currentMatchIndex.value);
    }
  });
};

const openReplaceBar = () => {
  showFindBar.value = true;
  showReplaceBar.value = true;
  nextTick(() => {
    findInputRef.value?.focus();
    if (matchIndices.value.length > 0) {
      jumpToMatch(currentMatchIndex.value);
    }
  });
};

const closeFindBar = () => {
  showFindBar.value = false;
  showReplaceBar.value = false;
};

const triggerCopy = () => {
  if (!textareaRef.value || !activeTab.value) return;
  const start = textareaRef.value.selectionStart;
  const end = textareaRef.value.selectionEnd;
  const selected = textareaRef.value.value.substring(start, end);
  if (selected) {
    navigator.clipboard.writeText(selected);
  } else {
    navigator.clipboard.writeText(textareaRef.value.value);
  }
};

const triggerCut = () => {
  if (!textareaRef.value || !activeTab.value) return;
  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  if (start !== end) {
    const val = el.value;
    const cutText = val.substring(start, end);
    navigator.clipboard.writeText(cutText);
    const newContent = val.substring(0, start) + val.substring(end);
    emit('content-change', activeTab.value.id, newContent);
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start;
    });
  }
};

const triggerPaste = async () => {
  if (!textareaRef.value || !activeTab.value) return;
  try {
    const pasted = await navigator.clipboard.readText();
    if (!pasted) return;
    const el = textareaRef.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const newContent = val.substring(0, start) + pasted + val.substring(end);
    emit('content-change', activeTab.value.id, newContent);
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + pasted.length;
    });
  } catch (e) { }
};

const handleFindNext = () => {
  if (matchIndices.value.length === 0) return;
  jumpToMatch(currentMatchIndex.value + 1);
};

const handleFindPrev = () => {
  if (matchIndices.value.length === 0) return;
  jumpToMatch(currentMatchIndex.value - 1);
};

const handleReplaceOne = () => {
  if (!textareaRef.value || !activeTab.value || !findText.value) return;
  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = el.value.substring(start, end);
  if (selected.toLowerCase() === findText.value.toLowerCase()) {
    const newContent = el.value.substring(0, start) + replaceText.value + el.value.substring(end);
    emit('content-change', activeTab.value.id, newContent);
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + replaceText.value.length;
      handleFindNext();
    });
  } else {
    handleFindNext();
  }
};

const handleReplaceAll = () => {
  if (!activeTab.value || !findText.value) return;
  const regex = new RegExp(findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const newContent = activeTab.value.content.replace(regex, replaceText.value);
  emit('content-change', activeTab.value.id, newContent);
};

defineExpose({
  openFindBar,
  openReplaceBar,
  triggerCopy,
  triggerCut,
  triggerPaste
});

// Auto scroll terminal to bottom
watch(() => props.consoleOutputs.length, () => {
  nextTick(() => {
    if (terminalContainerRef.value) {
      terminalContainerRef.value.scrollTop = terminalContainerRef.value.scrollHeight;
    }
  });
});
</script>

<template>
  <div class="code-editor-container">
    <!-- Editor Tabs Header -->
    <div class="editor-tabs-bar">
      <div class="tabs-scroll-area">
        <div v-for="tab in tabs" :key="tab.id" class="editor-tab-item" :class="{ 'is-active': tab.id === activeTabId }"
          @click="emit('select-tab', tab.id)">
          <span class="material-symbols-rounded tab-icon">
            {{ getTabIcon(tab.name) }}
          </span>
          <span class="tab-name">{{ tab.name }}</span>
          <span v-if="tab.isDirty" class="dirty-indicator" title="未保存修改">•</span>
          <MD3IconButton variant="standard" size="S" icon="close" title="关闭标签页"
            @click.stop="emit('close-tab', tab.id)" />
        </div>
      </div>
    </div>

    <!-- Empty Editor State -->
    <div v-if="!activeTab" class="empty-editor-view" @contextmenu.prevent="e => emit('contextmenu-editor', e)">
      <div class="empty-editor-content">
        <span class="material-symbols-rounded empty-editor-app-icon">code_xml</span>
        <h2>{{ t('welcomeTitle') }}</h2>
        <p>{{ t('welcomeSubtitle') }}</p>
        <div class="quick-shortcuts">
          <div class="shortcut-item"><kbd>Ctrl</kbd> + <kbd>S</kbd> <span>{{ t('shortcutSave') }}</span></div>
          <div class="shortcut-item"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> <span>{{ t('shortcutRun') }}</span></div>
        </div>
      </div>
    </div>

    <!-- Active Code Editor View -->
    <div v-else class="active-editor-view">
      <!-- Editor Action Toolbar -->
      <div class="editor-toolbar">
        <div class="left-toolbar-group">
          <!-- Run Code Button -->
          <MD3Button variant="filled" size="S" :icon="isExecuting ? 'sync' : 'play_arrow'" :disabled="isExecuting"
            :title="`${t('runCode')} (Ctrl+Enter)`" @click="handleRunCode">
            {{ t('runCode') }}
          </MD3Button>

          <!-- Save Button -->
          <MD3Button variant="text" size="S" icon="save" :disabled="!activeTab.isDirty" :title="`${t('save')} (Ctrl+S)`"
            @click="emit('save-tab', activeTab.id)">
            {{ t('save') }}
          </MD3Button>

          <!-- Undo & Redo Buttons (S size) -->
          <MD3IconButton variant="standard" size="S" icon="undo" :disabled="!canUndo" title="撤销 (Ctrl+Z)"
            @click="handleUndo" />

          <MD3IconButton variant="standard" size="S" icon="redo" :disabled="!canRedo" title="重做 (Ctrl+Y)"
            @click="handleRedo" />
        </div>

        <div class="right-toolbar-group">
          <span class="cursor-position-tag">
            第 {{ cursorLine }} 行，第 {{ cursorCol }} 列
          </span>
          <span class="engine-badge">
            Python 3.11 Pyodide
          </span>
        </div>
      </div>

      <!-- Floating Find & Replace Widget Bar -->
      <div v-if="showFindBar" class="find-replace-widget">
        <div class="find-row">
          <MD3Input ref="findInputRef" v-model="findText" icon="search" :placeholder="t('findPlaceholder')"
            @enter="handleFindNext" @keydown.esc="closeFindBar" />
          <MD3SearchResultBadge :current="currentMatchNum" :total="matchIndices.length" :has-query="!!findText"
            :no-match-text="t('noMatches')" />
          <MD3IconButton variant="standard" size="S" icon="keyboard_arrow_up" title="上一个 (Shift+Enter)"
            @click="handleFindPrev" />
          <MD3IconButton variant="standard" size="S" icon="keyboard_arrow_down" title="下一个 (Enter)"
            @click="handleFindNext" />
          <MD3IconButton variant="standard" size="S" icon="close" title="关闭" @click="closeFindBar" />
        </div>
        <div v-if="showReplaceBar" class="replace-row">
          <MD3Input v-model="replaceText" icon="find_replace" :placeholder="t('replacePlaceholder')"
            @enter="handleReplaceOne" @keydown.esc="closeFindBar" />

          <MD3Button variant="tonal" size="S" :icon="isExecuting ? 'sync' : 'check'" :disabled="isExecuting"
            :title="`${t('runCode')} (Ctrl+Enter)`" @click="handleReplaceOne">
            {{ t('replaceBtn') }}
          </MD3Button>
          <MD3Button variant="text" size="S" :icon="isExecuting ? 'sync' : 'done_all'" :disabled="isExecuting"
            :title="`${t('runCode')} (Ctrl+Enter)`" @click="handleReplaceAll">
            {{ t('replaceAllBtn') }}
          </MD3Button>
        </div>
      </div>

      <!-- Code Textarea & Line Numbers Area -->
      <div class="editor-workspace-body" :class="`theme-${config.codeTheme || 'github-dark'}`"
        @contextmenu.prevent="e => emit('contextmenu-editor', e)">
        <!-- Line Numbers Column -->
        <div ref="lineNumbersRef" class="line-numbers-column" :style="{ fontSize: `${config.fontSize || 15}px` }">
          <div v-for="n in linesCount" :key="n" class="line-num" :class="{
            'active-line-num': n === cursorLine,
            'matched-line-num': matchedLineNumbers.has(n) && n !== currentMatchedLineNumber,
            'current-matched-line-num': n === currentMatchedLineNumber
          }">
            {{ n }}
          </div>
        </div>

        <!-- Textarea Code Area -->
        <div class="code-area-wrapper">
          <pre ref="codeHighlightRef" class="code-highlight-overlay" aria-hidden="true"
            :style="{ fontSize: `${config.fontSize || 15}px`, tabSize: config.tabSize || 4 }"><code class="hljs" v-html="highlightedCode"></code></pre>
          <textarea ref="textareaRef" :value="activeTab.content" class="code-textarea"
            :style="{ fontSize: `${config.fontSize || 15}px`, tabSize: config.tabSize || 4 }" spellcheck="false"
            autocomplete="off" autocorrect="off" autocapitalize="off" @input="handleInput" @keydown="handleKeyDown"
            @scroll="handleScroll" @wheel="handleWheelZoom" @click="updateCursorPosition"
            @keyup="updateCursorPosition"></textarea>
        </div>

        <!-- Floating FAB button to return to tutorial snippet (only in tutorial_demo.py tab) -->
        <div v-if="activeTutorialSource && activeTab && activeTab.name === 'tutorial_demo.py'" class="fab-return-tutorial-wrapper">
          <button
            class="fab-return-tutorial-btn"
            :title="t('returnToTutorial') + '：' + activeTutorialSource.title"
            @click="emit('return-to-tutorial', activeTutorialSource.id)"
          >
            <span class="material-symbols-rounded fab-icon">school</span>
            <span class="fab-text">{{ t('returnToTutorial') }}</span>
          </button>
        </div>
      </div>

      <!-- Resizable Output Terminal Drawer -->
      <div class="terminal-drawer" :class="{ 'is-collapsed': !isTerminalOpen }"
        :style="{ height: isTerminalOpen ? `${terminalHeight}px` : '32px' }"
        @contextmenu.prevent="e => emit('contextmenu-terminal', e)">
        <div v-if="isTerminalOpen" class="terminal-resize-handle" @mousedown="startResizeTerminal"></div>

        <div class="terminal-header" @click="isTerminalOpen = !isTerminalOpen">
          <div class="terminal-title">
            <span class="material-symbols-rounded">terminal</span>
            <span>Output</span>
            <span v-if="consoleOutputs.length > 0" class="logs-count">
              {{ consoleOutputs.length }}
            </span>
          </div>

          <div class="terminal-actions" @click.stop>
            <button class="terminal-btn" title="清空终端记录" @click="emit('clear-console')">
              <span class="material-symbols-rounded">block</span>
            </button>
            <button class="terminal-btn" title="展开/收起终端" @click="isTerminalOpen = !isTerminalOpen">
              <span class="material-symbols-rounded">
                {{ isTerminalOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="isTerminalOpen" ref="terminalContainerRef" class="terminal-logs-body">
          <div v-if="consoleOutputs.length === 0" class="terminal-placeholder"></div>
          <div v-for="out in consoleOutputs" :key="out.id" class="log-line" :class="getLogTypeClass(out)">
            <pre class="log-text">{{ out.text }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-color);
  min-width: 0;
  overflow: hidden;
}

/* Tabs Bar */
.editor-tabs-bar {
  height: 38px;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color-muted);
  display: flex;
  align-items: center;
  overflow-x: auto;
  user-select: none;
}

.tabs-scroll-area {
  display: flex;
  align-items: center;
  height: 100%;
}

.editor-tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  padding: 0 12px;
  background-color: var(--surface-color);
  border: none;
  color: var(--text-tertiary);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  max-width: 200px;
}

.editor-tab-item:hover {
  background-color: var(--surface-color);
  filter: brightness(0.95);
  color: var(--text-color);
}

.editor-tab-item.is-active {
  background-color: var(--surface-color);
  color: var(--primary);
  font-weight: 600;
  border-bottom: 2px solid var(--primary);
}

.tab-icon {
  font-size: 16px;
}

.tab-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dirty-indicator {
  color: var(--accent-amber-text);
  font-size: 16px;
  line-height: 1;
}

.close-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
}

.close-tab-btn:hover {
  background-color: var(--border-color-muted);
  color: var(--text-color);
}

.close-tab-btn span {
  font-size: 12px;
}

/* Empty View */
.empty-editor-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.empty-editor-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.empty-editor-icon,
.empty-editor-app-icon {
  font-size: 64px;
  width: 64px;
  height: 64px;
  color: var(--secondary, var(--md-sys-color-secondary, #625b71));
  margin-bottom: 1rem;
  display: inline-block;
  line-height: 1;
}

.empty-editor-content h2 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.empty-editor-content p {
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.quick-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.shortcut-item {
  font-size: 0.8125rem;
}

kbd {
  background-color: var(--surface-variant);
  border: 1px solid var(--border-color-muted);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

/* Active Editor Workspace */
.active-editor-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.editor-toolbar {
  height: 42px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-color);
}

.left-toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.run-code-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #2e7d32;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.15s;
}

.run-code-btn:hover:not(:disabled) {
  background-color: #1b5e20;
}

.run-code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.run-code-btn span {
  font-size: 15px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--surface-color);
  border: none;
  color: var(--text-color);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.15s;
}

.toolbar-btn:hover:not(:disabled) {
  background-color: var(--border-color-muted);
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-btn span {
  font-size: 16px;
}

.toolbar-btn.history-btn-first {
  margin-left: 10px;
}

.snippets-dropdown-wrapper {
  position: relative;
}

.snippets-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 6px;
  z-index: 100;
  min-width: 220px;
}

.snippets-menu button {
  background: transparent;
  border: none;
  padding: 6px 10px;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-color);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  transition: background-color 0.1s;
}

.snippets-menu button:hover {
  background-color: var(--surface-variant);
  color: var(--primary);
}

.right-toolbar-group {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.engine-badge {
  color: var(--on-primary-container);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

/* Editor Workspace Body */
.editor-workspace-body {
  flex: 1;
  display: flex;
  min-height: 0;
  min-width: 0;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
}

.line-numbers-column {
  width: 48px;
  background-color: var(--on-inverse-surface);
  border-right: 1px solid var(--border-color-muted);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  text-align: right;
  padding: 12px 8px 12px 0;
  user-select: none;
  overflow: hidden;
  line-height: 1.5;
  flex-shrink: 0;
  box-sizing: border-box;
}

.line-num {
  height: 1.5em;
  line-height: 1.5;
  padding-right: 4px;
  border-radius: 2px;
  transition: background-color 0.15s, color 0.15s;
}

.active-line-num {
  color: var(--primary);
  font-weight: 700;
}

.matched-line-num {
  background-color: color-mix(in srgb, var(--md-sys-color-tertiary-container) 30%, transparent) !important;
  color: var(--md-sys-color-tertiary) !important;
  font-weight: 700;
}

.current-matched-line-num {
  background-color: var(--md-sys-color-tertiary-container) !important;
  color: var(--md-sys-color-tertiary) !important;
  font-weight: 700;
}

.code-area-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-color);
}

.empty-editor-app-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
  object-fit: contain;
  font-size: 80px !important;
  line-height: 1;
  display: inline-block;
}

/* Floating Find & Replace Widget */
.find-replace-widget {
  position: absolute;
  top: 48px;
  right: 24px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 50;
}

.find-row,
.replace-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.find-input {
  height: 28px;
  padding: 0 10px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.8125rem;
  outline: none;
  width: 170px;
}

.match-count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  background-color: var(--surface-variant);
  padding: 2px 8px;
  border-radius: 9999px;
  white-space: nowrap;
}

.match-count-badge.no-match {
  color: #ef4444;
  background-color: #fee2e2;
}

.find-action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.find-action-btn:hover {
  background-color: var(--border-color-muted);
}

.find-action-btn span {
  font-size: 18px;
}

.find-text-btn {
  height: 28px;
  padding: 0 10px;
  background-color: var(--surface-variant);
  border: 1px solid var(--border-color-muted);
  border-radius: 4px;
  color: var(--text-color);
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.find-text-btn:hover {
  background-color: var(--border-color-muted);
}

.code-highlight-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 12px 120px 12px 12px;
  font-family: var(--font-mono);
  line-height: 1.5;
  tab-size: 4;
  white-space: pre !important;
  word-break: normal !important;
  word-wrap: normal !important;
  overflow-wrap: normal !important;
  overflow: hidden !important;
  pointer-events: none;
  background: transparent !important;
  box-sizing: border-box;
}

.code-highlight-overlay code.hljs {
  padding: 0 !important;
  padding-right: 120px !important;
  background: transparent !important;
  font-family: var(--font-mono) !important;
  font-size: inherit !important;
  line-height: inherit !important;
  white-space: pre !important;
  word-break: normal !important;
  word-wrap: normal !important;
  overflow-wrap: normal !important;
  display: inline-block !important;
  width: max-content !important;
  min-width: calc(100% + 120px);
}

.code-textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 12px 120px 12px 12px;
  border: none;
  outline: none;
  resize: none;
  background-color: transparent;
  color: transparent;
  caret-color: var(--text-color);
  font-family: var(--font-mono);
  line-height: 1.5;
  white-space: pre !important;
  word-break: normal !important;
  word-wrap: normal !important;
  overflow-wrap: normal !important;
  overflow: auto !important;
  tab-size: 4;
  box-sizing: border-box;
  z-index: 2;
}

.code-textarea::selection {
  background-color: #f59e0b !important;
  color: #000000 !important;
}

/* Terminal Drawer */
.terminal-drawer {
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color-muted);
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 240px;

  transition: height 0.2s;
}

.terminal-drawer.is-collapsed {
  height: 32px !important;
  min-height: 32px !important;
}

.terminal-resize-handle {
  height: 8px;
  width: 100%;
  position: absolute;
  top: -4px;
  left: 0;
  cursor: ns-resize;
  z-index: 10;
  transition: background-color 0.15s;
}

.terminal-resize-handle:hover,
.terminal-resize-handle:active {
  background-color: var(--primary);
  opacity: 0.6;
}

.terminal-header {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--surface-color);
  user-select: none;
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.logs-count {
  padding: 0 6px;

  border-radius: 9999px;
  background-color: var(--tertiary-container);
  color: var(--tertiary);

  font-size: 0.75rem;
}

.terminal-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.terminal-btn {
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.terminal-btn:hover {
  background-color: var(--border-color-muted);
  color: var(--text-color);
}

.terminal-btn span {
  font-size: 16px;
}

.terminal-logs-body {
  flex: 1;
  padding: 8px 12px;
  overflow-y: auto;
  font-family: var(--font-terminal);
  font-size: 0.8125rem;
  background-color: var(--bg-color);
  -webkit-user-select: text !important;
  user-select: text !important;
}

.terminal-placeholder {
  color: var(--text-tertiary);
  font-style: italic;
  padding: 1rem 0;
}

.log-line {
  display: flex;
  gap: 8px;
  line-height: 1.4;
  margin-bottom: 2px;
}

.log-time {
  color: var(--text-tertiary);
  font-size: 0.75rem;
  user-select: none;
}

.log-text {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
  color: inherit;
  -webkit-user-select: text !important;
  user-select: text !important;
}

/* Program output text color remains default var(--text-color) */
.log-stdout {
  color: var(--text-color);
}

/* INFO / System messages */
.log-system {
  color: #3b82f6;
  font-weight: 600;
}

/* WARN / Warning messages */
.log-warning {
  color: #f59e0b;
  font-weight: 600;
}

/* ERROR / Exception / Traceback messages */
.log-error,
.log-stderr {
  color: var(--md-sys-color-error);
  font-weight: 600;
}

/* Floating Return-to-Tutorial FAB Button */
.fab-return-tutorial-wrapper {
  position: absolute;
  right: 24px;
  bottom: 20px;
  z-index: 40;
  pointer-events: auto;
}

.fab-return-tutorial-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px 0 16px;
  border-radius: 16px;
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.fab-return-tutorial-btn:hover {
  transform: translateY(-2px);
  background-color: var(--secondary);
  color: var(--on-secondary);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
}

.fab-return-tutorial-btn:active {
  transform: scale(0.95);
}

.fab-icon {
  font-size: 1.25rem;
}

.fab-text {
  letter-spacing: 0.2px;
}
</style>
