<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { ConsoleOutput, AppConfig } from '../types';
import { pythonRunner } from '../utils/pythonRunner';
import { useI18n } from '../utils/i18n';
import MD3Input from './MD3Components/MD3Input.vue';
import MD3IconButton from './MD3Components/MD3IconButton.vue';
import MD3Button from './MD3Components/MD3Button.vue';

const props = defineProps<{
  config?: AppConfig;
}>();

const emit = defineEmits<{
  (e: 'add-console-output', output: ConsoleOutput): void;
  (e: 'contextmenu-terminal', event: MouseEvent): void;
}>();

const { t } = useI18n();
const inputCommand = ref('');
const logs = ref<ConsoleOutput[]>([]);
const commandHistory = ref<string[]>([]);
const historyIndex = ref(-1);
const consoleContainerRef = ref<HTMLDivElement | null>(null);

const handleExecute = async () => {
  const cmd = inputCommand.value.trim();
  if (!cmd) return;

  commandHistory.value.push(cmd);
  historyIndex.value = commandHistory.value.length;
  inputCommand.value = '';

  await pythonRunner.runREPL(cmd, (out) => {
    logs.value.push(out);
    emit('add-console-output', out);
  }, props.config?.demoMode);

  nextTick(() => {
    if (consoleContainerRef.value) {
      consoleContainerRef.value.scrollTop = consoleContainerRef.value.scrollHeight;
    }
  });
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp') {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      inputCommand.value = commandHistory.value[historyIndex.value] || '';
    }
  } else if (e.key === 'ArrowDown') {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      inputCommand.value = commandHistory.value[historyIndex.value] || '';
    } else {
      historyIndex.value = commandHistory.value.length;
      inputCommand.value = '';
    }
  }
};

const clearLogs = () => {
  logs.value = [];
};
</script>

<template>
  <div
    class="repl-console-container"
    :class="`theme-${config?.codeTheme || 'github-dark'}`"
    @contextmenu.prevent="e => emit('contextmenu-terminal', e)"
  >
    <div class="repl-header">
      <div class="repl-title">
        <span class="material-symbols-rounded">terminal</span>
        <span>{{ t('replTitle') }}</span>
      </div>
      <MD3Button
        variant="tonal"
        size="S"
        icon="block"
        :title="t('clearTerminalTooltip')"
        @click="clearLogs"
      >
        {{ t('clearTerminal') }}
      </MD3Button>
    </div>

    <!-- Output Body -->
    <div ref="consoleContainerRef" class="repl-body">
      <div v-if="logs.length === 0" class="repl-welcome">
        Python 3.11.0 (main, Pyodide WASM Runtime)
        Type "help", "copyright", "credits" or "license" for more information.
      </div>

      <div
        v-for="log in logs"
        :key="log.id"
        class="repl-log-line"
        :class="`log-${log.type}`"
      >
        <pre>{{ log.text }}</pre>
      </div>
    </div>

    <!-- Interactive Input Prompt -->
    <div class="repl-input-bar">
      <span class="prompt-symbol">>>></span>
      <MD3Input
        v-model="inputCommand"
        :placeholder="t('replPlaceholder')"
        @enter="handleExecute"
        @keydown="handleKeyDown"
      />
      <MD3Button
        variant="filled"
        size="S"
        icon="play_arrow"
        @click="handleExecute"
      >
        {{ t('execute') }}
      </MD3Button>
    </div>
  </div>
</template>

<style scoped>
.repl-console-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-color);
  font-family: var(--font-terminal);
  transition: all 0.2s ease;
}

/* Theme background overlays for REPL body */
.repl-console-container.theme-github-dark .repl-body {
  background-color: #0d1117;
  color: #c9d1d9;
}
.repl-console-container.theme-monokai .repl-body {
  background-color: #272822;
  color: #f8f8f2;
}
.repl-console-container.theme-one-dark .repl-body {
  background-color: #282c34;
  color: #abb2bf;
}
.repl-console-container.theme-vs-code .repl-body {
  background-color: #1e1e1e;
  color: #d4d4d4;
}
.repl-console-container.theme-github-light .repl-body {
  background-color: #ffffff;
  color: #24292e;
}

.repl-header {
  height: 42px;
  padding: 0 16px;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.repl-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-color);
}

.repl-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 0.875rem;
  line-height: 1.5;
  -webkit-user-select: text !important;
  user-select: text !important;
}

.repl-welcome {
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.repl-log-line pre {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
}

.log-input {
  color: #ffd54f;
  font-weight: 600;
}

.log-stdout {
  color: #81c784;
}

.log-stderr,
.log-error {
  color: var(--md-sys-color-error);
}

.repl-input-bar {
  height: 48px;
  padding: 0 16px;
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.prompt-symbol {
  color: var(--primary);
  font-weight: 700;
  font-size: 1rem;
}
</style>
