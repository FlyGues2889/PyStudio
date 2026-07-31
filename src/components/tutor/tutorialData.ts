export interface TutorialTopic {
  id: string;
  title: string;
  stage: string;
  summary: string;
  content: {
    overview: string;
    sections: {
      heading: string;
      text: string;
      table?: {
        headers: string[];
        rows: string[][];
      };
      code?: string;
      notes?: string;
    }[];
    codeExample?: string;
    tips?: string[];
  };
}

export interface TutorialStage {
  id: string;
  title: string;
  icon?: string;
  subcategories?: {
    id: string;
    title: string;
    topics: TutorialTopic[];
  }[];
  topics?: TutorialTopic[];
}

export const TUTORIAL_STAGES: TutorialStage[] = [
  {
    id: 'stage1',
    title: '阶段1：零基础基础语法',
    icon: 'auto_stories',
    topics: [
      {
        id: 'p1_home',
        title: 'Python教程首页',
        stage: '阶段1：零基础基础语法',
        summary: '欢迎使用 PyStudio Python 官方教学指导手册。系统梳理 Python 核心知识体系与现代编程范式。',
        content: {
          overview: 'Python 是一种面向对象、强类型动态语法的解释型高级程序设计语言。其语法架构注重代码可读性与表达简洁性，广泛应用于系统软件开发、数据科学分析、机器学习、自动化工程及 Web 系统构建。',
          sections: [
            {
              heading: '核心技术优势与设计哲学',
              text: '1. 极佳的语言可读性：规范化的语法强制缩进与明确的关键字设计，大幅降低团队代码维护成本。\n2. 完备的生态系统：拥有超过 30 万个涵盖科学计算（NumPy, Pandas）、网络通信与人工智能的拓展模块。\n3. 高度的跨平台抽象：同一套源代码可运行于 Windows, macOS, Linux 及基于 WebAssembly (Pyodide) 的现代化浏览器端。',
              notes: '说明：本系统内置 Python 3.11 WASM 运行引擎，可在页面中直接对各项示例代码进行实时验证与调试。'
            }
          ],
          codeExample: `# Python 3.11 核心特性测试与系统环境输出\nimport sys\n\nprint(f"PyStudio 解释器环境: Python {sys.version.split()[0]}")\nprint("核心系统就绪，欢迎开启 Python 编程学习。")`,
          tips: [
            '点击代码块右上角的“在编辑器中载入”按钮，可将当前教学示例快速同步至主编辑器并执行。',
            '建议按照从阶段 1 至阶段 6 的知识层级顺序循序渐进地学习。'
          ]
        }
      },
      {
        id: 'p1_intro',
        title: 'Python简介',
        stage: '阶段1：零基础基础语法',
        summary: '深入理解 Python 的发展历史、架构哲学及《Python 之禅》规范。',
        content: {
          overview: 'Python 由 Guido van Rossum 于 1989 年圣诞节期间创建，首个正式版本于 1991 年发布。Python 采用了模块化设计，具备极佳的易扩展性，可以通过 C/C++ 语言编写底层性能关键组件。',
          sections: [
            {
              heading: '《Python 之禅》（PEP 20）架构哲学',
              text: '执行 `import this` 可以输出 Python 核心设计指南，其核心思想包括：\n• 优美胜于丑陋 (Beautiful is better than ugly)\n• 明确胜于隐晦 (Explicit is better than implicit)\n• 简洁胜于复杂 (Simple is better than complex)\n• 复合胜于晦涩 (Complex is better than complicated)',
              code: `import this  # 导入并输出 PEP 20 架构规范原文`
            }
          ],
          codeExample: `import sys\nimport platform\n\nprint("操作系统架构:", platform.machine())\nprint("Python 实现名称:", sys.implementation.name)\nprint("最大整数位数限制:", sys.int_info.digits_per_digit)`,
          tips: ['《Python 之禅》是写出标准 Pythonic 代码的技术准则。']
        }
      },
      {
        id: 'p1_setup',
        title: 'Python入门（环境与解释器流程）',
        stage: '阶段1：零基础基础语法',
        summary: '解析 Python 字节码编译与解释执行全流程，掌握 PyStudio 中的交互机制。',
        content: {
          overview: 'Python 源代码（.py）在运行过程中首先由编译器转化为字节码（.pyc），随后由 CPython 虚拟机（PVM）逐行解释执行。在 PyStudio 中，解释器通过 WebAssembly 被编译为本地高效二进制直接在浏览器沙箱内运行。',
          sections: [
            {
              heading: '代码编译与执行生命周期',
              text: '1. 词法分析与语法分析：生成抽象语法树（AST）。\n2. 字节码生成：编译为底层的 PVM 指令集。\n3. 虚拟机执行：对字节码进行内存分配与垃圾回收管理。\n4. 标准流重定向：将 stdout 与 stderr 数据实重定向至页面终端。',
              code: `# 验证解释器对动态表达式求值\nx = 10.5\ny = 20.25\nresult = (x * y) ** 0.5\nprint(f"几何平均数计算结果: {result:.4f}")`
            }
          ],
          codeExample: `# 计算基础公式\na, b, c = 3, 4, 5\nis_right_triangle = (a**2 + b**2 == c**2)\nprint(f"边长 {a},{b},{c} 是否构成直角三角形: {is_right_triangle}")`,
          tips: ['在主界面按下 Ctrl + Enter 可快速触发当前代码的执行。']
        }
      },
      {
        id: 'p1_syntax',
        title: 'Python基础语法规范',
        stage: '阶段1：零基础基础语法',
        summary: '掌握严格的代码缩进规则、语句续行符与代码块书写标准。',
        content: {
          overview: 'Python 放弃了传统 C-Style 语言使用 `{}` 包裹代码块的做法，转而采用强制性的空白缩进（Indentation）来确定作用域与层次关系。',
          sections: [
            {
              heading: '语法缩进与续行规范',
              text: '• 缩进标准：根据 PEP 8 规范，统一使用 4 个空格作为一级缩进。\n• 缩进不一致会直接引发 `IndentationError` 语法错误。\n• 多行续行：使用反斜杠 `\\` 或将长表达式置于圆括号 `()` 内。',
              code: `# 多行条件拼接推荐格式\ntotal = (\n    1 + 2 + 3 +\n    4 + 5 + 6\n)\n\nif total > 10:\n    print(f"累加计算结果为: {total}")\n    print("同一逻辑块保持绝对统一的 4 空格缩进")`
            }
          ],
          codeExample: `def validate_number(num):\n    if num > 0:\n        print("正数测试通过")\n        if num % 2 == 0:\n            print("且该数值为偶数")\n    else:\n        print("非正数")\n\nvalidate_number(16)`,
          tips: ['禁止在同一源码文件中混用 Tab 制表符与空格。']
        }
      },
      {
        id: 'p1_comments',
        title: 'Python注释与 Docstring 规范',
        stage: '阶段1：零基础基础语法',
        summary: '系统掌握单行注释、多行块注释与文档字符串 Docstring 的专业书写。',
        content: {
          overview: '注释是增强代码可读性与可维护性的重要手段。Python 解释器在编译过程中会自动跳过所有的注释内容。',
          sections: [
            {
              heading: '注释类型及适用场景',
              text: '1. 单行注释：以 `#` 符号开头，用于解释复杂的算法步骤或关键逻辑。\n2. 块注释：连续的多行 `#` 或使用三引号 `\'\'\'` / `"""`。\n3. 文档字符串 Docstring：紧跟在类、函数或模块定义首行，用于描述接口逻辑与参数说明，可通过 `help()` 或 `__doc__` 访问。',
              code: `# 示例：单行注释说明\ndef calculate_bmi(weight: float, height: float) -> float:\n    """\n    计算人体身体质量指数 (BMI)\n    \n    :param weight: 体重 (kg)\n    :param height: 身高 (m)\n    :return: BMI 指数值\n    """\n    return weight / (height ** 2)\n\nprint(calculate_bmi.__doc__)`
            }
          ],
          codeExample: `w, h = 70.0, 1.75\nbmi = calculate_bmi(w, h)\nprint(f"体重 {w}kg, 身高 {h}m 的 BMI 指数为: {bmi:.2f}")`,
          tips: ['保持 Docstring 的清晰格式有利于自动生成 API 手册。']
        }
      },
      {
        id: 'p1_variables',
        title: 'Python变量与内存绑定',
        stage: '阶段1：零基础基础语法',
        summary: '深入了解变量声明、强类型动态绑定机制、解包赋值与作用域表现。',
        content: {
          overview: 'Python 变量本质上是存储在内存中的对象的【引用标签】（Reference Tag）。变量自身没有数据类型，类型由变量所指向的对象决定。',
          sections: [
            {
              heading: '变量命名规则与赋值方式',
              text: '• 标识符限制：只能包含字母、数字及下划线 `_`，且不能以数字开头。\n• 大小写敏感：`value` 与 `Value` 代表两个独立的变量。\n• 强类型绑定：赋值后对象类型被确定，修改变量指向不会改变原对象的类型。\n• 多重解包赋值：`x, y, z = 10, 20, 30` 或 `a, *b = [1, 2, 3, 4]`。',
              code: `# 序列解包与变量互换\na, b = 100, 200\na, b = b, a  # 无需中间变量原位交换\nprint(f"交换后的变量: a={a}, b={b}")\n\n# 扩展解包\nhead, *tail = [10, 20, 30, 40]\nprint(f"首元素: {head}, 剩余列表: {tail}")`
            }
          ],
          codeExample: `x = 1000\nprint("变量 x 的内存唯一 ID (id()):", id(x))\nx = "Python"\nprint("重新赋值后变量 x 的内存 ID:", id(x))`,
          tips: ['使用内置函数 id() 可以精准校验变量引用的内存地址是否发生变更。']
        }
      },
      {
        id: 'p1_datatypes',
        title: 'Python数据类型体系总览',
        stage: '阶段1：零基础基础语法',
        summary: '分类厘清 Python 内置核心数据类型与其【可变性】与【有序性】特征。',
        content: {
          overview: 'Python 拥有完善的内置数据类型体系。了解各类数据的底层特性（如可变性 Mutable 与不可变性 Immutable）是编写安全高性能代码的关键。',
          sections: [
            {
              heading: '核心内置数据类型全集速查表',
              text: '不同数据结构在可变性、可哈希性（Hashable）与访问复杂度上存在本质区别：',
              table: {
                headers: ['数据类型', '类型名称', '语法表示', '可变性', '可哈希性', '核心特性说明'],
                rows: [
                  ['字符串', 'str', '"Text"', '不可变', '可哈希', 'Unicode 字符序列，支持切片'],
                  ['整数', 'int', '42', '不可变', '可哈希', '任意精度整数，受系统内存限制'],
                  ['浮点数', 'float', '3.14159', '不可变', '可哈希', '遵从 IEEE 754 标准双精度浮点数'],
                  ['列表', 'list', '[1, 2, 3]', '可变', '不可哈希', '动态数组，支持原位增加与修改'],
                  ['元组', 'tuple', '(1, 2)', '不可变', '可哈希*', '只读只访问列表（含可变对象时不可哈希）'],
                  ['字典', 'dict', '{"a": 1}', '可变', '不可哈希', '基于哈希表实现的键值对（Key-Value）'],
                  ['集合', 'set', '{1, 2, 3}', '可变', '不可哈希', '基于哈希表实现的无序非重复集合'],
                  ['布尔值', 'bool', 'True/False', '不可变', '可哈希', '继承自 int 的逻辑表达（True=1, False=0）'],
                  ['空值', 'NoneType', 'None', '不可变', '可哈希', '代表不存在或空对象的单例类型']
                ]
              },
              code: `data_samples = [100, 3.14, "PyStudio", (1, 2), [3, 4], {"k": "v"}, True, None]\nfor val in data_samples:\n    print(f"数据值: {str(val):<12} | 数据类型: {type(val).__name__:<8}")`
            }
          ],
          codeExample: `a = "Hello"\nprint("字符串属于不可变类型，修改字符将产生新对象:")\nprint("原始地址:", id(a))\na += " World"\nprint("拼接后新地址:", id(a))`,
          tips: ['不可变类型的对象可以在字典中用作 Key，而可变类型（如 list、dict）不能作为 Key。']
        }
      },
      {
        id: 'p1_numbers',
        title: 'Python数值类型与算术逻辑',
        stage: '阶段1：零基础基础语法',
        summary: '深入掌握整数 int、浮点数 float、复数 complex 及 Decimal 高精度计算。',
        content: {
          overview: 'Python 包含三种内置数值类型：`int`（无限精度整数）、`float`（IEEE 754 双精度浮点数）和 `complex`（复数）。同时标准库提供了 `decimal` 模块以解决浮点精度误差。',
          sections: [
            {
              heading: '数值运算规则',
              text: '• 自动类型提升：整数与浮点数运算时，结果自动提升为 `float`。\n• 除法运算符：`/` 始终返回 `float`，`//` 返回整除结果（向下取整），`%` 求余数。\n• 幂运算：`**`（如 `2 ** 10 = 1024`）。',
              code: `from decimal import Decimal\n\n# 传统浮点计算的精度局限\nprint("二进制浮点计算: 0.1 + 0.2 =", 0.1 + 0.2)\n\n# Decimal 模块精准金融计算\nd1 = Decimal("0.1")\nd2 = Decimal("0.2")\nprint("Decimal 精准计算: d1 + d2 =", d1 + d2)`
            }
          ],
          codeExample: `z = 3 + 4j\nprint(f"复数 {z} -> 实部: {z.real}, 虚部: {z.imag}, 模长: {abs(z)}")`,
          tips: ['对于金融与会计领域的精准货币计算，务必采用 decimal.Decimal 对象。']
        }
      },
      {
        id: 'p1_casting',
        title: 'Python数据类型显示与隐式转换',
        stage: '阶段1：零基础基础语法',
        summary: '掌握 int(), float(), str(), bool() 等类型强制转换与隐式类型提升。',
        content: {
          overview: '类型转换（Type Casting）分为自动隐式转换与强制显示转换。强转函数可将数据转换为指定的标量或容器类型。',
          sections: [
            {
              heading: '核心类型转换方法',
              text: '• `int(x, base=10)`：可将字符串数字或浮点数（直接截断小数）转为整数。\n• `float(x)`：转为双精度浮点数。\n• `str(x)`：将任意 Python 对象转化为其文本表示形式。\n• `list(iterable)` / `tuple(iterable)` / `set(iterable)`：容器间互相转换。',
              code: `# 进制转换与类型强转\nhex_str = "0xFF"\nnum = int(hex_str, 16)\nprint(f"十六进制 {hex_str} 转十进制: {num}")\n\nfloat_val = 9.99\nint_val = int(float_val)  # 小数点直接截断而非四舍五入\nprint(f"float 9.99 强转 int 截断结果: {int_val}")`
            }
          ],
          codeExample: `raw_inputs = ["10", "3.14159", "True"]\nparsed_int = int(raw_inputs[0])\nparsed_float = float(raw_inputs[1])\nprint(f"转换加和计算: {parsed_int + parsed_float:.2f}")`,
          tips: ['将非合法数值形式的字符串强转 int/float 会抛出 ValueError 异常。']
        }
      },
      {
        id: 'p1_strings',
        title: 'Python字符串与文本处理方法',
        stage: '阶段1：零基础基础语法',
        summary: '精通 Unicode 字符串索引、切片、格式化及常用内建文本处理 API。',
        content: {
          overview: 'Python 字符串是 Unicode 字符构成的不可变（Immutable）序列。支持高效率的切片操作与数十种内置处理 API。',
          sections: [
            {
              heading: '切片语法与常用字符串 API',
              text: '• 切片通用语法：`sequence[start:stop:step]`（左闭右开区间 `[start, stop)`）。\n• 转换方法：`.upper()`, `.lower()`, `.title()`, `.swapcase()`。\n• 查找与替换：`.find()`, `.index()`, `.replace(old, new)`。\n• 拆分与连接：`.split(sep)`, `.join(iterable)`, `.strip()`。',
              code: `text = "  PyStudio Python IDE  "\nclean_text = text.strip()\nprint("清除首尾空格:", clean_text)\nprint("全大写转换:", clean_text.upper())\nprint("反转字符串 [::-1]:", clean_text[::-1])\n\n# 字符串分割与连接\nwords = clean_text.split(" ")\nprint("分割单词列表:", words)\nprint("下划线拼接:", "_".join(words))`
            }
          ],
          codeExample: `s = "abcdefghijklmnopqrstuvwxyz"\nprint("前5个字符:", s[:5])\nprint("后5个字符:", s[-5:])\nprint("隔一采样 [::2]:", s[::2])`,
          tips: ['字符串为不可变类型，任何修改 API（如 replace）均返回全新生成的字符串。']
        }
      },
      {
        id: 'p1_booleans',
        title: 'Python布尔逻辑与真值测试',
        stage: '阶段1：零基础基础语法',
        summary: '理解 True/False 逻辑基础、短路求值机制与隐式 Falsy 真值测试。',
        content: {
          overview: '布尔类型 `bool` 继承自 `int`，只有两个单例实例：`True`（对应数值 1）和 `False`（对应数值 0）。',
          sections: [
            {
              heading: '隐式真值（Truthy 与 Falsy）判定表',
              text: '在条件表达式中，以下所有对象在隐式类型转换时均判定为 `False` (Falsy)：\n• 逻辑单例与空：`None`, `False`\n• 任意数值零：`0`, `0.0`, `0j`, `Decimal(0)`\n• 任意空序列与容器：`""`, `[]`, `()`, `{}`, `set()`, `range(0)`\n除此之外的所有其他对象均被评估为 `True` (Truthy)。',
              code: `def check_truthy(obj):\n    print(f"对象: {repr(obj):<15} | 评估结果: {bool(obj)}")\n\ncheck_truthy("")\ncheck_truthy("Python")\ncheck_truthy([])\ncheck_truthy([1, 2])\ncheck_truthy(None)`
            }
          ],
          codeExample: `# 短路求值示例 (Short-circuit Evaluation)\n# 当 first 为 Falsy 时，直接返回 second\nfirst_name = ""\ndefault_name = "Anonymous"\nactive_name = first_name or default_name\nprint("活性生效名称:", active_name)`,
          tips: ['在 if 语句中直接写 `if container:` 比 `if len(container) > 0:` 更符合 Pythonic 风格。']
        }
      },
      {
        id: 'p1_operators',
        title: 'Python运算符全集与优先级',
        stage: '阶段1：零基础基础语法',
        summary: '全面掌握算术、比较、逻辑、位运算、成员及身份运算符。',
        content: {
          overview: '运算符是执行特定逻辑与算術控制的系统指令。Python 提供了极具可读性的单词型运算符（如 `and`, `or`, `in`, `is`）。',
          sections: [
            {
              heading: '六大类运算符分类全集',
              text: '1. 算术运算符：`+`, `-`, `*`, `/`, `//`, `%`, `**`\n2. 比较运算符：`==`, `!=`, `>`, `<`, `>=`, `<=`\n3. 逻辑运算符：`and`, `or`, `not`\n4. 成员运算符：`in`, `not in`\n5. 身份运算符：`is`, `is not`（比较对象的内存地址是否完全一致）\n6. 位运算符：`&`, `|`, `^`, `~`, `<<`, `>>`',
              table: {
                headers: ['运算符分类', '主要符号', '示例逻辑', '返回值', '核心说明'],
                rows: [
                  ['算术运算符', '**, //, %', '10 % 3', '1', '求余数与指数幂等运算'],
                  ['比较运算符', '==, !=, >=', '5 >= 2', 'True', '比较两个对象的数据值大小'],
                  ['逻辑运算符', 'and, or, not', 'True and False', 'False', '具有短路特征的逻辑布尔组合'],
                  ['成员运算符', 'in, not in', '"Py" in "PyStudio"', 'True', '检测元素是否存在于可迭代容器内'],
                  ['身份运算符', 'is, is not', 'a is b', 'bool', '比较 id(a) == id(b) 内存地址']
                ]
              },
              code: `# is 与 == 的本质区别\nlist_a = [1, 2, 3]\nlist_b = [1, 2, 3]\nprint("数值内容是否相同 (list_a == list_b):", list_a == list_b)  # True\nprint("内存地址是否相同 (list_a is list_b):", list_a is list_b)  # False`
            }
          ],
          codeExample: `# 位运算示例\na = 0b1010  # 10\nb = 0b1100  # 12\nprint("按位与 &: ", bin(a & b))\nprint("按位或 |: ", bin(a | b))\nprint("按位异或 ^:", bin(a ^ b))`,
          tips: ['使用 `is` 比较逻辑单例（如 `x is None` 或 `x is True`）比 `==` 更高效安全。']
        }
      }
    ]
  },
  {
    id: 'stage2',
    title: '阶段2：四大核心数据容器',
    icon: 'dataset',
    topics: [
      {
        id: 'p2_list',
        title: 'Python列表 List 深度详解',
        stage: '阶段2：四大核心数据容器',
        summary: '有序、可变动态数组的索引、切片、排序及列表推导式。',
        content: {
          overview: '列表（List）是 Python 中最基础且使用频率最高的容器类型。其底层基于 CPython 的动态指针数组实现，支持高效随机读取（O(1) 时间复杂度）。',
          sections: [
            {
              heading: '核心 API 与增删改查方法',
              text: '• 追加与扩展：`.append(x)`, `.extend(iterable)`, `.insert(index, x)`\n• 删除操作：`.remove(x)`（按值删除首个）, `.pop(index)`（按索引弹出并返回）, `.clear()`\n• 查找与统计：`.index(x)`, `.count(x)`\n• 排序与反转：原位排序 `.sort(key=None, reverse=False)`，全局排序 `sorted(iterable)`',
              code: `numbers = [42, 10, 88, 5, 23]\nnumbers.append(99)\nnumbers.sort()\nprint("原位升序排序:", numbers)\n\n# 列表推导式 (List Comprehension)\nevens_squared = [x ** 2 for x in numbers if x % 2 == 0]\nprint("偶数平方推导式序列:", evens_squared)`
            }
          ],
          codeExample: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflattened = [num for row in matrix for num in row]\nprint("二维矩阵展平列表:", flattened)`,
          tips: ['列表的 `.append()` 与 `.pop()` 时间复杂度均为 O(1)，可高效实现栈（Stack）数据结构。']
        }
      },
      {
        id: 'p2_tuple',
        title: 'Python元组 Tuple 深度详解',
        stage: '阶段2：四大核心数据容器',
        summary: '只读序列的性能优势、只读保护与高级多值解包特性。',
        content: {
          overview: '元组（Tuple）是不可变（Immutable）的有序序列。一旦创建，无法对其元素进行增加、删除或位置修改。在多线程与内存敏感场景下性能极其优秀。',
          sections: [
            {
              heading: '四大数据容器综合对比一览表',
              text: '根据功能要求与性能指标精准选择最佳容器：',
              table: {
                headers: ['数据容器', '语法标识', '有序性', '可变性', '允许重复元素', '哈希查找复杂度', '典型应用场景'],
                rows: [
                  ['列表 List', '[ ] 方括号', '有序', '可变 (Mutable)', '允许', 'O(n) 线性搜索', '动态数据存储与按顺序遍历'],
                  ['元组 Tuple', '( ) 圆括号', '有序', '不可变 (Immutable)', '允许', 'O(n) 线性搜索', '常量只读记录、函数多返回值'],
                  ['集合 Set', '{ } 花括号', '无序', '可变 (Mutable)', '不允许', 'O(1) 哈希搜索', '数据快速去重与交并差集计算'],
                  ['字典 Dict', '{k: v} 键值对', '保持插入序', '可变 (Mutable)', 'Key 唯一', 'O(1) 哈希搜索', '结构化实体数据表达与高效率索引']
                ]
              },
              code: `# 单元素元组末尾必须附带逗号\nsingle_element = (42,)  # 正确的单元素元组\nnot_a_tuple = (42)     # 被解析为普通整数 brackets 表达式\nprint(type(single_element), type(not_a_tuple))\n\n# 高级解包应用\npoint = (10, 20, 30)\nx, y, z = point\nprint(f"解包坐标点: X={x}, Y={y}, Z={z}")`
            }
          ],
          codeExample: `def get_server_status():\n    return 200, "OK", 0.045  # 返回元组\n\ncode, status, latency = get_server_status()\nprint(f"响应码: {code}, 状态: {status}, 延迟: {latency}s")`,
          tips: ['元组内部若包含可变对象（如列表），该可变对象的内容仍可被修改，但元组引用的对象地址不变。']
        }
      },
      {
        id: 'p2_set',
        title: 'Python集合 Set 深度详解',
        stage: '阶段2：四大核心数据容器',
        summary: '哈希集合的无序去重特性与并集、交集、差集数学运算。',
        content: {
          overview: '集合（Set）是无序且元素不重复的容器，底层由哈希表（Hash Table）驱动，元素成员检测的时间复杂度为 O(1)。',
          sections: [
            {
              heading: '集合数学运算方法',
              text: '• 交集 `&` 或 `.intersection()`：求两个集合共有的元素。\n• 并集 `|` 或 `.union()`：合并两个集合的所有不重复元素。\n• 差集 `-` 或 `.difference()`：存在于 A 但不存在于 B 的元素。\n• 对称差集 `^` 或 `.symmetric_difference()`：存在于 A 或 B 中但不同时存在于两者的元素。',
              code: `set_a = {1, 2, 3, 4, 5}\nset_b = {4, 5, 6, 7, 8}\n\nprint("交集 set_a & set_b:", set_a & set_b)\nprint("并集 set_a | set_b:", set_a | set_b)\nprint("差集 set_a - set_b:", set_a - set_b)\nprint("对称差集 set_a ^ set_b:", set_a ^ set_b)`
            }
          ],
          codeExample: `raw_logs = ["192.168.1.1", "10.0.0.1", "192.168.1.1", "172.16.0.1"]\nunique_ips = list(set(raw_logs))\nprint("过滤重复 IP 列表:", unique_ips)`,
          tips: ['创建空集合必须使用 `set()` 构造器，直接写 `{}` 会被解析为空字典 `dict`。']
        }
      },
      {
        id: 'p2_dict',
        title: 'Python字典 Dict 深度详解',
        stage: '阶段2：四大核心数据容器',
        summary: '高效键值对映射结构、哈希原理、安全访问 API 与字典推导式。',
        content: {
          overview: '字典（Dict）由键值对（Key-Value）组成。Python 3.7+ 之后官方保证字典元素严格保持【插入顺序】。字典 Key 必须为【可哈希】不可变对象。',
          sections: [
            {
              heading: '常用字典方法 API',
              text: '• 安全读取：`.get(key, default)`（Key 不存在时返回默认值而非引发 KeyError）\n• 遍历视图：`.keys()`, `.values()`, `.items()`\n• 移除与更新：`.pop(key)`，`.update(other_dict)`，`dict_a | dict_b`（字典合并）',
              code: `student = {"id": 1001, "name": "Alice", "major": "Computer Science"}\nprint("安全访问缺失键:", student.get("gpa", 4.0))\n\n# 字典合并 (Python 3.9+ | 运算符)\nextra_info = {"gpa": 3.9, "graduated": True}\nfull_profile = student | extra_info\nprint("合并后的完整字典:\\n", full_profile)`
            }
          ],
          codeExample: `scores = {"Math": 95, "Physics": 88, "Chemistry": 92}\n# 字典推导式过滤优秀科目\ntop_scores = {k: v for k, v in scores.items() if v >= 90}\nprint("优秀成绩字典:", top_scores)`,
          tips: ['字典的底层哈希表结构使得其数据检索复杂度为稳定的 O(1)。']
        }
      }
    ]
  },
  {
    id: 'stage3',
    title: '阶段3：程序流程控制',
    icon: 'alt_route',
    topics: [
      {
        id: 'p3_ifelse',
        title: 'Python 条件分支控制 (if elif else)',
        stage: '阶段3：程序流程控制',
        summary: '布尔表达式判别、多分支控制流、嵌套判断与三元运算符。',
        content: {
          overview: '条件分支结构根据测试条件的真值（Truthy/Falsy）决定代码块的执行走向。',
          sections: [
            {
              heading: '分支结构与三元表达式',
              text: '• 完整语法：`if condition_1: ... elif condition_2: ... else: ...`\n• 单行三元表达式：`X if Condition else Y`\n• 条件匹配模式：Python 3.10+ 支持 match-case 模式匹配。',
              code: `score = 88\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "D"\nprint(f"分数 {score} 评定等级: {grade}")\n\n# 三元运算符表达\nstatus = "Pass" if score >= 60 else "Fail"\nprint("最终考核状态:", status)`
            }
          ],
          codeExample: `num = -15\nif num > 0:\n    print("数值为正数")\nelif num < 0:\n    print("数值为负数")\nelse:\n    print("数值为零")`,
          tips: ['使用嵌套分支时避免层级过深，可采用提前返回（Early Return）优化代码。']
        }
      },
      {
        id: 'p3_while',
        title: 'Python while 循环结构',
        stage: '阶段3：程序流程控制',
        summary: '条件循环控制、break 与 continue 关键字及 while-else 语法。',
        content: {
          overview: 'while 循环在给定的条件评估为 True 时持续重复执行循环体。当条件不再满足时终止。',
          sections: [
            {
              heading: '循环控制与 else 子句',
              text: '• `break`：中断并立即彻底退出循环。\n• `continue`：中断当前本次迭代，直接跳转至条件判定进入下次循环。\n• `while-else`：当 while 循环自然结束（未被 break 中断）时触发执行 else 块。',
              code: `count = 1\nwhile count <= 5:\n    print("循环迭代次数:", count)\n    count += 1\nelse:\n    print("while 循环自然执行完毕，未被 break 中断。")`
            }
          ],
          codeExample: `idx = 0\nwhile idx < 10:\n    idx += 1\n    if idx % 2 == 0:\n        continue  # 跳过偶数\n    if idx > 7:\n        break     # 大于7退出循环\n    print("奇数打印:", idx)`,
          tips: ['在编写 while 循环时，必须确保循环条件存在收敛趋势，防止引发无限死循环。']
        }
      },
      {
        id: 'p3_for',
        title: 'Python for 循环与迭代器',
        stage: '阶段3：程序流程控制',
        summary: '遍历可迭代对象、range() 生成器、enumerate() 索引绑定与 zip() 并行遍历。',
        content: {
          overview: 'for 循环专用于遍历可迭代对象（Iterable）中的元素，自动处理迭代器指针移动与 StopIteration 异常。',
          sections: [
            {
              heading: '常用迭代辅助工具',
              text: '• `range(start, stop[, step])`：高效的推迟计算等差整数序列。\n• `enumerate(iterable, start=0)`：同时获取索引序号与元素对象。\n• `zip(iter1, iter2)`：并行配对组合多个可迭代对象。',
              code: `fruits = ["apple", "banana", "cherry"]\nprices = [10.5, 5.0, 15.8]\n\n# enumerate 与 zip 结合应用\nfor idx, (fruit, price) in enumerate(zip(fruits, prices), start=1):\n    print(f"序号 [{idx}] 水果: {fruit:<8} | 单价: ￥{price:.2f}")`
            }
          ],
          codeExample: `# 计算 1 至 100 的累加加和\ntotal_sum = sum(range(1, 101))\nprint("1 到 100 累加加和结果:", total_sum)`,
          tips: ['`range()` 对象不会在内存中预先装载完整列表，而是采用按需生成机制。']
        }
      },
      {
        id: 'p3_input',
        title: 'Python 标准输入与交互处理',
        stage: '阶段3：程序流程控制',
        summary: '使用 input() 函数捕获标准输入流数据及安全类型转换。',
        content: {
          overview: '`input(prompt)` 函数用于暂停程序执行，并从终端标准输入捕获用户键盘输入的文本行。返回值始终为 `str` 类型。',
          sections: [
            {
              heading: '输入捕获与转换模版',
              text: '捕获非文本数据（如整数、浮点数）时，必须使用类型强转函数包覆，并配合 try-except 处理非合规输入。',
              code: `# 模拟控制台数据输入\nraw_value = "25"\ntry:\n    age = int(raw_value)\n    print(f"校验成功，用户年龄: {age} 岁")\nexcept ValueError:\n    print("输入格式错误，无法转换为有效的整数")`
            }
          ],
          codeExample: `mock_input = "10.5, 20.3, 30.2"\nfloat_numbers = [float(x.strip()) for x in mock_input.split(",") if x.strip()]\nprint("解析浮点数据列表:", float_numbers)`,
          tips: ['在 PyStudio 交互终端中，命令行支持实时模拟用户输入的交互操作。']
        }
      },
      {
        id: 'p3_formatting',
        title: 'Python 字符串格式化全集',
        stage: '阶段3：程序流程控制',
        summary: '精通 f-string (PEP 498)、str.format() 与传统 % 格式化输出。',
        content: {
          overview: 'Python 提供了多种文本格式化方案。Python 3.6+ 引入的 `f-string` 具备最佳的执行效率与直观可读性。',
          sections: [
            {
              heading: 'f-string 格式化语法控制表',
              text: '在大括号 `{value:format_spec}` 内可使用格式修饰符控制展示效果：',
              table: {
                headers: ['控制格式', '修饰符号语法', '输入数据', '格式化输出', '功能说明'],
                rows: [
                  ['保留小数位数', '`{val:.2f}`', '3.14159', '3.14', '浮点数精确四舍五入展示'],
                  ['百分比显示', '`{val:.1%}`', '0.856', '85.6%', '浮点数自动转为百分比表示'],
                  ['补零填充', '`{val:05d}`', '42', '00042', '整数前导自动补零齐位'],
                  ['对齐与宽度', '`{val:>10}`', '"Py"', '        Py', '右对齐并限定总宽度为 10'],
                  ['千分位分隔符', '`{val:,}`', '1000000', '1,000,000', '大数值格式化添加逗号分隔']
                ]
              },
              code: `pi = 3.1415926535\nrevenue = 12500000\nprint(f"圆周率精确到 4 位小数: {pi:.4f}")\nprint(f"公司年度营收(千分位): ￥{revenue:,}")`
            }
          ],
          codeExample: `val = 42\nprint(f"二进制: {val:b} | 八进制: {val:o} | 十六进制: {val:x}")`,
          tips: ['f-string 可以在 `{}` 中直接调用函数或计算表达式（如 `{x.upper()}`）。']
        }
      }
    ]
  },
  {
    id: 'stage4',
    title: '阶段4：函数与面向对象编程',
    icon: 'code_off',
    topics: [
      {
        id: 'p4_functions',
        title: 'Python 函数与参数机制',
        stage: '阶段4：函数与面向对象编程',
        summary: '使用 def 定义函数、位置参数、关键字参数、*args与**kwargs机制。',
        content: {
          overview: '函数是封装可复用代码块的基本逻辑单元。支持灵活的参数传递机制与多重返回值。',
          sections: [
            {
              heading: '参数分类与变长参数',
              text: '• 位置参数（Positional Arguments）：按定义顺序精准匹配。\n• 默认参数（Default Arguments）：必须放置于非默认参数之后。\n• 变长位置参数 `*args`：接收元组形式的多余位置参数。\n• 变长关键字参数 `**kwargs`：接收字典形式的多余关键字参数。',
              code: `def build_user_profile(username, email, *hobbies, **attributes):\n    profile = {\n        "username": username,\n        "email": email,\n        "hobbies": hobbies,\n        "metadata": attributes\n    }\n    return profile\n\nuser = build_user_profile("alice", "alice@test.com", "coding", "reading", role="admin", level=5)\nprint("构造的用户字典 profile:\\n", user)`
            }
          ],
          codeExample: `def multiply_all(*numbers):\n    result = 1\n    for n in numbers:\n        result *= n\n    return result\n\nprint("变长乘积计算:", multiply_all(2, 3, 4, 5))`,
          tips: ['切勿使用可变对象（如列表或字典）作为函数的默认参数值，应采用 None 进行延迟赋值。']
        }
      },
      {
        id: 'p4_lambda',
        title: 'Python Lambda 匿名函数',
        stage: '阶段4：函数与面向对象编程',
        summary: '单行匿名表达式定义、高阶函数应用（map, filter, sorted）。',
        content: {
          overview: 'Lambda 函数是一种不需要显式 `def` 命名的单行简洁函数。语法形式为：`lambda arg1, arg2: expression`。',
          sections: [
            {
              heading: '高阶函数搭配应用',
              text: 'Lambda 函数非常适合作为 `map()`、`filter()` 及 `sorted()` 的回调 Key 映射参数。',
              code: `products = [\n    {"name": "Laptop", "price": 8999},\n    {"name": "Mouse", "price": 199},\n    {"name": "Keyboard", "price": 499}\n]\n\n# 按照价格字段排序\nproducts.sort(key=lambda item: item["price"])\nprint("按价格升序排列:\\n", products)`
            }
          ],
          codeExample: `numbers = [1, 2, 3, 4, 5, 6, 7, 8]\nevens = list(filter(lambda x: x % 2 == 0, numbers))\nsquared = list(map(lambda x: x ** 2, evens))\nprint("过滤偶数:", evens)\nprint("偶数平方映射:", squared)`,
          tips: ['Lambda 主体中只能书写单个简单表达式，不能包含复杂的赋值语句或循环。']
        }
      },
      {
        id: 'p4_array',
        title: 'Python array 标准数组模块',
        stage: '阶段4：函数与面向对象编程',
        summary: '同质紧凑内存数组 array 模块及其类型码规格。',
        content: {
          overview: 'Python 的 `list` 可以存储任意混合数据类型，但如果处理海量同质数值，使用标准库 `array.array` 可以节省大量内存资源。',
          sections: [
            {
              heading: '类型码 (Type Codes) 说明',
              text: '• `"i"`：带符号 32 位整数 (signed int)\n• `"f"`：单精度浮点数 (float)\n• `"d"`：双精度浮点数 (double float)',
              code: `import array\n\n# 创建带符号整数数组\nint_array = array.array('i', [10, 20, 30, 40, 50])\nint_array.append(60)\nprint("数组元素列表:", int_array)\nprint("内存块占用字节数:", int_array.buffer_info()[1] * int_array.itemsize)`
            }
          ],
          codeExample: `import array\nfloats = array.array('d', [1.1, 2.2, 3.3])\nprint("双精度浮点数组:", floats)`,
          tips: ['进行大规模科学计算与多维矩阵运算时，请优先使用扩展库 NumPy。']
        }
      },
      {
        id: 'p4_class',
        title: 'Python 类与面向对象编程 (OOP)',
        stage: '阶段4：函数与面向对象编程',
        summary: '封装、类与实例对象、__init__ 构造方法与 self 引用。',
        content: {
          overview: '面向对象编程（OOP）通过类（Class）定义模板，实例化产生对象（Object）。核心三大支柱：封装、继承与多态。',
          sections: [
            {
              heading: '类的定义与构造方法',
              text: '• `class ClassName:` 定义类命名空间。\n• `__init__(self, ...)` 构造方法，在对象实例化时自动触发执行。\n• `self` 显式代表指向当前创建的具体实例对象本身。',
              code: `class BankAccount:\n    def __init__(self, owner: str, balance: float = 0.0):\n        self.owner = owner          # 实例属性\n        self.__balance = balance    # 私有属性 (__开头)\n        \n    def deposit(self, amount: float):\n        if amount > 0:\n            self.__balance += amount\n            print(f"成功存入 ￥{amount}, 当前余额: ￥{self.__balance}")\n            \n    def get_balance(self) -> float:\n        return self.__balance\n\nacc = BankAccount("Alice", 1000.0)\nacc.deposit(500.0)\nprint("最终账户余额:", acc.get_balance())`
            }
          ],
          codeExample: `class Circle:\n    pi = 3.14159  # 类属性\n    def __init__(self, radius):\n        self.radius = radius\n    def area( me ):\n        return Circle.pi * (me.radius ** 2)\n\nc = Circle(5)\nprint(f"半径为 5 的圆面积为: {c.area():.2f}")`,
          tips: ['类属性被所有该类的实例对象共享，而实例属性仅归属于具体单个实例。']
        }
      },
      {
        id: 'p4_inheritance',
        title: 'Python 类的继承与 super() 机制',
        stage: '阶段4：函数与面向对象编程',
        summary: '单继承、多重继承、重写父类方法与 super() 初始化调用。',
        content: {
          overview: '继承允许子类派生并复用父类的属性和方法，同时支持子类重写（Override）特定方法以扩展功能。',
          sections: [
            {
              heading: '继承与 super() 使用模式',
              text: '使用 `super().__init__(...)` 可以正确初始化父类属性，同时多重继承下会遵从 MRO（方法解析顺序）链条。',
              code: `class Vehicle:\n    def __init__(self, brand, speed):\n        self.brand = brand\n        self.speed = speed\n        \n    def drive(self):\n        print(f"{self.brand} 正在以 {self.speed} km/h 行驶")\n\nclass ElectricCar(Vehicle):\n    def __init__(self, brand, speed, battery_capacity):\n        super().__init__(brand, speed)  # 继承父类属性初始化\n        self.battery_capacity = battery_capacity\n        \n    def drive(self):  # 方法重写\n        print(f"{self.brand} 电动汽车 (电池 {self.battery_capacity}kWh) 纯静音行驶中")\n\ntesla = ElectricCar("Tesla", 120, 75)\ntesla.drive()`
            }
          ],
          codeExample: `print("查看 ElectricCar 的 MRO 解析链:")\nfor cls in ElectricCar.__mro__:\n    print(" ->", cls.__name__)`,
          tips: ['可以通过 `issubclass(Child, Parent)` 校验类之间的继承关系。']
        }
      },
      {
        id: 'p4_iterators',
        title: 'Python 迭代器与生成器 (Generator)',
        stage: '阶段4：函数与面向对象编程',
        summary: '__iter__ 与 __next__ 协议、yield 延迟惰性求值原理。',
        content: {
          overview: '迭代器（Iterator）是实现了迭代协议的对象。生成器（Generator）通过 `yield` 关键字实现状态挂起与惰性（Lazy）求值，极大节省大容量内存。',
          sections: [
            {
              heading: 'yield 挂起与生成器函数',
              text: '当函数体内包含 `yield` 表达式时，调用该函数不会立即执行函数体，而是返回一个生成器迭代器对象。',
              code: `def fibonacci_generator(n):\n    a, b = 0, 1\n    count = 0\n    while count < n:\n        yield a\n        a, b = b, a + b\n        count += 1\n\n# 使用生成器输出斐波那契数列\nfor num in fibonacci_generator(8):\n    print("Fibonacci 项:", num)`
            }
          ],
          codeExample: `# 生成器表达式 (Generator Expression)\nsquares_gen = (x ** 2 for x in range(1000000))\nprint("生成器表达式创建成功，内存占用极小:", type(squares_gen))\nprint("获取首个元素:", next(squares_gen))`,
          tips: ['生成器表达式比列表推导式在处理百万级大数据流时更加节省内存空间。']
        }
      },
      {
        id: 'p4_polymorphism',
        title: 'Python 多态与鸭子类型 (Duck Typing)',
        stage: '阶段4：函数与面向对象编程',
        summary: '理解鸭子类型抽象、统一接口规范与抽象基类 ABC。',
        content: {
          overview: '“如果它走起来像鸭子，叫起来像鸭子，那么它就是鸭子”。Python 不严格强制继承关系，而是关注对象是否实现了所需的方法接口。',
          sections: [
            {
              heading: '鸭子类型代码范例',
              text: '不同的类型只要实现了相同签名的方法，即可在统一调用的函数中流畅多态运作。',
              code: `class PDFExporter:\n    def export(self, data):\n        print(f"将数据 {data} 导出为 PDF 格式文件")\n\nclass CSVExporter:\n    def export(self, data):\n        print(f"将数据 {data} 导出为 CSV 表格文件")\n\ndef generate_report(exporter, data):\n    exporter.export(data)  # 只要实现 export 方法即可多态执行\n\ngenerate_report(PDFExporter(), [10, 20])\ngenerate_report(CSVExporter(), [10, 20])`
            }
          ],
          codeExample: `class Dog:\n    def speak(self): return "Woof!"\nclass Cat:\n    def speak(self): return "Meow!"\n\nanimals = [Dog(), Cat()]\nfor a in animals:\n    print(a.speak())`,
          tips: ['可以使用 abc 模块的 `ABCMeta` 和 `@abstractmethod` 强制子类规范接口实现。']
        }
      },
      {
        id: 'p4_scope',
        title: 'Python 变量作用域与 LEGB 规则',
        stage: '阶段4：函数与面向对象编程',
        summary: '局部/嵌套/全局/内置作用域、global 与 nonlocal 关键字。',
        content: {
          overview: '作用域决定了标识符的访问权限。Python 遵从 **LEGB** 优先级检索变量：Local -> Enclosing -> Global -> Built-in。',
          sections: [
            {
              heading: 'LEGB 检索链条与修改修饰符',
              text: '• **Local**：函数内部定义的局部变量。\n• **Enclosing**：闭包嵌套外层函数的变量。\n• **Global**：模块层级的全局变量。\n• **Built-in**：解释器内置的全局标识符（如 `len`, `range`）。\n• `global x`：声明在局部作用域内修改全局变量 `x`。\n• `nonlocal x`：声明在闭包内修改外层嵌套变量 `x`。',
              code: `count = 0  # Global\n\ndef outer_function():\n    msg = "Outer"  # Enclosing\n    def inner_function():\n        nonlocal msg\n        msg = "Inner Modified"  # 修改 Enclosing 变量\n        global count\n        count += 1              # 修改 Global 变量\n    inner_function()\n    print("闭包修改后的 msg:", msg)\n\nouter_function()\nprint("全局修改后的 count:", count)`
            }
          ],
          codeExample: `import builtins\nprint("检查 Built-in 内置标识符数量:", len(dir(builtins)))`,
          tips: ['过度使用 global 变量会增加函数间的耦合，应尽量采用参数传递与返回值。']
        }
      }
    ]
  },
  {
    id: 'stage5',
    title: '阶段5：标准库、异常、文件操作',
    icon: 'folder_zip',
    topics: [
      {
        id: 'p5_modules',
        title: 'Python 模块与包管理机制',
        stage: '阶段5：标准库、异常、文件操作',
        summary: 'import 导入模式、自定义模块、sys.path 路径与 __name__ 模块入口。',
        content: {
          overview: '模块（Module）是包含 Python 代码的 .py 文件；包（Package）是包含 `__init__.py` 的目录。模块化能够实现代码结构的高效组织。',
          sections: [
            {
              heading: '导入语法与入口测试模式',
              text: '• `import module_name` / `from module import symbol as alias`\n• `if __name__ == "__main__":` 块用于区分当前文件是被作为脚本直接运行还是被其他模块导入。',
              code: `import math as m\nprint("计算圆周率 π:", m.pi)\n\nfrom random import randint, choice\nprint("随机生成 1-100 整数:", randint(1, 100))\nprint("随机抽取列表元素:", choice(["Apple", "Banana", "Cherry"]))`
            }
          ],
          codeExample: `import sys\nprint("Python 模块检索路径 (sys.path):")\nfor path in sys.path[:3]:\n    print(" ->", path)`,
          tips: ['使用 `dir(module)` 可以快捷列出某个导入模块公开的所有属性与函数列表。']
        }
      },
      {
        id: 'p5_datetime',
        title: 'Python datetime 日期与时间处理',
        stage: '阶段5：标准库、异常、文件操作',
        summary: 'datetime、date、time、timedelta 时间加减与 strftime 格式化。',
        content: {
          overview: '标准库 `datetime` 模块提供了全面的日期时间解析、格式化输出及时间间隔（timedelta）计算工具。',
          sections: [
            {
              heading: '核心类与时间格式化说明',
              text: '• `datetime.now()`：获取当前时间戳对象。\n• `.strftime(format)`：将时间对象格式化为指定的文本。\n• `.strptime(string, format)`：解析文本字符串为时间对象。\n• `timedelta(days=N, hours=N)`：时间跨度增量加减。',
              code: `from datetime import datetime, timedelta\n\nnow = datetime.now()\nprint("当前标准化时刻:", now.strftime("%Y-%m-%d %H:%M:%S"))\n\n# 7 天后的时间计算\nfuture_date = now + timedelta(days=7)\nprint("7天后的日期:", future_date.strftime("%Y年%m月%d日"))`
            }
          ],
          codeExample: `from datetime import datetime\nd_str = "2026-07-30 18:00:00"\nd_obj = datetime.strptime(d_str, "%Y-%m-%d %H:%M:%S")\nprint("字符串成功解析为 datetime 对象:", d_obj.year, d_obj.month)`,
          tips: ['跨时区开发场景下，推荐结合 `zoneinfo` 模块使用 UTC 标准时区时间。']
        }
      },
      {
        id: 'p5_math',
        title: 'Python math 数学运算库',
        stage: '阶段5：标准库、异常、文件操作',
        summary: '数学常量 pi/e、三角函数、阶乘、对数及最大公约数 gcd。',
        content: {
          overview: '`math` 模块封装了底层 C 语言标准的底层浮点数数学计算 API。',
          sections: [
            {
              heading: '核心数学 API 函数表',
              text: '• 常量：`math.pi`, `math.e`, `math.inf`, `math.nan`\n• 进位与取整：`math.ceil(x)`（向上取整），`math.floor(x)`（向下取整）\n• 阶乘与公约数：`math.factorial(n)`，`math.gcd(a, b)`，`math.lcm(a, b)`',
              code: `import math\n\nprint("π 常量:", math.pi)\nprint("10 的阶乘 10!:", math.factorial(10))\nprint("最大公约数 gcd(48, 18):", math.gcd(48, 18))\nprint("开平方根 sqrt(144):", math.sqrt(144))`
            }
          ],
          codeExample: `import math\nangle_deg = 45\nangle_rad = math.radians(angle_deg)\nprint(f"45度角的 sin 值: {math.sin(angle_rad):.4f}")`,
          tips: ['`math` 模块针对浮点数优化，复数数学计算需要使用 `cmath` 模块。']
        }
      },
      {
        id: 'p5_json',
        title: 'Python JSON 数据处理与序列化',
        stage: '阶段5：标准库、异常、文件操作',
        summary: 'json.loads(), json.dumps(), json.load(), json.dump() 详解。',
        content: {
          overview: 'JSON（JavaScript Object Notation）是标准的轻量级数据交换格式。Python `json` 模块实现了 Python 数据类型与 JSON 字符串的映射转换。',
          sections: [
            {
              heading: '序列化与反序列化 API 对比',
              text: '• `json.loads(s)`：解析 JSON 格式文本字符串为 Python 对象。\n• `json.dumps(obj)`：将 Python 对象序列化为 JSON 文本字符串。\n• `json.load(fp)` / `json.dump(obj, fp)`：针对文件句柄流的操作。',
              code: `import json\n\n# Python 字典对象\nuser_data = {\n    "id": 1001,\n    "username": "developer",\n    "roles": ["admin", "editor"],\n    "is_active": True\n}\n\n# 格式化序列化为漂亮的 JSON 字符串\njson_str = json.dumps(user_data, indent=2, ensure_ascii=False)\nprint("序列化结果字符串:\\n", json_str)\n\n# 反序列化还原\nparsed_obj = json.loads(json_str)\nprint("还原提取用户名:", parsed_obj["username"])`
            }
          ],
          codeExample: `import json\nraw_json = '{"code": 200, "message": "Success"}'\ndata = json.loads(raw_json)\nprint("响应状态码:", data["code"])`,
          tips: ['在 `dumps` 中设置 `ensure_ascii=False` 可防止中文字符串被编码为 `\\uXXXX` 形式。']
        }
      },
      {
        id: 'p5_regex',
        title: 'Python 正则表达式 re 模块',
        stage: '阶段5：标准库、异常、文件操作',
        summary: 're.search(), re.match(), re.findall(), re.sub() 与匹配元字符。',
        content: {
          overview: '`re` 模块为 Python 提供了强大的正则表达式匹配引擎，可用于复杂的文本模式检索、验证提取与批量替换。',
          sections: [
            {
              heading: '核心匹配函数与元字符速查',
              text: '• `re.search(pattern, string)`：扫描字符串，返回首个成功匹配的 Match 对象。\n• `re.findall(pattern, string)`：以列表形式返回所有非重叠的匹配文本。\n• `re.sub(pattern, repl, string)`：将匹配到的子串替换为新文本。',
              code: `import re\n\ntext = "联系电话: 010-88886666, 移动手机: 13800138000, 邮箱: admin@pystudio.io"\n\n# 提取手机号码\nmobile_pattern = r"1[3-9]\\d{9}"\nmobiles = re.findall(mobile_pattern, text)\nprint("提取到的手机号码列表:", mobiles)\n\n# 隐去邮箱敏感情报\nmasked_text = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", "***@***", text)\nprint("脱敏后的文本:", masked_text)`
            }
          ],
          codeExample: `import re\ns = "2026-07-30"\nmatch = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", s)\nif match:\n    print("提取年份:", match.group(1), "月份:", match.group(2))`,
          tips: ['编写正则表达式时推荐使用原始字符串 `r"..."`，以避免繁琐的反斜杠转义。']
        }
      },
      {
        id: 'p5_pip',
        title: 'Python PIP 与 Micropip 包管理',
        stage: '阶段5：标准库、异常、文件操作',
        summary: '第三方包生态与 PyStudio Micropip 离线/在线动态依赖加载。',
        content: {
          overview: '`pip` 是 Python 官方推荐的第三方扩展包管理工具，连接至 PyPI（Python Package Index）软件仓库。在 PyStudio 环境中，内置的 `micropip` 引擎支持在线快速加载纯 Python 与 WASM C 扩展库。',
          sections: [
            {
              heading: '常用 pip 命令行指令',
              text: '• 安装扩展包：`pip install package_name`\n• 指定版本安装：`pip install package_name==1.2.0`\n• 导出依赖清单：`pip freeze > requirements.txt`\n• 根据清单安装：`pip install -r requirements.txt`',
              code: `# 说明：在 PyStudio IDE 界面左侧工具栏中点击【包管理器】按钮，\n# 即可在线一键搜索安装 NumPy、Pandas、SymPy 等众多强大的第三方第三方库！`
            }
          ],
          codeExample: `import sys\nprint("当前环境已装载的内嵌路径与模块总数:", len(sys.modules))`,
          tips: ['你可以使用侧边栏【包管理器】快速安装与管理项目中所需的各种依赖包。']
        }
      },
      {
        id: 'p5_tryexcept',
        title: 'Python 异常处理 (try except else finally)',
        stage: '阶段5：标准库、异常、文件操作',
        summary: '异常捕获机制、自定义 Exception 类、raise 抛出与上下文清理。',
        content: {
          overview: '异常处理机制能够拦截运行期错误，防止系统无预警崩溃，确保应用具备极佳的健壮性（Robustness）。',
          sections: [
            {
              heading: 'try-except-else-finally 结构',
              text: '• `try`：书写可能产生异常的监控代码块。\n• `except StandardError as err`：捕获指定类型的异常并执行容错降级。\n• `else`：当 try 块中无任何异常抛出时触发执行。\n• `finally`：无论是否引发异常，均保证无条件无遗漏执行（用于清理连接资源）。',
              code: `def safe_divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError as e:\n        print(f"捕获异常：除数不能为零 ({e})")\n        return None\n    except TypeError as e:\n        print(f"捕获异常：参数类型错误 ({e})")\n        return None\n    else:\n        print("计算正常无报错")\n        return result\n    finally:\n        print("清理工作执行完毕。")\n\nprint("计算结果:", safe_divide(10, 2))\nprint("计算结果:", safe_divide(10, 0))`
            }
          ],
          codeExample: `class CustomAppError(Exception):\n    """自定义业务逻辑异常类"""\n    pass\n\ntry:\n    raise CustomAppError("主动触发自定义业务逻辑异常")\nexcept CustomAppError as err:\n    print("捕获自定义异常:", err)`,
          tips: ['避免滥用无类型的裸 `except:`，应当显式指明所需捕获的具体异常类。']
        }
      },
      {
        id: 'p5_file',
        title: 'Python 文件 I/O 与虚拟文件系统',
        stage: '阶段5：标准库、异常、文件操作',
        summary: 'open() 打开模式、with 上下文管理器、os/pathlib 文件树同步。',
        content: {
          overview: '使用内置函数 `open()` 对磁盘或内存虚拟文件系统进行读写。使用 `with` 上下文管理器可以保障文件句柄使用完毕后被自动关闭。',
          sections: [
            {
              heading: '文件打开模式模式速查表',
              text: '• `"r"`：只读模式（默认）。若文件不存在抛出 FileNotFoundError。\n• `"w"`：写入模式。若文件存在直接清空覆盖；若不存在自动创建新文件。\n• `"a"`：追加模式。在文件末尾追加写入。\n• `"b"`：二进制模式（如 `"rb"`, `"wb"`）用于处理非文本二进制数据（如图片、字节流）。',
              table: {
                headers: ['打开模式', '模式名称', '读写权限', '文件不存在时的行为', '文件存在时的行为'],
                rows: [
                  ['"r"', '只读模式', '仅读取', '抛出 FileNotFoundError 错误', '指针位于首字符，按文本读取'],
                  ['"w"', '覆盖写入', '仅写入', '自动创建新文件', '彻底清空原有内容，重写'],
                  ['"a"', '追加模式', '仅写入', '自动创建新文件', '指针位于末尾，追加写入'],
                  ['"r+"', '读写模式', '可读可写', '抛出 FileNotFoundError 错误', '指针位于首字符，覆盖替换'],
                  ['"b"', '二进制模式', '字节流', '取决于搭档模式', '按照 bytes 字节进行读写']
                ]
              },
              code: `# 写入测试数据文件\nwith open("demo_output.txt", "w", encoding="utf-8") as f:\n    f.write("PyStudio Virtual File System\\n第一行数据内容\\n第二行数据内容")\n\n# 读取测试数据文件\nwith open("demo_output.txt", "r", encoding="utf-8") as f:\n    lines = f.readlines()\n    for idx, line in enumerate(lines, 1):\n        print(f"读取第 [{idx}] 行: {line.strip()}")`
            }
          ],
          codeExample: `import os\nif os.path.exists("demo_output.txt"):\n    print("文件体积 (Bytes):", os.path.getsize("demo_output.txt"))`,
          tips: ['在 PyStudio 中用代码创建或修改的文件，会自动实时同步至左侧 IDE 文件树视图中！']
        }
      }
    ]
  },
  {
    id: 'stage6',
    title: '阶段6：拓展专项库（选学）',
    icon: 'analytics',
    subcategories: [
      {
        id: 'matplotlib_sub',
        title: 'Matplotlib数据可视化',
        topics: [
          {
            id: 'p6_mpl_intro',
            title: 'Matplotlib 概述与绘图架构',
            stage: '阶段6：拓展专项库 > Matplotlib数据可视化',
            summary: '掌握 Python 最具代表性的 2D 绘图库 Matplotlib 核心概念。',
            content: {
              overview: 'Matplotlib 是 Python 科学计算生态的核心可视化绘图库。提供了 Figure（画布）与 Axes（坐标系）两层面向对象接口。',
              sections: [
                {
                  heading: 'Matplotlib 绘图优势',
                  text: '1. 广泛的图表类型：支持折线图、散点图、柱状图、饼图、直方图及等高线图。\n2. 精细的元素调控：可针对标题、坐标轴刻度、图例（Legend）、网格与颜色映射进行毫米级微调。\n3. 与数据分析无缝集成：天然适配 NumPy 数组与 Pandas DataFrame 数据源。',
                  code: `# Matplotlib Figure与Axes架构初始化\nimport matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nprint("成功创建 Figure 画布与 Axes 坐标系引用:", type(fig), type(ax))`,
                  notes: '说明：在 PyStudio 中可快速生成各种科学图表数据或导出图像数据。'
                }
              ],
              codeExample: `import matplotlib.pyplot as plt\nprint("Matplotlib 可视化模块加载成功，随时可触发数据图表绘制。")`,
              tips: ['掌握 Matplotlib 是进行数据科学与 AI 可视化分析的核心基础。']
            }
          },
          {
            id: 'p6_mpl_start',
            title: 'Matplotlib 折线图与散点图绘制',
            stage: '阶段6：拓展专项库 > Matplotlib数据可视化',
            summary: '使用 pyplot 子模块绘制多维度折线图、散点图与自定义样式。',
            content: {
              overview: '学习使用 `matplotlib.pyplot` 快速创建数据图表，设定坐标轴标签、绘制图例与网格样式。',
              sections: [
                {
                  heading: '核心绘制 API 指令',
                  text: '• `plt.plot(x, y, label=...)`：绘制折线图。\n• `plt.scatter(x, y, color=...)`：绘制散点图。\n• `plt.title()`, `plt.xlabel()`, `plt.ylabel()`：设置图表各向标注。\n• `plt.grid(True)`：显示辅助网格。',
                  code: `# 生成模拟数据点并初始化绘制参数\nx = [1, 2, 3, 4, 5, 6]\ny1 = [2, 4, 9, 16, 25, 36]\ny2 = [1, 3, 6, 10, 15, 21]\n\nprint("数据点集 X:", x)\nprint("平方序列 Y1:", y1)\nprint("累加序列 Y2:", y2)`
                }
              ],
              codeExample: `x_vals = [i for i in range(10)]\ny_vals = [x ** 2 for x in x_vals]\nprint("折线图 X 点列:", x_vals)\nprint("折线图 Y 点列:", y_vals)`,
              tips: ['可以在侧边栏【包管理器】中实时管理科学计算环境相关的各种扩展库。']
            }
          }
        ]
      }
    ]
  },
  {
    id: 'cmd_help',
    title: '命令行和原生函数说明',
    icon: 'terminal',
    topics: [
      {
        id: 'cmd_cli_flags',
        title: 'Python CLI 命令行参数',
        stage: '命令行和原生函数说明 > CLI 参数',
        summary: '完整介绍 python [options] [-c cmd | -m mod | file] [args] 所有命令行选项与参数用法。',
        content: {
          overview: '当在操作系统终端调用 `python` 命令时，解释器支持传入多种开关选项以控制执行行为、调试输出、字节码优化及沙箱环境。',
          sections: [
            {
              heading: 'Python CLI 原生命令行参数全集速查表',
              text: '以下汇总了 CPython 原生解释器支持的全部标准命令行选项：',
              table: {
                headers: ['命令开关', '完整示例', '核心功能与执行逻辑说明'],
                rows: [
                  ['-c cmd', 'python -c "import sys; print(sys.version)"', '将后续传入的字符串作为 Python 源码直接在解释器中评估执行'],
                  ['-m mod', 'python -m http.server 8000', '寻找并作为主脚本 `__main__` 执行标准库或第三方指定的模块'],
                  ['-i', 'python -i script.py', '脚本执行完毕后不退出，直接保持并进入交互式 REPL 命令行'],
                  ['-v', 'python -v script.py', '详细模式 (Verbose)。在控制台打印模块导入加载的全过程调试信息'],
                  ['-O', 'python -O script.py', '基本优化模式。生成优化字节码，在编译时移除所有的 `assert` 判定语句'],
                  ['-OO', 'python -OO script.py', '深度优化模式。在 `-O` 基础上进一步从字节码中丢弃所有 Docstring 文档字符串'],
                  ['-B', 'python -B script.py', '禁止在磁盘中自动生成或写入 `.pyc` 字节码缓存文件'],
                  ['-s', 'python -s script.py', '不将用户私有的 `user-site` 目录添加到 `sys.path` 模块检索路径中'],
                  ['-E', 'python -E script.py', '忽略所有的 Python 环境变量（如 `PYTHONPATH`、`PYTHONHOME` 等）'],
                  ['-q', 'python -q', '静默启动交互终端，不打印版权 banner 及版本头信息'],
                  ['-W arg', 'python -W ignore script.py', '警告控制。设置警告处理策略（如 `ignore`, `default`, `error`, `always`）'],
                  ['-u', 'python -u script.py', '强制二进制 stdout 与 stderr 采用无缓冲（Unbuffered）输出流'],
                  ['-x', 'python -x script.py', '跳过源文件的首行（主要用于 UNIX 风格的非标准脚本黑客模式）'],
                  ['-V / --version', 'python -V', '在控制台打印当前 Python 解释器的具体版本信息（如 Python 3.11.5）'],
                  ['-h / --help', 'python -h', '输出 Python 命令行解释器完整帮助信息与选项列表']
                ]
              },
              code: `# 在 Python 代码中模拟解析传递给脚本的命令行参数\nimport sys\nprint(f"解释器平台: {sys.platform}")\nprint("当前接收到的参数列表 (sys.argv):", sys.argv)`
            }
          ],
          codeExample: `import sys\nprint("命令行参数传递列表 sys.argv:", sys.argv)`,
          tips: ['使用 `python -m pip` 比直接运行 `pip` 命令更能精准避免多版本 Python 环境下的包路径混淆问题。']
        }
      },
      {
        id: 'cmd_m_modules',
        title: 'python -m 原生内置模块 CLI',
        stage: '命令行和原生函数说明 > 内置模块 CLI',
        summary: '详细解析 http.server, json.tool, venv, timeit, cProfile, pydoc 等内置模块命令行用法。',
        content: {
          overview: 'Python 标准库内置了大量的命令行直接运行工具模块。使用 `python -m <module_name> [args]` 可直接触发执行其内建工具。',
          sections: [
            {
              heading: '原生 CLI 工具模块全集说明表',
              text: '整理最常用且最具生产力价值的原生工具模块命令格式：',
              table: {
                headers: ['模块名称', 'CLI 命令行启动语法', '功能与使用场景说明'],
                rows: [
                  ['http.server', 'python -m http.server 8000 --bind 127.0.0.1', '快速启动零配置本地静态 HTTP Web 服务器'],
                  ['json.tool', 'python -m json.tool data.json [out.json]', '格式化、漂亮打印或校验 JSON 文件的合法性'],
                  ['venv', 'python -m venv .venv --clear', '创建独立的 Python 隔离虚拟环境（Virtual Environment）'],
                  ['pip', 'python -m pip install <pkg> --upgrade', '官方标准包管理器，用于安装或卸载 PyPI 扩展包'],
                  ['timeit', 'python -m timeit -s "import math" "math.sqrt(100)"', '微观代码段性能基准测试与耗时统计（多轮平均）'],
                  ['cProfile', 'python -m cProfile -s time script.py', '剖析 Python 脚本中各函数的调用次数与累积执行耗时'],
                  ['pydoc', 'python -m pydoc -p 8080', '启动本地 HTML Web 服务器，浏览所有已装载模块的 API 文档'],
                  ['unittest', 'python -m unittest discover -s tests', '自动寻找并运行项目目录下的所有单元测试套件'],
                  ['doctest', 'python -m doctest -v script.py', '验证与执行写在 Docstring 中的交互式测试代码'],
                  ['zipfile', 'python -m zipfile -c app.zip file1 file2', '命令行打包创建、解压或查看 ZIP 压缩归档文件'],
                  ['tarfile', 'python -m tarfile -c app.tar.gz file1', '命令行打包创建或提取 TAR/GZ 归档文件'],
                  ['dis', 'python -m dis script.py', '反汇编 Python 代码，展示其底层的 CPython 字节码指令'],
                  ['ast', 'python -m ast script.py', '将 Python 源码解析并打印为抽象语法树 (AST) 树状结构'],
                  ['trace', 'python -m trace --count script.py', '跟踪并统计 Python 程序的逐行执行覆盖率'],
                  ['site', 'python -m site', '查看当前 Python 环境的包检索路径及 sys.path 详情']
                ]
              },
              code: `# timeit 基准性能测试代码等效示例\n# 命令行等效于: python -m timeit "[x**2 for x in range(100)]"\nimport timeit\ntime_cost = timeit.timeit("[x**2 for x in range(100)]", number=10000)\nprint(f"10000 次列表推导式耗时: {time_cost:.5f} 秒")`
            }
          ],
          codeExample: `import json\nraw_data = '{"name": "PyStudio", "type": "IDE"}'\nformatted = json.dumps(json.loads(raw_data), indent=2)\nprint("json.tool 格式化效果展示:\\n", formatted)`,
          tips: ['`python -m http.server` 在前端开发与内网文件临时共享场景中极具生产效率。']
        }
      },
      {
        id: 'cmd_keywords',
        title: '35 个核心保留关键字',
        stage: '命令行和原生函数说明 > 保留关键字',
        summary: '全盘梳理 Python 35 个保留关键字 (Keywords) 的语法定义、功能分类与专业用法。',
        content: {
          overview: '关键字（Keywords）是 Python 语言底层保留的具有特殊语法含义的单词，不能用作普通的标识符、变量名或函数名。Python 3.11 共有 35 个核心关键字。',
          sections: [
            {
              heading: 'Python 35 个关键字分类表',
              text: '通过 `import keyword; print(keyword.kwlist)` 可实时获取完整列表：',
              table: {
                headers: ['功能分类', '包含关键字', '语法功能简述'],
                rows: [
                  ['逻辑与单例', 'False, True, None', '布尔真值逻辑与空对象单例'],
                  ['条件控制', 'if, elif, else', '程序多分支流程控制'],
                  ['循环控制', 'for, while, break, continue, pass', '循环结构、迭代退出与空占位符'],
                  ['函数与类', 'def, return, lambda, class', '定义函数、返回值、匿名函数与面向对象类'],
                  ['异常处理', 'try, except, finally, raise, assert', '捕获异常、终结清理、主动抛出错误与断言测试'],
                  ['模块与包', 'import, from, as', '导入模块、从指定库提取符号与重命名别名'],
                  ['变量与作用域', 'global, nonlocal, del', '声明全局变量、嵌套闭包变量与删除变量引用'],
                  ['逻辑运算符', 'and, or, not, in, is', '与/或/非布尔运算、成员检测与内存身份比对'],
                  ['上下文管理', 'with', '自动触发 `__enter__` 与 `__exit__` 资源的清理释放'],
                  ['协程异步', 'async, await, yield', '异步协程函数定义、挂起与生成器状态产出']
                ]
              },
              code: `import keyword\nprint(f"当前 Python 版本共有 {len(keyword.kwlist)} 个核心保留关键字:")\nfor idx, kw in enumerate(keyword.kwlist, 1):\n    print(f"{kw:<10}", end="\n" if idx % 5 == 0 else " ")`
            }
          ],
          codeExample: `# pass 关键字在接口抽象中的占位符应用\nclass AbstractProcessor:\n    def process_data(self):\n        pass  # 暂未实现，占位保持语法完整`,
          tips: ['在 IDE 中，保留关键字通常由编辑器的高亮引擎显示为醒目的特定颜色（如红/紫/蓝）。']
        }
      },
      {
        id: 'cmd_builtins',
        title: '核心内置函数 (Built-ins) 全集',
        stage: '命令行和原生函数说明 > 内置函数全集',
        summary: '分类详尽索引 Python 所有的原生内置函数（如 abs, len, type, map, filter, zip, open 等）。',
        content: {
          overview: '内置函数（Built-in Functions）是 Python 解释器启动时无须任何 `import` 即可直接使用的全局 API 函数。',
          sections: [
            {
              heading: '核心内置函数分类汇总表',
              text: '整理 Python 最常用的内置函数分类签名与核心用途：',
              table: {
                headers: ['分类领域', '内置函数 API', '典型用法与功能说明'],
                rows: [
                  ['数值计算', 'abs(), divmod(), pow(), round(), sum(), max(), min()', '绝对值、商和余数、乘方、四舍五入、累加和与极值计算'],
                  ['类型转换', 'int(), float(), str(), bool(), list(), tuple(), set(), dict(), bytes(), complex(), chr(), ord(), hex(), oct(), bin()', '标量与容器间的显式强制转换及 ASCII/ASCII 码/进制转换'],
                  ['对象与属性', 'type(), isinstance(), issubclass(), id(), hash(), getattr(), setattr(), hasattr(), delattr(), dir(), vars(), callable(), repr()', '类型校验、继承检测、唯一内存 ID、动态反射读取设置属性与查看属性字典'],
                  ['迭代与容器', 'len(), range(), enumerate(), zip(), map(), filter(), sorted(), reversed(), iter(), next(), all(), any(), slice()', '容器长度、索引绑定、并行配对、映射过滤、排序反转与全真/任一真逻辑判定'],
                  ['输入与输出', 'print(), input(), open(), help(), format()', '控制台标准打印输出、捕获用户输入、文件 I/O 句柄打开与格式化'],
                  ['代码评估与系统', 'eval(), exec(), compile(), globals(), locals(), breakpoint(), super()', '动态评估表达式、执行代码字符串、作用域字典获取与 OOP 继承调用']
                ]
              },
              code: `# 常用内置高阶函数组合示例\nnumbers = [-10, 15, -20, 30, 5]\nabs_sorted = sorted(map(abs, numbers))\nprint("绝对值映射后升序排列:", abs_sorted)\nprint("检测是否全部为正数:", all(x > 0 for x in abs_sorted))`
            }
          ],
          codeExample: `# dir() 与 vars() 查看对象属性\nclass Demo:\n    def __init__(self):\n        self.a = 10\n\nd = Demo()\nprint("vars(d) 属性字典:", vars(d))\nprint("dir(d) 公开方法子集:", [m for m in dir(d) if not m.startswith("__")])`,
          tips: ['切勿定义与内置函数同名的自定义变量（如 `list = [1, 2]`），这会屏蔽掉全局的 `list()` 构造函数。']
        }
      }
    ]
  }
];

// Helper to flatten all topics for quick search and Next/Prev navigation
export function getAllTutorialTopics(): TutorialTopic[] {
  const topics: TutorialTopic[] = [];
  for (const stage of TUTORIAL_STAGES) {
    if (stage.topics) {
      topics.push(...stage.topics);
    }
    if (stage.subcategories) {
      for (const sub of stage.subcategories) {
        topics.push(...sub.topics);
      }
    }
  }
  return topics;
}
