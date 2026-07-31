export default {
  appName: "PyStudio IDE",
  appDesc: "基于本地环境与 Pyodide 引擎的轻量级 Python IDE 集成开发环境",
  
  // Navigation Tabs
  tabExplorer: "文件与编辑器",
  tabConsole: "交互式终端",
  tabPackages: "包管理器",
  tabSettings: "IDE 设置",

  // Page Titles
  pageTitleExplorer: "项目工作区",
  pageSubtitleExplorer: "管理本地 Python 代码文件树与编辑器视图。",
  pageTitleConsole: "Python 交互式终端 (REPL)",
  pageSubtitleConsole: "即时执行 Python 语句与表达式，查看即时结果。",
  pageTitlePackages: "Pyodide 包管理器",
  pageSubtitlePackages: "查看并安装 Python 科学计算与常用工具扩展库。",
  pageTitleSettings: "IDE 偏好设置",
  pageSubtitleSettings: "自定义代码编辑器外观、字体大小、缩进与运行配置。",

  // File Tree
  fileTreeTitle: "项目文件树",
  newFile: "新建文件",
  newFolder: "新建文件夹",
  rename: "重命名",
  delete: "删除",
  runFile: "运行 Python 脚本",
  downloadFile: "导出下载",
  collapseAll: "全部收起",
  expandAll: "全部展开",
  searchFiles: "搜索过滤文件...",
  confirmDelete: "确定要删除文件/文件夹 \"{name}\" 吗？",
  emptyWorkspace: "项目工作区暂无文件",

  // Editor
  runCode: "运行代码",
  stopExecution: "停止",
  clearConsole: "清空终端",
  unsavedChanges: "未保存修改",
  saveFile: "保存 (Ctrl+S)",
  insertSnippet: "常用代码片段",
  selectFilePrompt: "请从左侧文件树选择或新建一个 Python 文件开始编写代码",
  lineCol: "第 {line} 行，第 {col} 列",

  // Terminal & Console
  terminalTitle: "运行终端输出",
  executionFinished: "进程运行完毕，退出码 {code}，耗时 {time}ms",
  runningCode: "正在运行 Python 脚本...",
  executingStatement: "正在执行语句...",
  pyodideLoading: "正在初始化 Pyodide 原生 Python 3.11 引擎...",
  pyodideReady: "Pyodide Python 3.11 运行环境就绪！",
  pyodideError: "加载 Pyodide 引擎失败，已切回备用解析器。",

  // Settings
  themeMode: "界面主题",
  themeModeAuto: "自动 (跟随系统)",
  themeModeLight: "浅色模式",
  themeModeDark: "深色模式",
  fontSize: "编辑器字体大小 (px)",
  tabSize: "Tab 缩进空格数",
  wordWrap: "自动换行",
  showLineNumbers: "显示代码行号",
  aboutIDE: "关于 PyStudio IDE",
  version: "版本号",
  author: "开发者"
};
