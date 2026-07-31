# PyStudio - 轻量级 Python IDE & 交互式学习平台

> **AI 项目提示** &nbsp;  Gemini 参与了项目的开发。

**PyStudio** 是一款基于 WebAssembly (Pyodide) 与 Material You 设计风格打造的轻量级桌面端 Python 集成开发环境与交互式教学平台。

无需安装任何本地 Python 环境或复杂依赖就可拥有完整的 Python 3.11 运行环境，并支持文件管理、包管理、交互式 REPL 终端。

### 屏幕截图
<center>

![屏幕截图1](/docs/screenshoot1.png "屏幕截图")

![屏幕截图2](/docs/screenshoot2.png "屏幕截图")

![屏幕截图3](/docs/screenshoot3.png "屏幕截图")
</center>

### 零门槛
- **前端 WASM 驱动**：基于 Pyodide将 CPython 3.11 编译为 WebAssembly，实现 100% 纯客户端本地运行。
- **无需配置环境**：无需安装 CPython、pip 或系统环境变量，开箱即用。
- **隐私与安全沙盒**：代码与文件完全运行在浏览器沙盒中，零数据外传风险，支持离线或低网速环境运行。

### 外观设计与国际化
- **Material You 规范**：遵循 Material 3 Expressive 设计语言。
- **双语与主题切换**：内置**中/英文 (zh/en) 国际化**与高对比度**深色/浅色模式**无缝切换。

### 教程与 IDE 联动
- **系统化 Python 课程**：涵盖基础语法、容器数据结构、控制流、面向对象编程、标准库/文件 I/O、数据可视化及 CLI 调优等 6 大阶段。
- **代码一键导入 IDE**：教程中的代码片段可一键导入至 `tutorial_demo.py` 中实时运行并检验效果。
- **智能悬浮返回 FAB**：在 IDE 编写和调试代码时，可通过悬浮按钮一键跳转回对应的教程知识点。


## 应用内教程章节概览

| 阶段 | 模块名称 | 核心知识点 |
| :--- | :--- | :--- |
| **Stage 1** | Python 基础语法 | 环境介绍、变量内存绑定、数据类型、字符串切片、运算符与优先级 |
| **Stage 2** | 容器与数据结构 | 列表 List、元组 Tuple、集合 Set、字典 Dict 及其推导式 |
| **Stage 3** | 程序控制流 | 条件分支 if-else、while/for 循环、迭代器、输入输出与 f-string 格式化 |
| **Stage 4** | 函数与面向对象 | 函数参数、Lambda 表达式、类与继承、多态、生成器与 LEGB 作用域 |
| **Stage 5** | 标准库与文件 I/O | 模块导入、datetime、math、json、正则表达式、异常处理与文件读写 |
| **Stage 6** | 数据可视化 | Matplotlib 2D 绘图、折线图、散点图与自定义图表样式 |
| **Ref** | CLI 与内置 API | 35 个保留关键字、内置 API 速查表、python -m 实用模块 |

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
