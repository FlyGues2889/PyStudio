import { ref, computed } from 'vue';
import { safeStorage } from './storage';

export type Language = 'zh' | 'en';

export const currentLanguage = ref<Language>('zh');

export function setLanguage(lang: Language) {
  currentLanguage.value = lang;
  safeStorage.setItem('pystudio_lang', lang);
}

const translations = {
  zh: {
    // Navigation Sidebar
    navEditor: '编辑',
    navTutorial: '教程',
    navConsole: '交互终端',
    navPackages: '扩展包',
    navSettings: '设置',
    explorer: '代码编辑',
    tutorial: 'Python 教程',
    console: '交互终端',
    packages: '扩展包',
    settings: '设置',
    expandSidebar: '展开侧边栏',
    collapseSidebar: '收起侧边栏',

    // Title bar controls & menus
    minimize: '最小化',
    maximize: '最大化',
    close: '关闭',
    fileMenu: '文件',
    editMenu: '编辑',
    newFile: '新建文件',
    newFolder: '新建文件夹',
    openFile: '打开文件',
    openFolder: '打开文件夹',
    save: '保存',
    downloadFile: '下载文件',
    copy: '复制',
    cut: '剪切',
    paste: '粘贴',
    find: '查找',
    replace: '替换',

    // Settings View
    settingsTitle: 'IDE 系统偏好设置',
    settingsSubtitle: '自定义 PyStudio 的外观主题、语言与代码编辑器配置',
    generalSettings: '通用设置',
    language: '界面语言',
    languageSubtitle: '选择 IDE 的系统显示语言',
    themeMode: '外观主题',
    themeSubtitle: '切换深色或浅色外观模式',
    themeModeSubtitle: '切换深色或浅色外观模式',
    themeSystem: '跟随系统',
    themeLight: '浅色',
    themeDark: '深色',

    editorSettings: '编辑器配置',
    codeTheme: '代码颜色风格',
    codeThemeSubtitle: '选择高亮配色主题方案',
    fontSize: '代码字体大小',
    fontSizeSubtitle: '调整代码编辑器中的文字大小',
    enableWheelZoom: 'Ctrl + 滚轮缩放字体',
    enableWheelZoomSubtitle: '开启后可在代码编辑器中按住 Ctrl 键滚动鼠标滚轮调整字号',
    tabSize: 'Tab 缩进空格数',
    tabSizeSubtitle: '按 Tab 键自动插入的空格数',

    aboutTitle: '关于 PyStudio IDE',
    aboutApp: 'PyStudio Python IDE',
    aboutAppDesc: '基于浏览器 WASM 与 Pyodide 的本地 Python 集成开发环境',
    demoMode: '演示模式',
    demoModeSubtitle: '开启后使用轻量演示引擎，关闭则使用离线完整 Python WASM 引擎',
    aiEngine: 'AI 辅助开发引擎',
    aiEngineDesc: '由 Gemini AI 提供辅助开发与智能技术支持',

    // Code Editor & Tabs
    welcomeTitle: '欢迎使用 PyStudio Python IDE',
    welcomeSubtitle: '请从左侧文件树选择一个 Python 文件或点击上方“新建文件”开始编码。',
    shortcutSave: '保存文件',
    shortcutRun: '运行脚本',
    runCode: '运行代码',
    stopCode: '停止运行',
    noOpenTabs: '暂无打开的文件',
    terminalOutput: '运行终端输出',
    clearTerminal: '清空终端记录',
    toggleTerminal: '展开/收起终端',
    terminalPlaceholder: '点击“运行代码”按钮以在此处打印输出...',
    findPlaceholder: '查找内容...',
    replacePlaceholder: '替换为...',
    findNext: '下一个',
    findPrev: '上一个',
    replaceBtn: '替换',
    replaceAllBtn: '全部替换',
    noMatches: '无匹配',

    // File Tree & Context Menu
    workspace: '工作区文件',
    newFileTooltip: '新建文件',
    newFolderTooltip: '新建文件夹',
    importFilesTooltip: '导入文件',
    collapseTreeTooltip: '折叠文件树',
    expandTreeTooltip: '展开文件树',
    searchFiles: '搜索工作区文件...',
    folderNamePlaceholder: '文件夹名称...',
    fileNamePlaceholder: '文件名.py',
    noMatchingFiles: '暂无匹配文件',
    rename: '重命名',
    delete: '删除',
    run: '运行',
    runScriptTooltip: '运行此脚本',
    downloadExport: '下载导出',

    // REPL Console
    replTitle: 'Python 3.11 交互式 REPL 终端',
    clearTerminalTooltip: '清空控制台记录',
    replPlaceholder: '输入 Python 语句 (例如: print(2 ** 10) 或 import math)...',
    execute: '执行',

    // Package Manager
    pkgTitle: 'Python 拓展包管理器 (Pyodide / PyPI)',
    pkgSubtitle: '搜索并一键安装纯 Python 扩展包及标准 Pyodide 轮子包',
    pkgSearchPlaceholder: '输入 PyPI / Pyodide 包名称 (如: pillow)...',
    installPkg: '一键安装',
    installing: '正在安装...',
    installed: '已安装',
    available: '可安装',
    ready: '已准备就绪',
    loadPkg: '一键加载包',
    installedTag: '已下载',
    availableTag: '未下载',
    uninstall: '卸载',
    uninstallPkg: '卸载包',
    installedSectionTitle: '已安装拓展包',
    availableSectionTitle: '可载入拓展包',

    // Dialogs & Toasts
    confirmDeleteTitle: '确认删除',
    confirmDeleteMsg: '确定要删除 "{name}" 吗？此操作无法撤销。',
    unsavedChangesTitle: '未保存的更改',
    unsavedChangesMsg: '文件 "{name}" 存在未保存的更改。是否在关闭前保存？',
    dontSave: '不保存',
    cancel: '取消',
    confirm: '确认',
    toastFileSaved: '已保存文件 "{name}"',
    toastFileDeleted: '已删除 "{name}"',
    toastFileCreated: '成功新建文件 "{name}"',
    toastFolderCreated: '成功新建文件夹 "{name}"',
    toastRenamed: '成功重命名',
    toastExported: '文件 "{name}" 已导出下载',
    toastImported: '已成功导入文件',
    returnToTutorial: '回到对应教程',
    expandFileTree: '展开文件树',
    collapseFileTree: '收起文件树'
  },
  en: {
    // Navigation Sidebar
    navEditor: 'Editor',
    navTutorial: 'Tutorial',
    navConsole: 'Interactive Console',
    navPackages: 'Packages',
    navSettings: 'Settings',
    explorer: 'Editor',
    tutorial: 'Tutorials',
    console: 'Console',
    packages: 'Packages',
    settings: 'Settings',
    expandSidebar: 'Expand Sidebar',
    collapseSidebar: 'Collapse Sidebar',

    // Title bar controls & menus
    minimize: 'Minimize',
    maximize: 'Maximize',
    close: 'Close',
    fileMenu: 'File',
    editMenu: 'Edit',
    newFile: 'New File',
    newFolder: 'New Folder',
    openFile: 'Open File',
    openFolder: 'Open Folder',
    save: 'Save',
    downloadFile: 'Download File',
    copy: 'Copy',
    cut: 'Cut',
    paste: 'Paste',
    find: 'Find',
    replace: 'Replace',

    // Settings View
    settingsTitle: 'IDE Preferences',
    settingsSubtitle: 'Customize PyStudio appearance, language and code editor configurations',
    generalSettings: 'General Settings',
    language: 'Language',
    languageSubtitle: 'Select IDE system display language',
    themeMode: 'Color Theme',
    themeSubtitle: 'Switch between dark and light appearance modes',
    themeModeSubtitle: 'Switch between dark and light appearance modes',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',

    editorSettings: 'Editor Configuration',
    codeTheme: 'Code Syntax Theme',
    codeThemeSubtitle: 'Select code highlighting color scheme',
    fontSize: 'Font Size',
    fontSizeSubtitle: 'Adjust code editor font size (px)',
    enableWheelZoom: 'Ctrl + Wheel Zoom',
    enableWheelZoomSubtitle: 'Hold Ctrl and scroll mouse wheel in editor to adjust font size',
    tabSize: 'Tab Indent Size',
    tabSizeSubtitle: 'Number of spaces inserted per Tab key press',

    aboutTitle: 'About PyStudio IDE',
    aboutApp: 'PyStudio Python IDE',
    aboutAppDesc: 'Local Python IDE powered by WebAssembly & Pyodide',
    demoMode: 'Demo Mode',
    demoModeSubtitle: 'Enable to use lightweight demo engine, disable for full offline Python WASM engine',
    aiEngine: 'AI Assist Engine',
    aiEngineDesc: 'Powered by Gemini AI for smart development support',

    // Code Editor & Tabs
    welcomeTitle: 'Welcome to PyStudio Python IDE',
    welcomeSubtitle: 'Select a Python file from the left file tree or click New File above to start coding.',
    shortcutSave: 'Save File',
    shortcutRun: 'Run Script',
    runCode: 'Run Code',
    stopCode: 'Stop Code',
    noOpenTabs: 'No files open',
    terminalOutput: 'Terminal Output',
    clearTerminal: 'Clear Terminal',
    toggleTerminal: 'Toggle Terminal',
    terminalPlaceholder: 'Click "Run Code" button to print output here...',
    findPlaceholder: 'Find content...',
    replacePlaceholder: 'Replace with...',
    findNext: 'Next',
    findPrev: 'Prev',
    replaceBtn: 'Replace',
    replaceAllBtn: 'Replace All',
    noMatches: 'No matches',

    // File Tree & Context Menu
    workspace: 'Workspace Files',
    newFileTooltip: 'New File',
    newFolderTooltip: 'New Folder',
    importFilesTooltip: 'Import Files',
    collapseTreeTooltip: 'Collapse Tree',
    expandTreeTooltip: 'Expand Tree',
    searchFiles: 'Search workspace files...',
    folderNamePlaceholder: 'Folder name...',
    fileNamePlaceholder: 'Filename.py',
    noMatchingFiles: 'No matching files',
    rename: 'Rename',
    delete: 'Delete',
    run: 'Run',
    runScriptTooltip: 'Run this script',
    downloadExport: 'Download Export',

    // REPL Console
    replTitle: 'Python 3.11 Interactive REPL Terminal',
    clearTerminalTooltip: 'Clear console output history',
    replPlaceholder: 'Type Python statement (e.g., print(2 ** 10) or import math)...',
    execute: 'Execute',

    // Package Manager
    pkgTitle: 'Python Package Manager (Pyodide / PyPI)',
    pkgSubtitle: 'Search and install pure Python & Pyodide wheels with one click',
    pkgSearchPlaceholder: 'Enter PyPI / Pyodide package name (e.g., pillow)...',
    installPkg: 'Install Package',
    installing: 'Installing...',
    installed: 'Installed',
    available: 'Available',
    ready: 'Ready',
    loadPkg: 'Install Package',
    installedTag: 'Installed',
    availableTag: 'Available',
    uninstall: 'Uninstall',
    uninstallPkg: 'Uninstall',
    installedSectionTitle: 'Installed Packages',
    availableSectionTitle: 'Available Extension Packages',

    // Dialogs & Toasts
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMsg: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    unsavedChangesTitle: 'Unsaved Changes',
    unsavedChangesMsg: 'File "{name}" has unsaved changes. Do you want to save before closing?',
    dontSave: 'Don\'t Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    toastFileSaved: 'Saved file "{name}"',
    toastFileDeleted: 'Deleted "{name}"',
    toastFileCreated: 'Created file "{name}"',
    toastFolderCreated: 'Created folder "{name}"',
    toastRenamed: 'Successfully renamed',
    toastExported: 'File "{name}" exported',
    toastImported: 'Successfully imported files',
    returnToTutorial: 'Return to Tutorial',
    expandFileTree: 'Expand File Tree',
    collapseFileTree: 'Collapse File Tree'
  }
};

export function t(key: keyof typeof translations['zh']): string {
  const lang = currentLanguage.value;
  return translations[lang]?.[key] || translations['zh'][key] || key;
}

export function useI18n() {
  return {
    lang: currentLanguage,
    t: (key: keyof typeof translations['zh']) => t(key),
    setLanguage
  };
}
