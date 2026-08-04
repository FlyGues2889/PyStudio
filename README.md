# Python You - 轻量级 Python IDE & 交互式学习平台

> **AI 项目提示** &nbsp;  人工智能参与了项目的开发。

**Python You** 是一款基于 WebAssembly (Pyodide) 与 Material You 设计风格打造的轻量级桌面端 Python 集成开发环境与交互式教学平台。

无需安装任何本地 Python 环境或复杂依赖就可拥有完整的 Python 3.11 运行环境，并支持文件管理、包管理、交互式 REPL 终端；每个教程小节还配有课后测验，帮助你随时检验学习成果。

### 屏幕截图
<center>

![屏幕截图1](/docs/screenshoot1.png "屏幕截图")

![屏幕截图2](/docs/screenshoot2.png "屏幕截图")

![屏幕截图3](/docs/screenshoot3.png "屏幕截图")
</center>

### 零门槛
- **下载即用**：免于安装，点开软件既可马上开始使用。
- **前端 WASM 驱动**：基于 Pyodide将 CPython 3.11 编译为 WebAssembly，实现 100% 纯客户端本地运行。
- **本机 Python 引擎**：自动检测本机 Python 环境，存在时切换为真实子进程执行——运行更快、可安装任意 pip 包、支持真正的中断运行；未安装时自动降级到 Pyodide / 演示模式，保持零配置体验。
- **无需配置环境**：无需安装 CPython、pip 或系统环境变量。

### 外观设计
- **Material You 规范**：遵循 Material 3 Expressive 设计语言。

### 教程与 IDE
- **系统化 Python 课程**：涵盖基础语法、容器数据结构、控制流、函数与面向对象、标准库/文件 I/O、数据可视化等 6 大阶段，另附 Python 参考手册速查。
- **代码一键导入 IDE**：教程中的代码片段可一键导入至 `tutorial_demo.py` 中实时运行并检验效果。
- **智能悬浮 FAB**：编写与调试代码时，可随时通过右下角悬浮按钮回到对应教程知识点，或跳转到对应小节的测验页面。

### 课后测验
- **每节一测**：大部分教程小节配有课后测验，题型包含**选择题**与**代码题**。
- **代码题实战作答**：代码题可一键「放入编辑器作答」，在编辑器窗口中修改并运行，通过右下角「检查答案」悬浮按钮自动比对预期输出。
- **即时反馈与持久化**：答对即标记通过，答错会提示输出差异；测验成绩与进度自动保存，关闭重开仍然保留。

## 应用内教程章节概览

| 阶段 | 模块名称 | 核心知识点 |
| :--- | :--- | :--- |
| **Stage 1** | Python 教程 | 环境与入门、语法与注释、变量与内存绑定、数据类型、数字与类型转换、字符串与切片、布尔值与运算符 |
| **Stage 2** | Python 容器 | 列表 List、元组 Tuple、集合 Set、字典 Dict 及其推导式 |
| **Stage 3** | Python 控制流 | 条件分支 if-else、while/for 循环、输入输出与 f-string 格式化 |
| **Stage 4** | Python 函数与对象 | 函数与参数、Lambda 表达式、类与继承、多态、生成器与 LEGB 作用域 |
| **Stage 5** | Python 标准库 | 模块导入、datetime、math、json、正则表达式、pip 包管理、异常处理与文件读写 |
| **Stage 6** | Python 数据可视化 | Matplotlib 2D 绘图、折线图、散点图与自定义图表样式 |
| **Ref** | Python 参考手册 | Python 命令行参数、内置 API 速查表、python -m 实用模块 |

---

## 本地开发与构建
项目采用 tauri2.0 + vite + vue 构建。

### 安装依赖

```bash
pnpm install
```

### 启动vite服务器并构建生产产物

```bash
pnpm run dev

pnpm run build
```

### 使用 Tauri 启动

```bash
pnpm run tauri dev
```

### 构建 Tauri 应用

```bash
pnpm run tauri build
```

---

## 开源许可
MIT License
