<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { FSItem, EditorTab, ConsoleOutput, AppConfig } from './types';
import { DEFAULT_WORKSPACE_ITEMS } from './utils/defaultWorkspace';
import { pythonRunner } from './utils/pythonRunner';
import { useI18n } from './utils/i18n';
import MD3Sidebar from './components/MD3Components/MD3Sidebar.vue';
import SidebarNavItem from './components/SidebarNavItem.vue';
import FileTree from './components/FileTree.vue';
import CodeEditor from './components/CodeEditor.vue';
import REPLConsole from './components/REPLConsole.vue';
import PackageManager from './components/PackageManager.vue';
import TutorialView from './components/tutor/TutorialView.vue';
import PageHeader from './components/PageHeader.vue';
import MD3Card from './components/MD3Components/MD3Card.vue';
import MD3List from './components/MD3Components/MD3List.vue';
import MD3ListItem from './components/MD3Components/MD3ListItem.vue';
import MD3Tabs from './components/MD3Components/MD3Tabs.vue';
import MD3Slider from './components/MD3Components/MD3Slider.vue';
import MD3Switch from './components/MD3Components/MD3Switch.vue';
import MD3Snackbar from './components/MD3Components/MD3Snackbar.vue';
import MD3LoadingModal from './components/MD3Components/MD3LoadingModal.vue';
import MD3Select from './components/MD3Components/MD3Select.vue';
import MD3IconButton from './components/MD3Components/MD3IconButton.vue';
import MD3Badge from './components/MD3Components/MD3Badge.vue';
import { minimizeWindow, maximizeWindow, closeWindow } from './utils/tauriWindow';
import EditorPreview from './components/EditorPreview.vue';
import MD3Dialog from './components/MD3Components/MD3Dialog.vue';
import ContextMenu from './components/ContextMenu.vue';
import { safeStorage } from './utils/storage';
import { nativeApi, fsEntriesToFSItems, absPath } from './utils/native';
import { nativePython } from './utils/nativePython';
import { revealItemInDir, openPath } from '@tauri-apps/plugin-opener';

import { syncWorkspacePackages } from './utils/packageUtils';
import { setQuizQuestionResult, syncQuizCompletion, getQuizQuestionResult } from './components/tutor/quizData';

const { t } = useI18n();

// Component refs
const codeEditorRef = ref<any>(null);
const openFileInputRef = ref<HTMLInputElement | null>(null);
const openFolderInputRef = ref<HTMLInputElement | null>(null);

// Menu dropdown state
const activeMenu = ref<'file' | 'edit' | null>(null);

// Context menu state
const contextMenuState = ref<{
  visible: boolean;
  x: number;
  y: number;
  type: 'editor' | 'terminal' | 'filetree' | 'tutorial' | 'general';
  targetItem: FSItem | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  type: 'editor',
  targetItem: null
});

const openContextMenu = (
  e: MouseEvent,
  type: 'editor' | 'terminal' | 'filetree' | 'tutorial' | 'general',
  item: FSItem | null = null
) => {
  e.preventDefault();
  e.stopPropagation();
  closeMenus();
  contextMenuState.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    type,
    targetItem: item
  };
};

const handleContextMenuCopy = () => {
  const selectedText = window.getSelection()?.toString();
  if (selectedText) {
    navigator.clipboard.writeText(selectedText);
  } else {
    codeEditorRef.value?.triggerCopy();
  }
};

const closeContextMenu = () => {
  contextMenuState.value.visible = false;
};

// 在系统文件资源管理器中打开/定位文件（文件选中、文件夹打开）
const handleRevealInExplorer = async (item: FSItem) => {
  if (!workspaceRootPath.value) {
    showToast('请先打开本地工作区');
    return;
  }
  const fullPath = absPath(workspaceRootPath.value, item.path);
  try {
    if (item.isFolder) {
      await openPath(fullPath);
    } else {
      await revealItemInDir(fullPath);
    }
  } catch (err: any) {
    showToast('无法打开资源管理器: ' + (err?.message || err));
  }
};

// Delete confirmation dialog state
const isDeleteDialogOpen = ref(false);
const deleteTargetItem = ref<FSItem | null>(null);

const requestDeleteItem = (item: FSItem) => {
  deleteTargetItem.value = item;
  isDeleteDialogOpen.value = true;
};

const toggleMenu = (menuName: 'file' | 'edit') => {
  if (activeMenu.value === menuName) {
    activeMenu.value = null;
  } else {
    activeMenu.value = menuName;
  }
};

const closeMenus = () => {
  activeMenu.value = null;
  // Delay restoring editor focus to avoid stealing focus from find/replace inputs
  setTimeout(() => {
    const active = document.activeElement;
    if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA')) {
      codeEditorRef.value?.focusEditor?.();
    }
  }, 60);
};

const handleMenuOpenFile = async () => {
  // Tauri 环境下用原生文件对话框导入单个文件
  if (nativeApi.available()) {
    const path = await nativeApi.pickFile();
    if (path) {
      try {
        const content = await nativeApi.readFile(path);
        const name = path.split(/[\\/]/).pop() || 'imported.py';
        const newFile: FSItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name,
          path: `/${name}`,
          isFolder: false,
          content,
          parentId: null
        };
        workspaceItems.value.push(newFile);
        showToast(t('toastImported'));
        openFileInTab(newFile);
      } catch (err: any) {
        showToast('导入失败: ' + (err?.message || err));
      }
    }
    return;
  }
  openFileInputRef.value?.click();
};

const handleMenuOpenFolder = async () => {
  // Tauri 环境下打开本地真实文件夹作为工作区
  if (nativeApi.available()) {
    const path = await nativeApi.pickFolder();
    if (path) {
      await loadWorkspaceFromDisk(path);
    }
    return;
  }
  openFolderInputRef.value?.click();
};

// 从本地磁盘目录构建工作区（替换虚拟文件树）
const loadWorkspaceFromDisk = async (root: string) => {
  try {
    const entries = await nativeApi.readDirectory(root);
    workspaceItems.value = fsEntriesToFSItems(entries);
    openTabs.value = [];
    activeEditorTabId.value = null;
    workspaceRootPath.value = root;
    pythonRunner.workspaceRoot = root;
    safeStorage.setItem('pystudio_workspace_root', root);

    const mainFile = findFileByPath(workspaceItems.value, '/main.py');
    if (mainFile) openFileInTab(mainFile);
    showToast('已打开本地工作区: ' + root);
  } catch (err: any) {
    showToast('打开工作区失败: ' + (err?.message || err));
  }
};

const handleFileInputChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  handleImportFiles(files);
};

// App Initialization State
const isInitializing = ref(true);

// Navigation State
const activeNavTab = ref<'explorer' | 'tutorial' | 'console' | 'packages' | 'settings'>('explorer');
const sidebarExpanded = ref(false);
const fileTreeCollapsed = ref(false);

// App Config State
const config = ref<AppConfig>({
  themeMode: 'system',
  fontSize: 15,
  tabSize: 4,
  wordWrap: true,
  autoSave: true,
  showLineNumbers: true,
  codeTheme: 'github-dark',
  enableWheelZoom: true,
  autoPairQuotes: true,
  demoMode: false
});

// Toast message notifier
const toastMessage = ref<string | null>(null);
const showToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = null;
  }, 3000);
};

// Workspace File System & Editor Tabs State
const workspaceItems = ref<FSItem[]>([]);
const openTabs = ref<EditorTab[]>([]);
const activeEditorTabId = ref<string | null>(null);
const consoleOutputs = ref<ConsoleOutput[]>([]);

// 本地工作区根目录（Tauri 原生文件系统模式），null 表示纯虚拟工作区
const workspaceRootPath = ref<string | null>(null);
const engineLabel = computed(() => nativePython.statusLabel.value);

// ---- 会话恢复：上次关闭时打开的标签页 + 光标位置 ----
const SESSION_KEY = 'pystudio_session';
const sessionCursors = ref<Record<string, { line: number; col: number }>>({});

const saveSession = () => {
  try {
    safeStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        tabs: openTabs.value.map((t) => t.path),
        active: activeTabObject.value?.path || null,
        cursors: sessionCursors.value
      })
    );
  } catch (e) {}
};

const handleCursorChange = (payload: { path: string; line: number; col: number }) => {
  if (!payload?.path) return;
  sessionCursors.value[payload.path] = { line: payload.line, col: payload.col };
  saveSession();
};

// 重新打开上次会话的标签页，并恢复活动标签与光标
const restoreSession = () => {
  try {
    const raw = safeStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw);
    if (session.cursors) {
      sessionCursors.value = session.cursors;
    }
    if (Array.isArray(session.tabs) && session.tabs.length > 0) {
      const files = session.tabs
        .map((p: string) => findFileByPath(workspaceItems.value, p))
        .filter((f): f is FSItem => !!f);
      openTabs.value = [];
      for (const f of files) openFileInTab(f);
      if (session.active) {
        const activeTab = openTabs.value.find((t) => t.path === session.active);
        if (activeTab) activeEditorTabId.value = activeTab.id;
      }
    }
  } catch (e) {}
};

// Initialize Workspace from LocalStorage / 本地工作区
onMounted(async () => {
  // 检测本机 Python，用于引擎徽标展示（异步，不阻塞初始化）
  if (nativeApi.available()) {
    nativePython.detect();
  }

  // 恢复/初始化工作区：
  // - Tauri 环境：由 Rust 在应用数据目录确保 pystudio_files 示例工作区存在（首次启动才写入），
  //   再加载最近打开的工作区（或默认的 pystudio_files）。
  // - 纯浏览器：恢复 localStorage 中的虚拟工作区。
  const loadVirtualWorkspace = () => {
    const savedWorkspace = safeStorage.getItem('pystudio_workspace');
    if (savedWorkspace) {
      try {
        workspaceItems.value = JSON.parse(savedWorkspace);
        return;
      } catch (e) {}
    }
    workspaceItems.value = DEFAULT_WORKSPACE_ITEMS;
  };

  const savedRoot = safeStorage.getItem('pystudio_workspace_root');
  if (nativeApi.available()) {
    try {
      // 只确保空文件夹存在（首次启动），不写入任何示例文件
      const defaultRoot = await nativeApi.ensureDefaultWorkspace();
      const root = savedRoot || defaultRoot;
      const entries = await nativeApi.readDirectory(root);
      workspaceItems.value = fsEntriesToFSItems(entries);
      workspaceRootPath.value = root;
      pythonRunner.workspaceRoot = root;
      safeStorage.setItem('pystudio_workspace_root', root);
    } catch (e) {
      // 磁盘工作区不可用，退回虚拟工作区
      loadVirtualWorkspace();
    }
  } else {
    loadVirtualWorkspace();
  }

  const savedConfig = safeStorage.getItem('pystudio_config');
  if (savedConfig) {
    try {
      config.value = { ...config.value, ...JSON.parse(savedConfig) };
    } catch (e) {}
  }

  // Open default main.py tab
  const mainFile = findFileByPath(workspaceItems.value, '/main.py');
  if (mainFile) {
    openFileInTab(mainFile);
  }

  // 恢复上次会话打开的标签页与光标位置
  restoreSession();

  // Update theme mode
  updateTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

  // 关闭/刷新前确保会话（标签页 + 光标）落盘
  window.addEventListener('beforeunload', saveSession);

  // Initialize in Presentation / Demo Mode instantly
  consoleOutputs.value.push({
    id: Math.random().toString(36).substring(2),
    type: 'system',
    text: '[INFO] PyStudio Presentation Engine Ready (Demo Mode Active)',
    timestamp: new Date().toLocaleTimeString()
  });
  isInitializing.value = false;
});

// Sync Workspace to LocalStorage
watch(workspaceItems, (newVal) => {
  safeStorage.setItem('pystudio_workspace', JSON.stringify(newVal));
}, { deep: true });

watch(config, (newVal) => {
  safeStorage.setItem('pystudio_config', JSON.stringify(newVal));
  updateTheme();
}, { deep: true });

// 会话：标签页与活动标签变化时保存
watch(openTabs, saveSession, { deep: true });
watch(activeEditorTabId, saveSession);

// Theme handling
const updateTheme = () => {
  const root = window.document.documentElement;
  const isDark =
    config.value.themeMode === 'dark' ||
    (config.value.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// File Navigation & Helpers
function findFileByPath(items: FSItem[], path: string): FSItem | null {
  for (const item of items) {
    if (item.path === path && !item.isFolder) return item;
    if (item.isFolder && item.children) {
      const found = findFileByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

function openFileInTab(file: FSItem) {
  const existing = openTabs.value.find((t) => t.fileId === file.id);
  if (existing) {
    activeEditorTabId.value = existing.id;
  } else {
    const newTab: EditorTab = {
      id: `tab-${file.id}`,
      fileId: file.id,
      name: file.name,
      path: file.path,
      content: file.content || '',
      savedContent: file.content || '',
      isDirty: false,
      language: file.name.endsWith('.py') ? 'python' : 'plaintext'
    };
    openTabs.value.push(newTab);
    activeEditorTabId.value = newTab.id;
  }
  activeNavTab.value = 'explorer';
}

const handleSelectFile = (file: FSItem) => {
  openFileInTab(file);
};

const handleToggleFolder = (item: FSItem) => {
  item.isOpen = !item.isOpen;
};

// Create New File
const handleCreateFile = (parentId: string | null, name: string) => {
  const newFile: FSItem = {
    id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    path: parentId ? `${getParentPath(parentId)}/${name}` : `/${name}`,
    isFolder: false,
    content: `# ${name}\n\ndef main():\n    print("Hello from ${name}!")\n\nif __name__ == "__main__":\n    main()\n`,
    parentId
  };

  if (parentId) {
    const parent = findItemById(workspaceItems.value, parentId);
    if (parent && parent.isFolder) {
      if (!parent.children) parent.children = [];
      parent.children.push(newFile);
      parent.isOpen = true;
    }
  } else {
    workspaceItems.value.push(newFile);
  }

  // 原生工作区：在磁盘上创建文件并写入初始内容
  if (workspaceRootPath.value) {
    const parentAbs = parentId
      ? absPath(workspaceRootPath.value, getParentPath(parentId))
      : workspaceRootPath.value;
    nativeApi.writeFile(absPath(parentAbs, `/${name}`), newFile.content).catch(() => {});
  }

  showToast(t('toastFileCreated').replace('{name}', name));
  openFileInTab(newFile);
};

// Create New Folder
const handleCreateFolder = (parentId: string | null, name: string) => {
  const newFolder: FSItem = {
    id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    path: parentId ? `${getParentPath(parentId)}/${name}` : `/${name}`,
    isFolder: true,
    parentId,
    isOpen: true,
    children: []
  };

  if (parentId) {
    const parent = findItemById(workspaceItems.value, parentId);
    if (parent && parent.isFolder) {
      if (!parent.children) parent.children = [];
      parent.children.push(newFolder);
      parent.isOpen = true;
    }
  } else {
    workspaceItems.value.push(newFolder);
  }

  // 原生工作区：在磁盘上创建真实文件夹
  if (workspaceRootPath.value) {
    const parentAbs = parentId
      ? absPath(workspaceRootPath.value, getParentPath(parentId))
      : workspaceRootPath.value;
    nativeApi.createDir(parentAbs, name).catch(() => {});
  }

  showToast(t('toastFolderCreated').replace('{name}', name));
};

// Rename File/Folder
const handleRenameItem = (item: FSItem, newName: string) => {
  const oldPath = item.path;
  item.name = newName;
  item.path = item.parentId ? `${getParentPath(item.parentId)}/${newName}` : `/${newName}`;

  // 文件夹重命名后同步子节点的相对路径
  if (item.isFolder && item.children) {
    rebaseChildrenPaths(item, oldPath, item.path);
  }

  // Update tabs if file renamed
  const tab = openTabs.value.find((t) => t.fileId === item.id);
  if (tab) {
    tab.name = newName;
    tab.path = item.path;
  }

  // 原生工作区：重命名磁盘上的真实文件/文件夹
  if (workspaceRootPath.value) {
    nativeApi.renamePath(absPath(workspaceRootPath.value, oldPath), newName).catch(() => {});
  }
  showToast(t('toastRenamed'));
};

// Delete File/Folder
const handleDeleteItem = (item: FSItem) => {
  requestDeleteItem(item);
};

const confirmDelete = () => {
  if (deleteTargetItem.value) {
    const item = deleteTargetItem.value;
    // 原生工作区：先删除磁盘上的真实文件/文件夹
    if (workspaceRootPath.value) {
      nativeApi.deletePath(absPath(workspaceRootPath.value, item.path)).catch(() => {});
    }
    removeItemFromTree(workspaceItems.value, item.id);
    // Close tab if open
    openTabs.value = openTabs.value.filter((t) => t.fileId !== item.id);
    if (activeEditorTabId.value === `tab-${item.id}`) {
      activeEditorTabId.value = openTabs.value.length > 0 ? openTabs.value[0].id : null;
    }
    pythonRunner.syncFileSystem(workspaceItems.value);
    showToast(t('toastFileDeleted').replace('{name}', item.name));
  }
  isDeleteDialogOpen.value = false;
  deleteTargetItem.value = null;
};

// Run file directly from tree
const handleRunFile = async (item: FSItem) => {
  openFileInTab(item);
  activeNavTab.value = 'explorer';

  consoleOutputs.value.push({
    id: Math.random().toString(36).substring(2),
    type: 'system',
    text: `▶ Executing ${item.name} from File Tree...`,
    timestamp: new Date().toLocaleTimeString()
  });

  await pythonRunner.runCode(item.content || '', workspaceItems.value, (out) => {
    consoleOutputs.value.push(out);
  }, config.value.demoMode);
};

// Download File
const handleDownloadFile = (item: FSItem) => {
  const blob = new Blob([item.content || ''], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t('toastExported').replace('{name}', item.name));
};

// Import uploaded files
const handleImportFiles = async (files: FileList) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const text = await file.text();
    const newFile: FSItem = {
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      path: `/${file.name}`,
      isFolder: false,
      content: text,
      parentId: null
    };
    workspaceItems.value.push(newFile);
  }
  showToast(t('toastImported'));
};

// Tab Management
const handleSelectTab = (tabId: string) => {
  activeEditorTabId.value = tabId;
};

// Unsaved changes confirmation state
const unsavedDialogState = ref<{
  isOpen: boolean;
  tabId: string | null;
  tabName: string;
}>({
  isOpen: false,
  tabId: null,
  tabName: ''
});

const handleCloseTab = (tabId: string) => {
  const tab = openTabs.value.find((t) => t.id === tabId);
  if (!tab) return;

  if (tab.isDirty) {
    unsavedDialogState.value = {
      isOpen: true,
      tabId: tab.id,
      tabName: tab.name
    };
  } else {
    forceCloseTab(tabId);
  }
};

const forceCloseTab = (tabId: string) => {
  const index = openTabs.value.findIndex((t) => t.id === tabId);
  if (index !== -1) {
    openTabs.value.splice(index, 1);
    if (activeEditorTabId.value === tabId) {
      activeEditorTabId.value = openTabs.value.length > 0
        ? openTabs.value[Math.max(0, index - 1)].id
        : null;
    }
  }
};

const handleUnsavedSave = () => {
  if (unsavedDialogState.value.tabId) {
    handleSaveTab(unsavedDialogState.value.tabId);
    forceCloseTab(unsavedDialogState.value.tabId);
  }
  unsavedDialogState.value.isOpen = false;
};

const handleUnsavedDontSave = () => {
  if (unsavedDialogState.value.tabId) {
    forceCloseTab(unsavedDialogState.value.tabId);
  }
  unsavedDialogState.value.isOpen = false;
};

const handleUnsavedCancel = () => {
  unsavedDialogState.value.isOpen = false;
};

const handleContentChange = (tabId: string, newContent: string) => {
  const tab = openTabs.value.find((t) => t.id === tabId);
  if (tab) {
    tab.content = newContent;
    tab.isDirty = tab.content !== tab.savedContent;
    // Scan imports from workspace + current unsaved buffer
    syncWorkspacePackages(workspaceItems.value, newContent);
  }
};

const handleSaveTab = (tabId: string) => {
  const tab = openTabs.value.find((t) => t.id === tabId);
  if (tab) {
    tab.savedContent = tab.content;
    tab.isDirty = false;
    
    // Only update workspace file item content on explicit save
    const file = findItemById(workspaceItems.value, tab.fileId);
    if (file) {
      file.content = tab.content;
    }
    // 原生工作区：同时写回磁盘
    if (workspaceRootPath.value) {
      nativeApi.writeFile(absPath(workspaceRootPath.value, tab.path), tab.content).catch(() => {});
    }
    syncWorkspacePackages(workspaceItems.value);
    showToast(t('toastFileSaved').replace('{name}', tab.name));
  }
};

// Tree Helper Utilities
function findItemById(items: FSItem[], id: string): FSItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.isFolder && item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getParentPath(parentId: string): string {
  const parent = findItemById(workspaceItems.value, parentId);
  return parent ? parent.path : '';
}

function removeItemFromTree(items: FSItem[], id: string): boolean {
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    return true;
  }
  for (const item of items) {
    if (item.isFolder && item.children) {
      if (removeItemFromTree(item.children, id)) return true;
    }
  }
  return false;
}

// 文件夹重命名后，把后代节点的相对路径前缀一并更新
function rebaseChildrenPaths(item: FSItem, oldPrefix: string, newPrefix: string) {
  if (!item.children) return;
  for (const child of item.children) {
    child.path = child.path.replace(oldPrefix, newPrefix);
    if (child.isFolder) rebaseChildrenPaths(child, oldPrefix, newPrefix);
  }
}

const activeTutorialSource = ref<{ id: string; title: string; isQuiz?: boolean; questionId?: string; expectedOutput?: string } | null>(null);
const activeTutorialTopicId = ref<string>(safeStorage.getItem('pystudio_last_tutorial_topic') || 'p1_home');
const activeQuizPassed = ref(false);

// Load tutorial code to editor
const handleLoadTutorialCodeToEditor = (payload: { code: string; topicId: string; topicTitle: string; isQuiz?: boolean; questionId?: string; expectedOutput?: string } | string) => {
  let code = '';
  let topicId = '';
  let topicTitle = '';
  let isQuiz = false;
  let questionId = '';
  let expectedOutput = '';

  if (typeof payload === 'string') {
    code = payload;
  } else if (payload && typeof payload === 'object') {
    code = payload.code || '';
    topicId = payload.topicId || '';
    topicTitle = payload.topicTitle || '';
    isQuiz = !!payload.isQuiz;
    questionId = payload.questionId || '';
    expectedOutput = payload.expectedOutput || '';
  }

  if (topicId) {
    activeTutorialSource.value = {
      id: topicId,
      title: (topicTitle || '对应教程') + (isQuiz ? '（测验）' : ''),
      isQuiz: isQuiz || undefined,
      questionId: questionId || undefined,
      expectedOutput: expectedOutput || undefined
    };
    activeTutorialTopicId.value = topicId;
  }
  if (isQuiz && questionId) {
    activeQuizPassed.value = getQuizQuestionResult(topicId, questionId) === 'pass';
  } else {
    activeQuizPassed.value = false;
  }

  activeNavTab.value = 'explorer';
  let demoFile = workspaceItems.value.find((item) => item.name === 'tutorial_demo.py');
  if (!demoFile) {
    demoFile = {
      id: 'tutorial_demo_' + Date.now(),
      name: 'tutorial_demo.py',
      path: '/tutorial_demo.py',
      isFolder: false,
      content: code,
      language: 'python',
      modifiedAt: new Date()
    };
    workspaceItems.value.push(demoFile);
  } else {
    demoFile.content = code;
  }
  // 本地工作区：首次（及每次）加载时把 tutorial_demo.py 落盘，保证重启后仍在工作区里
  if (workspaceRootPath.value) {
    nativeApi.writeFile(absPath(workspaceRootPath.value, '/tutorial_demo.py'), code).catch(() => {});
  }
  // Sync content to already-open tab so editor shows latest code immediately
  const existingTab = openTabs.value.find((t) => t.fileId === demoFile.id);
  if (existingTab) {
    existingTab.content = code;
    existingTab.savedContent = code;
    existingTab.isDirty = false;
  }
  openFileInTab(demoFile);
  showToast('已加载教程代码至编辑器');
};

const tutorialViewRef = ref<InstanceType<typeof TutorialView> | null>(null);

// 「返回对应教程」FAB：总是回到对应小节的教程文章页（不打开测验）
const handleReturnToTutorial = (topicId: string) => {
  activeNavTab.value = 'tutorial';
  if (topicId) {
    activeTutorialTopicId.value = topicId;
  } else {
    activeTutorialTopicId.value = safeStorage.getItem('pystudio_last_tutorial_topic') || 'p1_home';
  }
};

// 「检查答案」FAB（已答对）：回到对应小节的测验界面
const handleReturnToQuiz = (topicId: string) => {
  activeNavTab.value = 'tutorial';
  if (topicId) {
    activeTutorialTopicId.value = topicId;
  }
  nextTick(() => {
    tutorialViewRef.value?.openQuizExternally(activeTutorialTopicId.value);
  });
};

const handleQuizSubmit = async () => {
  const src = activeTutorialSource.value;
  if (!src?.isQuiz) {
    showToast('当前不是测验代码，无法提交');
    return;
  }
  const activeTab = openTabs.value.find((t) => t.id === activeEditorTabId.value);
  if (!activeTab) {
    showToast('请先打开测验代码');
    return;
  }
  const code = activeTab.content;
  const stdoutParts: string[] = [];
  const runResult = await pythonRunner.runCode(code, workspaceItems.value, (out) => {
    consoleOutputs.value.push(out);
    if (out.type === 'stdout') stdoutParts.push(out.text);
  }, config.value.demoMode);
  if (!runResult.success) {
    showToast('运行出错，请查看终端中的错误信息');
    return;
  }
  // 按“行序列”规范化比较：两种运行引擎（Pyodide / 演示模式）输出格式不同，
  // 拆行、去空行、去首尾空格后逐行比对，不考察 \n 转义写法
  const normalizeLines = (chunks: string[]): string[] => {
    const lines: string[] = [];
    for (const chunk of chunks) {
      const parts = chunk.replace(/\r\n/g, '\n').split('\n');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.length > 0) lines.push(trimmed);
      }
    }
    return lines;
  };
  const actualLines = normalizeLines(stdoutParts);
  const expectedLines = normalizeLines([src.expectedOutput || '']);
  const passed =
    actualLines.length === expectedLines.length &&
    actualLines.every((line, i) => line === expectedLines[i]);
  activeQuizPassed.value = passed;
  setQuizQuestionResult(src.id, src.questionId || '', passed ? 'pass' : 'fail');
  if (passed) {
    syncQuizCompletion(src.id);
    showToast('测验通过，输出完全正确！');
  } else {
    const truncate = (v: string) => (v.length > 40 ? v.slice(0, 40) + '...' : v);
    showToast('输出与预期不符：预期「' + truncate(expectedLines.join('\n')) + '」，实际「' + truncate(actualLines.join('\n')) + '」');
  }
};

const activeTabObject = computed(() => {
  return openTabs.value.find((t) => t.id === activeEditorTabId.value) || null;
});

const currentFileName = computed(() => {
  if (activeNavTab.value === 'tutorial') return 'Python 教程';
  if (activeNavTab.value === 'console') return '交互式终端';
  if (activeNavTab.value === 'packages') return '包管理器';
  if (activeNavTab.value === 'settings') return 'IDE 设置';
  return activeTabObject.value ? activeTabObject.value.name : 'PyStudio';
});

onMounted(() => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
});
</script>

<template>
  <div class="app-container" :style="{ '--sidebar-width': sidebarExpanded ? '256px' : '80px' }">
    <!-- 1. Left Navigation Sidebar (Extends 100% to top of app) -->
    <MD3Sidebar :expanded="sidebarExpanded">
      <!-- Top Section: Logo & Expand Toggle -->
      <template #top>
        <div class="brand-row">
          <div class="brand-identity">
            <MD3IconButton
              variant="standard"
              size="L"
              :icon="sidebarExpanded ? 'menu_open' : 'menu'"
              :title="sidebarExpanded ? t('collapseSidebar') : t('expandSidebar')"
              @click="sidebarExpanded = !sidebarExpanded"
            />
            <div v-if="sidebarExpanded" class="brand-info">
              <h1 class="brand-title" style="color: var(--primary);">PyStudio</h1>
            </div>
          </div>
        </div>
      </template>

      <!-- Middle Section: Nav Menu Items -->
      <template #middle>
        <nav class="sidebar-nav" :class="{ 'align-center-width': !sidebarExpanded }">
          <SidebarNavItem
            tab="explorer"
            :active-tab="activeNavTab"
            :label="t('navEditor')"
            icon="code"
            :expanded="sidebarExpanded"
            @select="tab => activeNavTab = tab"
          />
          <SidebarNavItem
            tab="tutorial"
            :active-tab="activeNavTab"
            :label="t('navTutorial')"
            icon="school"
            :expanded="sidebarExpanded"
            @select="tab => activeNavTab = tab"
          />
          <SidebarNavItem
            tab="console"
            :active-tab="activeNavTab"
            :label="t('navConsole')"
            icon="terminal"
            :expanded="sidebarExpanded"
            @select="tab => activeNavTab = tab"
          />
          <SidebarNavItem
            tab="packages"
            :active-tab="activeNavTab"
            :label="t('navPackages')"
            icon="extension"
            :expanded="sidebarExpanded"
            @select="tab => activeNavTab = tab"
          />
        </nav>
      </template>

      <!-- Bottom Section: Settings Tab -->
      <template #bottom>
        <SidebarNavItem
          tab="settings"
          :active-tab="activeNavTab"
          :label="t('navSettings')"
          icon="settings"
          :expanded="sidebarExpanded"
          @select="tab => activeNavTab = tab"
        />
      </template>
    </MD3Sidebar>

    <!-- 2. Right Main Column (Title Bar + Workspace Content) -->
    <div class="app-main-column" @click="closeMenus">
      <!-- Title Bar: Title on left, 3 window controls on right -->
      <div class="windows-title-bar" data-tauri-drag-region>
        <div v-if="activeNavTab === 'explorer'" class="app-top-menu-bar" @click.stop>
          <!-- File Menu -->
          <div class="menu-dropdown-wrapper">
            <button
              class="app-menu-btn"
              :class="{ 'is-active': activeMenu === 'file' }"
              @click="toggleMenu('file')"
            >
              {{ t('fileMenu') }}
            </button>
            <div v-if="activeMenu === 'file'" class="app-dropdown-menu" @click="closeMenus">
              <button class="menu-item-btn" @click="handleCreateFile(null, 'untitled.py')">
                <span class="material-symbols-rounded">note_add</span>
                <span>{{ t('newFile') }}</span>
                <span class="shortcut">Ctrl+N</span>
              </button>
              <button class="menu-item-btn" @click="handleCreateFolder(null, 'new_folder')">
                <span class="material-symbols-rounded">create_new_folder</span>
                <span>{{ t('newFolder') }}</span>
                <span class="shortcut">Ctrl+Shift+N</span>
              </button>
              <div class="menu-divider"></div>
              <button class="menu-item-btn" @click="handleMenuOpenFile">
                <span class="material-symbols-rounded">file_open</span>
                <span>{{ t('openFile') }}</span>
                <span class="shortcut">Ctrl+O</span>
              </button>
              <button class="menu-item-btn" @click="handleMenuOpenFolder">
                <span class="material-symbols-rounded">folder_open</span>
                <span>{{ t('openFolder') }}</span>
                <span class="shortcut">Ctrl+Shift+O</span>
              </button>
              <div class="menu-divider"></div>
              <button class="menu-item-btn" @click="activeEditorTabId && handleSaveTab(activeEditorTabId)">
                <span class="material-symbols-rounded">save</span>
                <span>{{ t('save') }}</span>
                <span class="shortcut">Ctrl+S</span>
              </button>
              <button class="menu-item-btn" @click="activeTabObject && handleDownloadFile(activeTabObject)">
                <span class="material-symbols-rounded">download</span>
                <span>{{ t('downloadFile') }}</span>
                <span class="shortcut">Ctrl+D</span>
              </button>
            </div>
          </div>

          <!-- Edit Menu -->
          <div class="menu-dropdown-wrapper">
            <button
              class="app-menu-btn"
              :class="{ 'is-active': activeMenu === 'edit' }"
              @click="toggleMenu('edit')"
            >
              {{ t('editMenu') }}
            </button>
            <div v-if="activeMenu === 'edit'" class="app-dropdown-menu" @click="closeMenus">
              <button class="menu-item-btn" @click="codeEditorRef?.triggerCopy()">
                <span class="material-symbols-rounded">content_copy</span>
                <span>{{ t('copy') }}</span>
                <span class="shortcut">Ctrl+C</span>
              </button>
              <button class="menu-item-btn" @click="codeEditorRef?.triggerCut()">
                <span class="material-symbols-rounded">content_cut</span>
                <span>{{ t('cut') }}</span>
                <span class="shortcut">Ctrl+X</span>
              </button>
              <button class="menu-item-btn" @click="codeEditorRef?.triggerPaste()">
                <span class="material-symbols-rounded">content_paste</span>
                <span>{{ t('paste') }}</span>
                <span class="shortcut">Ctrl+V</span>
              </button>
              <div class="menu-divider"></div>
              <button class="menu-item-btn" @click="codeEditorRef?.openFindBar()">
                <span class="material-symbols-rounded">search</span>
                <span>{{ t('find') }}</span>
                <span class="shortcut">Ctrl+F</span>
              </button>
              <button class="menu-item-btn" @click="codeEditorRef?.openReplaceBar()">
                <span class="material-symbols-rounded">find_replace</span>
                <span>{{ t('replace') }}</span>
                <span class="shortcut">Ctrl+H</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="title-bar-brand">
          <span class="title-text">PyStudio IDE</span>
        </div>
        <div class="windows-controls">
          <MD3IconButton
            id="titlebar-minimize"
            variant="standard"
            size="S"
            icon="minimize"
            :title="t('minimize')"
            @click="minimizeWindow"
          />
          <MD3IconButton
            id="titlebar-maximize"
            variant="standard"
            size="S"
            icon="crop_7_5"
            :title="t('maximize')"
            @click="maximizeWindow"
          />
          <MD3IconButton
            id="titlebar-close"
            variant="standard"
            size="S"
            icon="close"
            :title="t('close')"
            @click="closeWindow"
          />
        </div>
      </div>

      <!-- Main Layout Workspace -->
      <div class="app-layout-wrapper">

      <!-- 2. Attached File Management Tree (在侧边栏右侧粘连添加文件管理树) -->
      <FileTree
        v-if="activeNavTab === 'explorer'"
        :workspace-items="workspaceItems"
        :active-file-id="activeTabObject?.fileId || null"
        :collapsed="fileTreeCollapsed"
        :workspace-root="workspaceRootPath"
        @select-file="handleSelectFile"
        @toggle-folder="handleToggleFolder"
        @create-file="handleCreateFile"
        @create-folder="handleCreateFolder"
        @rename-item="handleRenameItem"
        @delete-item="requestDeleteItem"
        @run-file="handleRunFile"
        @download-file="handleDownloadFile"
        @toggle-collapse="fileTreeCollapsed = !fileTreeCollapsed"
        @contextmenu-filetree="(e, item) => openContextMenu(e, 'filetree', item)"
      />

      <!-- 3. Workspace Main View -->
      <main class="main-workspace">
        <!-- Explorer View / Multi-Tab Code Editor -->
        <CodeEditor
          v-if="activeNavTab === 'explorer'"
          ref="codeEditorRef"
          :tabs="openTabs"
          :active-tab-id="activeEditorTabId"
          :config="config"
          :workspace-files="workspaceItems"
          :console-outputs="consoleOutputs"
          :active-tutorial-source="activeTutorialSource"
          :quiz-question-passed="activeQuizPassed"
          :engine-label="engineLabel"
          :initial-cursors="sessionCursors"
          @cursor-change="handleCursorChange"
          @select-tab="handleSelectTab"
          @close-tab="handleCloseTab"
          @content-change="handleContentChange"
          @save-tab="handleSaveTab"
          @clear-console="consoleOutputs = []"
          @add-console-output="out => consoleOutputs.push(out)"
          @return-to-tutorial="handleReturnToTutorial"
          @return-to-quiz="handleReturnToQuiz"
          @quiz-submit="handleQuizSubmit"
          @contextmenu-editor="e => openContextMenu(e, 'editor')"
          @contextmenu-terminal="e => openContextMenu(e, 'terminal')"
        />

        <!-- Python Tutorial View -->
        <TutorialView
          ref="tutorialViewRef"
          v-else-if="activeNavTab === 'tutorial'"
          :active-topic-id-prop="activeTutorialTopicId"
          @update-active-topic="id => { activeTutorialTopicId = id; safeStorage.setItem('pystudio_last_tutorial_topic', id); }"
          @load-code-to-editor="handleLoadTutorialCodeToEditor"
          @contextmenu-tutorial="e => openContextMenu(e, 'tutorial')"
        />

        <!-- Interactive Python REPL Console View -->
        <REPLConsole
          v-else-if="activeNavTab === 'console'"
          :config="config"
          @add-console-output="out => consoleOutputs.push(out)"
          @contextmenu-terminal="e => openContextMenu(e, 'terminal')"
        />

        <!-- Package Manager View -->
        <PackageManager
          v-else-if="activeNavTab === 'packages'"
          :workspace-files="workspaceItems"
          @add-console-output="out => consoleOutputs.push(out)"
        />

        <!-- Settings View -->
        <div v-else-if="activeNavTab === 'settings'" class="settings-workspace-view">
          <PageHeader :title="t('settingsTitle')" :subtitle="t('settingsSubtitle')" />

          <div class="settings-grid">
            <!-- General Settings -->
            <MD3Card variant="outlined" class="settings-card full-width">
              <div class="settings-card-header">
                <h4 class="settings-card-title">{{ t('generalSettings') }}</h4>
              </div>
              <MD3List>
                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">palette</span>
                  </template>
                  <template #headline>{{ t('themeMode') }}</template>
                  <template #supporting>{{ t('themeModeSubtitle') }}</template>
                  <template #trailing>
                    <MD3Tabs
                      v-model="config.themeMode"
                      :options="[
                        { value: 'system', label: t('themeSystem') },
                        { value: 'light', label: t('themeLight') },
                        { value: 'dark', label: t('themeDark') }
                      ]"
                    />
                  </template>
                </MD3ListItem>

              </MD3List>
            </MD3Card>

            <!-- Editor Settings -->
            <MD3Card variant="outlined" class="settings-card full-width">
              <div class="settings-card-header">
                <h4 class="settings-card-title">{{ t('editorSettings') }}</h4>
              </div>

              <!-- Live Editor Preview -->
              <EditorPreview :config="config" />

              <MD3List>
                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">palette</span>
                  </template>
                  <template #headline>{{ t('codeTheme') }}</template>
                  <template #supporting>{{ t('codeThemeSubtitle') }}</template>
                  <template #trailing>
                    <MD3Select
                      v-model="config.codeTheme"
                      :options="[
                        { value: 'github-dark', label: 'GitHub Dark' },
                        { value: 'monokai', label: 'Monokai' },
                        { value: 'one-dark', label: 'One Dark' },
                        { value: 'vs-code', label: 'VS Code' },
                        { value: 'github-light', label: 'GitHub Light' }
                      ]"
                    />
                  </template>
                </MD3ListItem>

                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">format_size</span>
                  </template>
                  <template #headline>{{ t('fontSize') }}: {{ config.fontSize }}px</template>
                  <template #supporting>{{ t('fontSizeSubtitle') }}</template>
                  <template #trailing>
                    <div style="width: 140px;">
                      <MD3Slider v-model="config.fontSize" :min="12" :max="24" :step="1" variant="s"/>
                    </div>
                  </template>
                </MD3ListItem>

                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">pinch</span>
                  </template>
                  <template #headline>{{ t('enableWheelZoom') }}</template>
                  <template #supporting>{{ t('enableWheelZoomSubtitle') }}</template>
                  <template #trailing>
                    <MD3Switch v-model="config.enableWheelZoom" />
                  </template>
                </MD3ListItem>

                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">keyboard_tab</span>
                  </template>
                  <template #headline>{{ t('tabSize') }}</template>
                  <template #supporting>{{ t('tabSizeSubtitle') }}</template>
                  <template #trailing>
                    <MD3Tabs
                      v-model="config.tabSize"
                      :options="[
                        { value: 2, label: '2 Spaces' },
                        { value: 4, label: '4 Spaces' }
                      ]"
                    />
                  </template>
                </MD3ListItem>

                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">format_quote</span>
                  </template>
                  <template #headline>{{ t('autoPairQuotes') }}</template>
                  <template #supporting>{{ t('autoPairQuotesSubtitle') }}</template>
                  <template #trailing>
                    <MD3Switch v-model="config.autoPairQuotes" />
                  </template>
                </MD3ListItem>
              </MD3List>
            </MD3Card>
                        <!-- About PyStudio -->
            <MD3Card variant="outlined" class="settings-card full-width">
              <div class="settings-card-header">
                <h4 class="settings-card-title">{{ t('aboutTitle') }}</h4>
              </div>
              <MD3List>
                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">terminal</span>
                  </template>
                  <template #headline>{{ t('aboutApp') }}</template>
                  <template #supporting>{{ t('aboutAppDesc') }}</template>
                  <template #trailing>
                    <MD3Badge>v0.3.0</MD3Badge>
                  </template>
                </MD3ListItem>

                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded">slideshow</span>
                  </template>
                  <template #headline>{{ t('demoMode') }}</template>
                  <template #supporting>{{ t('demoModeSubtitle') }}</template>
                  <template #trailing>
                    <MD3Switch v-model="config.demoMode" />
                  </template>
                </MD3ListItem>

                <MD3ListItem>
                  <template #leading>
                    <span class="material-symbols-rounded" style="color: var(--primary);">auto_awesome</span>
                  </template>
                  <template #headline>{{ t('aiEngine') }}</template>
                  <template #supporting>{{ t('aiEngineDesc') }}</template>
                </MD3ListItem>
              </MD3List>
            </MD3Card>
          </div>
        </div>
      </main>
    </div>
    </div>

    <!-- App Initialization Loading Modal -->
    <MD3LoadingModal :show="isInitializing" />

    <!-- Snackbar Notification Toast -->
    <MD3Snackbar :message="toastMessage || ''" @close="toastMessage = null" />

    <!-- Delete Confirmation Dialog -->
    <MD3Dialog
      :visible="isDeleteDialogOpen"
      :title="t('confirmDeleteTitle')"
      :content="t('confirmDeleteMsg').replace('{name}', deleteTargetItem?.name || '')"
      :confirm-text="t('delete')"
      :cancel-text="t('cancel')"
      danger
      @confirm="confirmDelete"
      @cancel="isDeleteDialogOpen = false"
      @close="isDeleteDialogOpen = false"
    />

    <!-- Unsaved Changes Confirmation Dialog -->
    <MD3Dialog
      :visible="unsavedDialogState.isOpen"
      :title="t('unsavedChangesTitle')"
      :content="t('unsavedChangesMsg').replace('{name}', unsavedDialogState.tabName)"
      :confirm-text="t('save')"
      :secondary-text="t('dontSave')"
      :cancel-text="t('cancel')"
      icon="save"
      @confirm="handleUnsavedSave"
      @secondary="handleUnsavedDontSave"
      @cancel="handleUnsavedCancel"
      @close="handleUnsavedCancel"
    />

    <!-- Custom Right-Click Context Menu -->
    <ContextMenu
      :visible="contextMenuState.visible"
      :x="contextMenuState.x"
      :y="contextMenuState.y"
      :type="contextMenuState.type"
      :target-item="contextMenuState.targetItem"
      @close="closeContextMenu"
      @copy="handleContextMenuCopy"
      @cut="codeEditorRef?.triggerCut()"
      @paste="codeEditorRef?.triggerPaste()"
      @find="codeEditorRef?.openFindBar()"
      @replace="codeEditorRef?.openReplaceBar()"
      @save="activeEditorTabId && handleSaveTab(activeEditorTabId)"
      @new-file="handleCreateFile(contextMenuState.targetItem?.isFolder ? contextMenuState.targetItem.id : null, 'untitled.py')"
      @new-folder="handleCreateFolder(contextMenuState.targetItem?.isFolder ? contextMenuState.targetItem.id : null, 'new_folder')"
      @rename="item => handleRenameItem(item, item.name)"
      @delete="item => requestDeleteItem(item)"
      @run="item => handleRunFile(item)"
      @reveal-in-explorer="handleRevealInExplorer"
    />

    <!-- Hidden file inputs for menu open file/folder -->
    <input ref="openFileInputRef" type="file" accept=".py,.txt,.json,.md" style="display:none" @change="handleFileInputChange" />
    <input ref="openFolderInputRef" type="file" style="display:none" webkitdirectory directory @change="handleFileInputChange" />
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
  color: var(--text-color);
  display: flex;
  flex-direction: row;
  font-family: var(--font-sans);
  position: relative;
  overflow: hidden;
}

.app-main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.windows-title-bar {
  height: 36px;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  z-index: 10;
  user-select: none;
  flex-shrink: 0;
  position: relative;
}

.title-bar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.title-icon {
  font-size: 18px;
  color: var(--primary);
}

.windows-controls {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  height: 36px;
  z-index: 35000;
}

.win-btn {
  width: 46px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.1s;
}

.win-btn:hover {
  background-color: var(--border-color-muted);
}

.win-close:hover {
  background-color: #e81123 !important;
  color: #ffffff !important;
}

.app-layout-wrapper {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: calc(100vh - 36px);
  overflow: hidden;
}

.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.settings-workspace-view {
  padding: 2rem;
  overflow-y: auto;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.settings-card {
  padding: 1.25rem;
  gap: 1.25rem;
}

.settings-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--secondary);
}


/* Top Menu Bar (File & Edit) */
.app-top-menu-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
}

.menu-dropdown-wrapper {
  position: relative;
}

.app-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-color);
  border: none;
  color: var(--text-color);
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s;
  height: 28px;
  user-select: none;
  white-space: nowrap;
  flex-shrink: 0;

  opacity: 0.5;
}

.app-menu-btn:hover, .app-menu-btn.is-active {
  background-color: var(--border-color-muted);
}

.app-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 16px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.3);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 1000;
  min-width: 240px;
  width: max-content;
}

.menu-item-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--text-color);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.1s;
  width: 100%;
  white-space: nowrap;
}

.menu-item-btn:hover {
  background-color: var(--surface-variant);
  color: var(--primary);
}

.menu-item-btn span.material-symbols-rounded {
  font-size: 18px;
}

.menu-item-btn .shortcut {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  padding-left: 20px;
  opacity: 0.8;
  flex-shrink: 0;
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color-muted);
  margin: 4px 0;
}
</style>
