import { TutorialStage, TutorialTopic, TUTORIAL_STAGES } from '../components/tutor/tutorialData';
import { Language } from '../utils/i18n';

export const tutorialUI = {
  zh: {
    searchPlaceholder: '搜索课程或知识点...',
    noResults: '未找到与搜索内容匹配的教程章节',
    clickToRun: '点击在编辑器中直接运行',
    runInEditor: '载入编辑器并运行',
    copyCode: '复制源码',
    copied: '已复制到剪贴板',
    tipsTitle: '学习小贴士',
    returnToTutorial: '回到对应教程',
    stageTag: '阶段',
    sectionCodeTitle: '示例代码与校验',
    notesTitle: '说明：',
    tutorialCatalog: '教程目录',
    expandCatalog: '展开教程大纲',
    collapseCatalog: '收起教程大纲',
    interactiveExample: '交互式示例代码',
    codeSnippet: '代码片段',
    importAndRun: '导入运行',
    runInIDE: '在 IDE 中运行代码',
    previous: '上一页',
    next: '下一页'
  },
  en: {
    searchPlaceholder: 'Search tutorials or topics...',
    noResults: 'No tutorial topics found matching your search',
    clickToRun: 'Click to run code directly in editor',
    runInEditor: 'Load to Editor & Run',
    copyCode: 'Copy Source Code',
    copied: 'Copied to Clipboard',
    tipsTitle: 'Learning Pro Tips',
    returnToTutorial: 'Return to Tutorial',
    stageTag: 'Stage',
    sectionCodeTitle: 'Example Code & Test',
    notesTitle: 'Notes: ',
    tutorialCatalog: 'Tutorial Catalog',
    expandCatalog: 'Expand Catalog',
    collapseCatalog: 'Collapse Catalog',
    interactiveExample: 'Interactive Code Example',
    codeSnippet: 'Code Snippet',
    importAndRun: 'Import & Run',
    runInIDE: 'Run in IDE',
    previous: 'Previous',
    next: 'Next'
  }
};

const EnglishTutorialMap: Record<string, Partial<TutorialTopic> & { stageTitle?: string }> = {
  // --- Stage 1 ---
  p1_home: {
    title: 'Python Tutorial Home',
    stage: 'Stage 1: Basics',
    summary: 'Welcome to the PyStudio official Python guide. A systematic overview of core Python features.',
    content: {
      overview: 'Python is a high-level, interpreted, dynamically typed language. Its clean syntax emphasizes code readability, widely used in web development, data science, AI, and automation.',
      sections: [
        {
          heading: 'Core Advantages & Philosophy',
          text: '1. Clean Syntax: Forced indentation for clean, readable code.\n2. Rich Ecosystem: Over 300,000 packages covering math, AI, and web.\n3. Cross-Platform: Runs on Windows, macOS, Linux, and browser WASM.',
          notes: 'Built-in Python 3.11 WASM execution engine allows instant code execution in browser.'
        }
      ],
      codeExample: '# Python 3.11 WASM Environment Test\nimport sys\n\nprint(f"PyStudio Interpreter: Python {sys.version.split()[0]}")\nprint("Core system ready. Welcome to Python learning!")',
      tips: [
        'Click "Run in IDE" to copy and run sample code in the main editor.',
        'We recommend following stages 1 through 6 in order.'
      ]
    }
  },
  p1_intro: {
    title: 'Python Introduction',
    stage: 'Stage 1: Basics',
    summary: 'Learn Python history, architecture philosophy, and The Zen of Python.',
    content: {
      overview: 'Created by Guido van Rossum in 1989, Python emphasizes modular design and easy extensibility with C/C++ modules.',
      sections: [
        {
          heading: 'The Zen of Python (PEP 20)',
          text: 'Run `import this` to view core design principles:\n• Beautiful is better than ugly\n• Explicit is better than implicit\n• Simple is better than complex\n• Complex is better than complicated',
          code: 'import this  # Import PEP 20'
        }
      ],
      codeExample: 'import sys\nimport platform\n\nprint("OS Architecture:", platform.machine())\nprint("Python Implementation:", sys.implementation.name)',
      tips: ['The Zen of Python provides timeless rules for writing clean Pythonic code.']
    }
  },
  p1_setup: {
    title: 'Environment & Interpreter',
    stage: 'Stage 1: Basics',
    summary: 'Understand Python compilation, bytecode execution, and PyStudio runner.',
    content: {
      overview: 'Python source code (.py) is compiled to bytecode (.pyc) and executed by the CPython Virtual Machine (PVM). PyStudio executes WASM compiled Python in browser sandbox.',
      sections: [
        {
          heading: 'Compilation & Lifecycle',
          text: '1. Lexical/Syntax Analysis: Generates Abstract Syntax Tree (AST).\n2. Bytecode Generation: Compiled to PVM instruction set.\n3. VM Execution: Bytecode execution and memory GC management.',
          code: '# Evaluate dynamic expression\nx, y = 10.5, 20.25\nresult = (x * y) ** 0.5\nprint(f"Geometric mean: {result:.4f}")'
        }
      ],
      codeExample: 'a, b, c = 3, 4, 5\nis_right_triangle = (a**2 + b**2 == c**2)\nprint(f"Right triangle check ({a},{b},{c}): {is_right_triangle}")',
      tips: ['Press Ctrl + Enter in editor to quickly execute the current code.']
    }
  },
  p1_syntax: {
    title: 'Basic Syntax & Indentation',
    stage: 'Stage 1: Basics',
    summary: 'Master code block indentation, line continuation, and syntax rules.',
    content: {
      overview: 'Python uses indentation instead of curly braces to define code blocks and scope.',
      sections: [
        {
          heading: 'Indentation Rules',
          text: '• Standard: Use 4 spaces per indentation level (PEP 8).\n• Inconsistent indentation causes `IndentationError`.\n• Multiline continuation: Use `\\` or parentheses `()`.',
          code: 'total = (\n    1 + 2 + 3 +\n    4 + 5 + 6\n)\n\nif total > 10:\n    print(f"Total sum: {total}")'
        }
      ],
      codeExample: 'def validate_number(num):\n    if num > 0:\n        print("Positive number")\n        if num % 2 == 0:\n            print("Even number")\n    else:\n        print("Non-positive")\n\nvalidate_number(16)',
      tips: ['Never mix Tabs and spaces in the same source file.']
    }
  },
  p1_comments: {
    title: 'Comments & Docstrings',
    stage: 'Stage 1: Basics',
    summary: 'Learn single-line, multi-line comments, and docstrings.',
    content: {
      overview: 'Comments enhance code readability. Python interpreter ignores comments during compilation.',
      sections: [
        {
          heading: 'Comment Types',
          text: '1. Single-line: Starts with `#`.\n2. Docstring: Triple quotes `"""` inside functions or classes for API docs.',
          code: 'def calculate_bmi(weight: float, height: float) -> float:\n    """\n    Calculate Body Mass Index (BMI).\n    :param weight: Weight in kg\n    :param height: Height in meters\n    """\n    return weight / (height ** 2)\n\nprint(calculate_bmi.__doc__)'
        }
      ],
      codeExample: 'w, h = 70.0, 1.75\nbmi = calculate_bmi(w, h)\nprint(f"BMI for {w}kg, {h}m: {bmi:.2f}")',
      tips: ['Docstrings enable automatic documentation tools and IDE autocomplete help.']
    }
  },
  p1_variables: {
    title: 'Variables & Memory Binding',
    stage: 'Stage 1: Basics',
    summary: 'Understand variable assignment, reference binding, and unpacking.',
    content: {
      overview: 'Python variables are reference tags bound to objects in memory. Types are determined dynamically by objects.',
      sections: [
        {
          heading: 'Naming & Assignment',
          text: '• Names contain letters, numbers, underscores, and cannot start with numbers.\n• Case sensitive (`val` vs `Val`).\n• Tuple unpacking: `x, y = 10, 20` or `head, *tail = [1, 2, 3]`.',
          code: 'a, b = 100, 200\na, b = b, a  # Swap values\nprint(f"Swapped: a={a}, b={b}")'
        }
      ],
      codeExample: 'x = 1000\nprint("Memory ID of x:", id(x))\nx = "Python"\nprint("Memory ID after re-assignment:", id(x))',
      tips: ['Use built-in id() function to inspect memory address of objects.']
    }
  },
  p1_datatypes: {
    title: 'Data Types Overview',
    stage: 'Stage 1: Basics',
    summary: 'Overview of Python built-in core data types and mutability.',
    content: {
      overview: 'Python provides rich built-in data types. Understanding mutability and hashing is key to safe code.',
      sections: [
        {
          heading: 'Built-in Data Types Reference',
          text: 'Summary of standard types, mutability, and features:',
          table: {
            headers: ['Type', 'Name', 'Syntax', 'Mutable', 'Description'],
            rows: [
              ['String', 'str', '"Text"', 'No', 'Unicode character sequence'],
              ['Integer', 'int', '42', 'No', 'Arbitrary precision integer'],
              ['Float', 'float', '3.14', 'No', 'IEEE 754 double float'],
              ['List', 'list', '[1, 2]', 'Yes', 'Dynamic ordered array'],
              ['Tuple', 'tuple', '(1, 2)', 'No', 'Read-only ordered sequence'],
              ['Dict', 'dict', '{"a": 1}', 'Yes', 'Hash-table key-value map'],
              ['Set', 'set', '{1, 2}', 'Yes', 'Unordered unique collection'],
              ['Bool', 'bool', 'True/False', 'No', 'Boolean truth value'],
              ['None', 'NoneType', 'None', 'No', 'Null value singleton']
            ]
          }
        }
      ],
      codeExample: 'a = "Hello"\nprint("String is immutable; modification creates new object:")\nprint("Initial ID:", id(a))\na += " World"\nprint("New ID:", id(a))',
      tips: ['Immutable types can be used as Dict keys, whereas mutable types (list, dict) cannot.']
    }
  },
  p1_numbers: {
    title: 'Numbers & Arithmetic',
    stage: 'Stage 1: Basics',
    summary: 'Master int, float, complex numbers, and Decimal high precision.',
    content: {
      overview: 'Python supports `int` (arbitrary precision), `float` (64-bit), and `complex`. The `decimal` module handles high-precision math.',
      sections: [
        {
          heading: 'Arithmetic Rules',
          text: '• Division `/` always returns float.\n• Floor division `//` discards remainder.\n• Power operator `**` (e.g. `2 ** 10 = 1024`).',
          code: 'from decimal import Decimal\n\nprint("Binary float: 0.1 + 0.2 =", 0.1 + 0.2)\nprint("Decimal exact: ", Decimal("0.1") + Decimal("0.2"))'
        }
      ],
      codeExample: 'z = 3 + 4j\nprint(f"Complex {z} -> Real: {z.real}, Imag: {z.imag}, Magnitude: {abs(z)}")',
      tips: ['Use decimal.Decimal for financial calculations to avoid floating point errors.']
    }
  },
  p1_casting: {
    title: 'Type Casting',
    stage: 'Stage 1: Basics',
    summary: 'Explicit type conversion with int(), float(), str(), and bool().',
    content: {
      overview: 'Type casting converts data between different types using built-in constructor functions.',
      sections: [
        {
          heading: 'Casting Functions',
          text: '• `int(x)`: Truncates float to int or parses string.\n• `float(x)`: Converts to float.\n• `str(x)`: Converts any object to text string.\n• `list(iterable)` / `tuple(iterable)`: Container conversions.',
          code: 'hex_str = "0xFF"\nnum = int(hex_str, 16)\nprint(f"Hex {hex_str} to decimal: {num}")'
        }
      ],
      codeExample: 'raw_inputs = ["10", "3.14159"]\nparsed_int = int(raw_inputs[0])\nparsed_float = float(raw_inputs[1])\nprint(f"Sum: {parsed_int + parsed_float:.2f}")',
      tips: ['Casting invalid string formats raises ValueError.']
    }
  },
  p1_strings: {
    title: 'Strings & Text Processing',
    stage: 'Stage 1: Basics',
    summary: 'Master Unicode string indexing, slicing, formatting, and methods.',
    content: {
      overview: 'Strings in Python are immutable sequences of Unicode characters supporting slicing and rich methods.',
      sections: [
        {
          heading: 'Slicing & String Methods',
          text: '• Slicing syntax: `seq[start:stop:step]`\n• Methods: `.upper()`, `.lower()`, `.strip()`, `.split()`, `.join()`',
          code: 'text = "  PyStudio IDE  "\nclean_text = text.strip()\nprint("Clean text:", clean_text)\nprint("Reversed [::-1]:", clean_text[::-1])'
        }
      ],
      codeExample: 's = "abcdefghijklmnopqrstuvwxyz"\nprint("First 5:", s[:5])\nprint("Last 5:", s[-5:])\nprint("Step 2:", s[::2])',
      tips: ['Strings are immutable; string methods return a newly generated string.']
    }
  },
  p1_booleans: {
    title: 'Booleans & Truthiness',
    stage: 'Stage 1: Basics',
    summary: 'Understand True/False logic, short-circuit evaluation, and truthiness.',
    content: {
      overview: 'Boolean `bool` inherits from `int`. Values evaluate to True or False in conditionals.',
      sections: [
        {
          heading: 'Truthy vs Falsy',
          text: 'Falsy objects in Python include: `None`, `False`, `0`, `0.0`, `""`, `[]`, `()`, `{}`, `set()`. All other objects are Truthy.',
          code: 'def check(obj):\n    print(f"Object: {repr(obj):<12} | Truthy: {bool(obj)}")\n\ncheck("")\ncheck("Python")\ncheck([])\ncheck([1, 2])'
        }
      ],
      codeExample: 'first_name = ""\ndefault_name = "Anonymous"\nactive_name = first_name or default_name\nprint("Effective name:", active_name)',
      tips: ['Checking `if container:` is more Pythonic than `if len(container) > 0:`.']
    }
  },
  p1_operators: {
    title: 'Operators & Precedence',
    stage: 'Stage 1: Basics',
    summary: 'Master arithmetic, logical, comparison, bitwise, and identity operators.',
    content: {
      overview: 'Operators perform computations. Python provides intuitive word operators like `and`, `or`, `in`, `is`.',
      sections: [
        {
          heading: 'Operator Categories',
          text: '1. Arithmetic: `+`, `-`, `*`, `/`, `//`, `%`, `**`\n2. Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`\n3. Logical: `and`, `or`, `not`\n4. Identity: `is`, `is not` (checks memory address `id()`).',
          table: {
            headers: ['Category', 'Operator', 'Example', 'Result'],
            rows: [
              ['Arithmetic', '%', '10 % 3', '1'],
              ['Comparison', '>=', '5 >= 2', 'True'],
              ['Logical', 'and', 'True and False', 'False'],
              ['Membership', 'in', '"Py" in "PyStudio"', 'True'],
              ['Identity', 'is', 'a is b', 'bool']
            ]
          }
        }
      ],
      codeExample: 'list_a = [1, 2, 3]\nlist_b = [1, 2, 3]\nprint("Value equality (a == b):", list_a == list_b)\nprint("Memory identity (a is b):", list_a is b)',
      tips: ['Use `is` for comparing singletons like `x is None`.']
    }
  },

  // --- Stage 2 ---
  p2_list: {
    title: 'Lists (List)',
    stage: 'Stage 2: Containers',
    summary: 'Ordered mutable dynamic arrays, slicing, sorting, and list comprehensions.',
    content: {
      overview: 'Lists are dynamic ordered arrays offering O(1) random access.',
      sections: [
        {
          heading: 'Methods & List Comprehensions',
          text: '• Add/Remove: `.append()`, `.extend()`, `.insert()`, `.pop()`, `.remove()`\n• Sorting: `.sort()` (in-place) vs `sorted()` (returns new list)',
          code: 'nums = [42, 10, 88, 5]\nnums.append(99)\nnums.sort()\nprint("Sorted nums:", nums)\n\nsquares = [x**2 for x in nums if x % 2 == 0]\nprint("Even squares:", squares)'
        }
      ],
      codeExample: 'matrix = [[1, 2], [3, 4]]\nflat = [num for row in matrix for num in row]\nprint("Flattened matrix:", flat)',
      tips: ['List .append() and .pop() run in O(1) time, making List suitable for Stack data structures.']
    }
  },
  p2_tuple: {
    title: 'Tuples (Tuple)',
    stage: 'Stage 2: Containers',
    summary: 'Immutable sequences, performance advantages, and unpacking.',
    content: {
      overview: 'Tuples are immutable ordered sequences, ideal for read-only records and multi-value returns.',
      sections: [
        {
          heading: 'Tuple Features',
          text: '• Single element tuple requires trailing comma: `(42,)`.\n• Unpacking: `x, y, z = (10, 20, 30)`.',
          code: 'single = (42,)\nprint(type(single))\n\npoint = (10, 20, 30)\nx, y, z = point\nprint(f"Point coordinates: X={x}, Y={y}, Z={z}")'
        }
      ],
      codeExample: 'def get_response():\n    return 200, "OK", 0.045\n\ncode, status, latency = get_response()\nprint(f"Response: {code} {status}, Latency: {latency}s")',
      tips: ['Tuples consume less memory than lists and prevent accidental modification.']
    }
  },
  p2_set: {
    title: 'Sets (Set)',
    stage: 'Stage 2: Containers',
    summary: 'Unordered unique collections, deduplication, and set mathematics.',
    content: {
      overview: 'Sets store unique unordered elements backed by hash tables for O(1) lookups.',
      sections: [
        {
          heading: 'Set Math Operations',
          text: '• Intersection `&`: Common elements.\n• Union `|`: Combined unique elements.\n• Difference `-`: Elements in A but not B.',
          code: 'set_a = {1, 2, 3, 4}\nset_b = {3, 4, 5, 6}\nprint("Intersection:", set_a & set_b)\nprint("Union:", set_a | set_b)\nprint("Difference:", set_a - set_b)'
        }
      ],
      codeExample: 'raw_logs = ["192.168.1.1", "10.0.0.1", "192.168.1.1"]\nunique_ips = list(set(raw_logs))\nprint("Deduplicated IPs:", unique_ips)',
      tips: ['Use set() to create an empty set; {} creates an empty dictionary.']
    }
  },
  p2_dict: {
    title: 'Dictionaries (Dict)',
    stage: 'Stage 2: Containers',
    summary: 'Key-value maps, hash lookup, safe access API, and dict comprehensions.',
    content: {
      overview: 'Dictionaries store key-value pairs. Python 3.7+ guarantees insertion order preservation.',
      sections: [
        {
          heading: 'Dict Methods',
          text: '• Safe read: `.get(key, default)`\n• Views: `.keys()`, `.values()`, `.items()`\n• Merge: `dict_a | dict_b` (Python 3.9+)',
          code: 'student = {"id": 1001, "name": "Alice"}\nprint("Safe get gpa:", student.get("gpa", 4.0))\n\nextra = {"gpa": 3.9, "active": True}\nfull = student | extra\nprint("Merged dict:", full)'
        }
      ],
      codeExample: 'scores = {"Math": 95, "Physics": 88, "Chem": 92}\ntop = {k: v for k, v in scores.items() if v >= 90}\nprint("Top scores (>90):", top)',
      tips: ['Dict keys must be hashable immutable objects like str, int, tuple.']
    }
  },

  // --- Stage 3 ---
  p3_ifelse: {
    title: 'Conditional Branching',
    stage: 'Stage 3: Control Flow',
    summary: 'Conditionals with if-elif-else, nested checks, and ternary operators.',
    content: {
      overview: 'Conditionals direct code execution based on boolean truthiness.',
      sections: [
        {
          heading: 'Branching Syntax',
          text: '• Full syntax: `if cond1: ... elif cond2: ... else: ...`\n• Ternary operator: `X if Condition else Y`',
          code: 'score = 88\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"\nprint(f"Grade: {grade}")\n\nstatus = "Pass" if score >= 60 else "Fail"\nprint("Status:", status)'
        }
      ],
      codeExample: 'num = -15\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")',
      tips: ['Use early returns to reduce nested condition depth.']
    }
  },
  p3_while: {
    title: 'while Loops',
    stage: 'Stage 3: Control Flow',
    summary: 'Loop control with while, break, continue, and while-else syntax.',
    content: {
      overview: 'The while loop repeats execution as long as its condition evaluates to True.',
      sections: [
        {
          heading: 'Loop Control',
          text: '• `break`: Terminates loop immediately.\n• `continue`: Skips current iteration.\n• `while-else`: Executes when loop completes without break.',
          code: 'count = 1\nwhile count <= 3:\n    print("Iteration:", count)\n    count += 1\nelse:\n    print("Loop finished normally.")'
        }
      ],
      codeExample: 'idx = 0\nwhile idx < 10:\n    idx += 1\n    if idx % 2 == 0: continue\n    if idx > 7: break\n    print("Odd number:", idx)',
      tips: ['Ensure loop variables advance toward termination to prevent infinite loops.']
    }
  },
  p3_for: {
    title: 'for Loops & Iterators',
    stage: 'Stage 3: Control Flow',
    summary: 'Iterating sequences with range(), enumerate(), and zip().',
    content: {
      overview: 'The for loop iterates over iterable objects (lists, tuples, ranges, dicts).',
      sections: [
        {
          heading: 'Iteration Helpers',
          text: '• `range(start, stop, step)`: Lazy integer range generator.\n• `enumerate(iterable)`: Returns (index, item) pairs.\n• `zip(iter1, iter2)`: Pairs elements from multiple iterables.',
          code: 'fruits = ["apple", "banana"]\nprices = [10.5, 5.0]\n\nfor idx, (fruit, price) in enumerate(zip(fruits, prices), start=1):\n    print(f"[{idx}] {fruit}: ${price:.2f}")'
        }
      ],
      codeExample: 'total_sum = sum(range(1, 101))\nprint("Sum from 1 to 100:", total_sum)',
      tips: ['range() generates numbers lazily without allocating full list memory.']
    }
  },
  p3_input: {
    title: 'User Input & I/O',
    stage: 'Stage 3: Control Flow',
    summary: 'Capturing user text input via input() and casting types safely.',
    content: {
      overview: 'The `input(prompt)` function pauses execution and captures typed user string input.',
      sections: [
        {
          heading: 'Input Handling',
          text: 'input() always returns str. Wrap with type casting functions like int() or float().',
          code: 'raw_value = "25"\ntry:\n    age = int(raw_value)\n    print("User age:", age)\nexcept ValueError:\n    print("Invalid integer input")'
        }
      ],
      codeExample: 'mock_input = "10.5, 20.3, 30.2"\nvals = [float(x.strip()) for x in mock_input.split(",") if x.strip()]\nprint("Parsed numbers:", vals)',
      tips: ['In PyStudio interactive console, you can test interactive inputs live.']
    }
  },
  p3_formatting: {
    title: 'String Formatting',
    stage: 'Stage 3: Control Flow',
    summary: 'Master f-strings (PEP 498), str.format(), and format specifiers.',
    content: {
      overview: 'Python offers flexible text formatting. Modern f-strings provide fast, readable string interpolation.',
      sections: [
        {
          heading: 'f-string Format Specifiers',
          text: 'Use format specifiers inside `{value:spec}`:',
          table: {
            headers: ['Format', 'Syntax', 'Input', 'Output'],
            rows: [
              ['Decimals', '{val:.2f}', '3.14159', '3.14'],
              ['Percentage', '{val:.1%}', '0.856', '85.6%'],
              ['Padding', '{val:05d}', '42', '00042'],
              ['Thousands', '{val:,}', '1000000', '1,000,000']
            ]
          }
        }
      ],
      codeExample: 'val = 42\nprint(f"Binary: {val:b} | Hex: {val:x} | Octal: {val:o}")',
      tips: ['f-strings allow direct expression evaluation inside `{}` braces.']
    }
  },

  // --- Stage 4 ---
  p4_functions: {
    title: 'Functions & Arguments',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Defining functions with def, positional, keyword args, *args, and **kwargs.',
    content: {
      overview: 'Functions encapsulate reusable code logic with parameter passing and return values.',
      sections: [
        {
          heading: 'Parameter Types',
          text: '• Positional & Keyword arguments.\n• `*args`: Collects extra positional args as tuple.\n• `**kwargs`: Collects extra keyword args as dict.',
          code: 'def make_profile(username, **kwargs):\n    return {"username": username, **kwargs}\n\nuser = make_profile("alice", role="admin", level=5)\nprint("Profile:", user)'
        }
      ],
      codeExample: 'def multiply_all(*numbers):\n    res = 1\n    for n in numbers: res *= n\n    return res\n\nprint("Product:", multiply_all(2, 3, 4, 5))',
      tips: ['Never use mutable objects (list/dict) as default arguments. Use None instead.']
    }
  },
  p4_lambda: {
    title: 'Lambda Functions',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Single-line anonymous expressions with lambda, map, filter, and sorted.',
    content: {
      overview: 'Lambda functions are inline anonymous functions defined with `lambda args: expression`.',
      sections: [
        {
          heading: 'Higher-Order Functions',
          text: 'Lambda functions serve as key callbacks in `sorted()`, `map()`, and `filter()`.',
          code: 'products = [{"name": "Laptop", "price": 8999}, {"name": "Mouse", "price": 199}]\nproducts.sort(key=lambda p: p["price"])\nprint("Sorted products:", products)'
        }
      ],
      codeExample: 'nums = [1, 2, 3, 4, 5, 6]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint("Evens:", evens)',
      tips: ['Keep lambda expressions simple. For complex logic, write a named def function.']
    }
  },
  p4_array: {
    title: 'Array Module',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Compact homogeneous memory arrays with the built-in array module.',
    content: {
      overview: 'The `array` module provides space-efficient compact arrays for uniform numeric data.',
      sections: [
        {
          heading: 'Type Codes',
          text: '• `"i"`: Signed 32-bit int\n• `"f"`: Single precision float\n• `"d"`: Double precision float',
          code: 'import array\n\nint_arr = array.array("i", [10, 20, 30, 40])\nint_arr.append(50)\nprint("Array contents:", int_arr)'
        }
      ],
      codeExample: 'import array\nfloats = array.array("d", [1.1, 2.2, 3.3])\nprint("Float array:", floats)',
      tips: ['For heavy numerical and matrix computing, prefer NumPy over array.']
    }
  },
  p4_class: {
    title: 'Classes & OOP',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Class definitions, __init__ constructor, self reference, and encapsulation.',
    content: {
      overview: 'Object-Oriented Programming (OOP) encapsulates data and behavior inside classes.',
      sections: [
        {
          heading: 'Class Definition',
          text: '• `class ClassName:` defines a class namespace.\n• `__init__(self, ...)` constructor initializes instance attributes.\n• Private attributes use double underscore prefix `__var`.',
          code: 'class BankAccount:\n    def __init__(self, owner: str, balance: float = 0.0):\n        self.owner = owner\n        self.__balance = balance\n\n    def deposit(self, amount: float):\n        self.__balance += amount\n\n    def get_balance(self):\n        return self.__balance\n\nacc = BankAccount("Alice", 1000)\nacc.deposit(500)\nprint("Balance:", acc.get_balance())'
        }
      ],
      codeExample: 'class Circle:\n    pi = 3.14159\n    def __init__(self, radius):\n        self.radius = radius\n    def area(self):\n        return Circle.pi * (self.radius ** 2)\n\nc = Circle(5)\nprint(f"Area: {c.area():.2f}")',
      tips: ['Class attributes are shared by all instances, whereas instance attributes belong to single objects.']
    }
  },
  p4_inheritance: {
    title: 'Inheritance & super()',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Subclassing, method overriding, super() initialization, and MRO.',
    content: {
      overview: 'Inheritance allows subclasses to reuse and extend parent class attributes and methods.',
      sections: [
        {
          heading: 'Inheritance Usage',
          text: 'Use `super().__init__(...)` to call parent initialization.',
          code: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n    def drive(self):\n        print(f"{self.brand} is driving.")\n\nclass ElectricCar(Vehicle):\n    def __init__(self, brand, battery):\n        super().__init__(brand)\n        self.battery = battery\n\ncar = ElectricCar("Tesla", 75)\ncar.drive()'
        }
      ],
      codeExample: 'print("ElectricCar MRO chain:", [cls.__name__ for cls in ElectricCar.__mro__])',
      tips: ['Check inheritance relationships with issubclass(Child, Parent).']
    }
  },
  p4_iterators: {
    title: 'Iterators & Generators',
    stage: 'Stage 4: Functions & OOP',
    summary: '__iter__ and __next__ protocols, and yield lazy evaluation.',
    content: {
      overview: 'Iterators implement iteration protocols. Generators use `yield` for lazy memory-efficient evaluations.',
      sections: [
        {
          heading: 'Generator Functions',
          text: 'Functions containing `yield` return generator objects that evaluate lazily on demand.',
          code: 'def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint("Fibonacci sequence:", list(fibonacci(8)))'
        }
      ],
      codeExample: 'gen = (x**2 for x in range(1000000))\nprint("Generator size lightweight:", type(gen))\nprint("Next item:", next(gen))',
      tips: ['Generator expressions consume far less memory than list comprehensions on large data streams.']
    }
  },
  p4_polymorphism: {
    title: 'Polymorphism & Duck Typing',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Duck typing philosophy, dynamic interfaces, and abstract base classes.',
    content: {
      overview: '"If it walks like a duck and quacks like a duck, it\'s a duck." Python focuses on object behavior over strict type inheritance.',
      sections: [
        {
          heading: 'Duck Typing Pattern',
          text: 'Objects with matching method signatures can be passed polymorphically to functions.',
          code: 'class PDFExporter:\n    def export(self, data): print("Exporting PDF:", data)\n\nclass CSVExporter:\n    def export(self, data): print("Exporting CSV:", data)\n\ndef process(exporter, data):\n    exporter.export(data)\n\nprocess(PDFExporter(), [1, 2])\nprocess(CSVExporter(), [1, 2])'
        }
      ],
      codeExample: 'class Dog:\n    def speak(self): return "Woof!"\nclass Cat:\n    def speak(self): return "Meow!"\n\nfor animal in [Dog(), Cat()]: print(animal.speak())',
      tips: ['Enforce interface contracts with abc module AbstractBaseClass when needed.']
    }
  },
  p4_scope: {
    title: 'Scope & LEGB Rule',
    stage: 'Stage 4: Functions & OOP',
    summary: 'Local, Enclosing, Global, Built-in scopes, global and nonlocal.',
    content: {
      overview: 'Scope determines identifier visibility. Python resolves names following the LEGB rule.',
      sections: [
        {
          heading: 'LEGB Resolution',
          text: 'Local -> Enclosing -> Global -> Built-in.\n• `global x`: Modifies global variable.\n• `nonlocal x`: Modifies enclosing closure variable.',
          code: 'count = 0\ndef outer():\n    msg = "Outer"\n    def inner():\n        nonlocal msg\n        msg = "Modified"\n        global count\n        count += 1\n    inner()\n    print("Enclosing msg:", msg)\nouter()\nprint("Global count:", count)'
        }
      ],
      codeExample: 'import builtins\nprint("Built-in identifiers count:", len(dir(builtins)))',
      tips: ['Minimize global variable usage to keep functions decoupled and maintainable.']
    }
  },

  // --- Stage 5 ---
  p5_modules: {
    title: 'Modules & Packages',
    stage: 'Stage 5: Standard Library',
    summary: 'Import syntax, custom modules, sys.path, and __name__ main entry.',
    content: {
      overview: 'Modules (.py files) and packages (directories with `__init__.py`) organize Python code.',
      sections: [
        {
          heading: 'Importing & Main Check',
          text: '• `import math` / `from math import pi as PI`\n• `if __name__ == "__main__":` distinguishes script execution from module importing.',
          code: 'import math as m\nprint("Pi value:", m.pi)\n\nfrom random import randint, choice\nprint("Random int (1-100):", randint(1, 100))\nprint("Random item:", choice(["Apple", "Banana"]))'
        }
      ],
      codeExample: 'import sys\nprint("Module search paths (sys.path):", sys.path[:3])',
      tips: ['Inspect exported module symbols using `dir(module)`.']
    }
  },
  p5_datetime: {
    title: 'Date & Time Processing',
    stage: 'Stage 5: Standard Library',
    summary: 'Working with datetime, date, time, timedelta, and strftime formatting.',
    content: {
      overview: 'The standard `datetime` module provides dates, timestamps, formatting, and arithmetic.',
      sections: [
        {
          heading: 'Core API Functions',
          text: '• `datetime.now()`: Current timestamp.\n• `.strftime(format)`: Format object to text string.\n• `.strptime(string, format)`: Parse string to datetime.\n• `timedelta(days=N)`: Add/subtract time spans.',
          code: 'from datetime import datetime, timedelta\n\nnow = datetime.now()\nprint("Formatted now:", now.strftime("%Y-%m-%d %H:%M:%S"))\nfuture = now + timedelta(days=7)\nprint("In 7 days:", future.strftime("%Y-%m-%d"))'
        }
      ],
      codeExample: 'from datetime import datetime\nd_str = "2026-07-30 18:00:00"\nd_obj = datetime.strptime(d_str, "%Y-%m-%d %H:%M:%S")\nprint("Parsed year/month:", d_obj.year, d_obj.month)',
      tips: ['Use timezone-aware datetimes with the zoneinfo module for cross-timezone apps.']
    }
  },
  p5_math: {
    title: 'Math Library',
    stage: 'Stage 5: Standard Library',
    summary: 'Math constants pi/e, trigonometric functions, factorials, and gcd.',
    content: {
      overview: 'The `math` module provides standard C-level floating point mathematical operations.',
      sections: [
        {
          heading: 'Math Functions',
          text: '• Constants: `math.pi`, `math.e`, `math.inf`\n• Rounding: `math.ceil()`, `math.floor()`\n• Utilities: `math.factorial()`, `math.gcd()`, `math.sqrt()`',
          code: 'import math\n\nprint("Pi:", math.pi)\nprint("Factorial 10!:", math.factorial(10))\nprint("GCD (48, 18):", math.gcd(48, 18))\nprint("Sqrt 144:", math.sqrt(144))'
        }
      ],
      codeExample: 'import math\nangle_rad = math.radians(45)\nprint(f"sin(45 deg): {math.sin(angle_rad):.4f}")',
      tips: ['Use the cmath module when calculating complex number math.']
    }
  },
  p5_json: {
    title: 'JSON Processing',
    stage: 'Stage 5: Standard Library',
    summary: 'Serialization and parsing with json.dumps, json.loads, load, and dump.',
    content: {
      overview: 'The `json` module converts Python objects to and from JSON formatted strings.',
      sections: [
        {
          heading: 'JSON API Comparison',
          text: '• `json.loads(str)`: Parse JSON string to Python dict/list.\n• `json.dumps(obj)`: Serialize Python object to JSON string.\n• `json.load(fp)` / `json.dump(obj, fp)`: Stream file operations.',
          code: 'import json\n\nuser = {"id": 1001, "username": "developer", "active": True}\njson_str = json.dumps(user, indent=2)\nprint("JSON string:\\n", json_str)\n\nparsed = json.loads(json_str)\nprint("Parsed username:", parsed["username"])'
        }
      ],
      codeExample: 'import json\nraw = \'{"code": 200, "message": "Success"}\'\ndata = json.loads(raw)\nprint("Response status:", data["code"])',
      tips: ['Set ensure_ascii=False in json.dumps to preserve non-ASCII characters intact.']
    }
  },
  p5_regex: {
    title: 'Regular Expressions',
    stage: 'Stage 5: Standard Library',
    summary: 'Pattern matching and text extraction with re.search, match, findall, sub.',
    content: {
      overview: 'The `re` module provides powerful regex pattern matching and text substitution.',
      sections: [
        {
          heading: 'Regex Functions',
          text: '• `re.search()`: Finds first match in string.\n• `re.findall()`: Extracts all non-overlapping matches.\n• `re.sub()`: Replaces matched pattern with new text.',
          code: 'import re\n\ntext = "Phone: 13800138000, Email: admin@pystudio.io"\nmobiles = re.findall(r"1[3-9]\\d{9}", text)\nprint("Mobiles found:", mobiles)\n\nmasked = re.sub(r"[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}", "***@***", text)\nprint("Masked text:", masked)'
        }
      ],
      codeExample: 'import re\ns = "2026-07-30"\nm = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", s)\nif m: print("Year:", m.group(1), "Month:", m.group(2))',
      tips: ['Always use raw strings r"..." for regex patterns to prevent backslash escaping issues.']
    }
  },
  p5_pip: {
    title: 'PIP Package Manager',
    stage: 'Stage 5: Standard Library',
    summary: 'Third-party packages, PyPI ecosystem, and PyStudio Micropip runner.',
    content: {
      overview: '`pip` installs Python packages from PyPI. PyStudio integrates `micropip` for loading WASM packages directly.',
      sections: [
        {
          heading: 'pip CLI Commands',
          text: '• `pip install package_name`\n• `pip freeze > requirements.txt`\n• `pip install -r requirements.txt`',
          code: '# Click "Package Manager" in sidebar to install NumPy, Pandas, SymPy with one click!'
        }
      ],
      codeExample: 'import sys\nprint("Loaded interpreter modules count:", len(sys.modules))',
      tips: ['Manage third-party dependencies easily via sidebar Package Manager.']
    }
  },
  p5_tryexcept: {
    title: 'Exception Handling',
    stage: 'Stage 5: Standard Library',
    summary: 'Interpreting runtime errors with try, except, else, finally, and custom exceptions.',
    content: {
      overview: 'Exception handling prevents unhandled runtime crashes and ensures robust software.',
      sections: [
        {
          heading: 'try-except Structure',
          text: '• `try`: Monitored code block.\n• `except Error as err`: Exception catch and fallback.\n• `else`: Runs when no exceptions occur.\n• `finally`: Runs unconditionally for cleanup.',
          code: 'def safe_divide(a, b):\n    try:\n        res = a / b\n    except ZeroDivisionError as e:\n        print("Division by zero caught:", e)\n        return None\n    else:\n        return res\n    finally:\n        print("Cleanup done.")\n\nprint("Result:", safe_divide(10, 2))'
        }
      ],
      codeExample: 'class CustomError(Exception): pass\n\ntry:\n    raise CustomError("Custom error triggered")\nexcept CustomError as err:\n    print("Caught:", err)',
      tips: ['Specify exact exception types rather than using bare except: blocks.']
    }
  },
  p5_file: {
    title: 'File I/O & VFS',
    stage: 'Stage 5: Standard Library',
    summary: 'File reading and writing with open(), with context managers, and virtual FS.',
    content: {
      overview: 'The `open()` function reads and writes files. The `with` statement ensures files are closed safely.',
      sections: [
        {
          heading: 'File Modes',
          text: '• `"r"`: Read only (default).\n• `"w"`: Overwrite write.\n• `"a"`: Append write.\n• `"b"`: Binary mode.',
          table: {
            headers: ['Mode', 'Name', 'Permissions', 'Missing File Behavior'],
            rows: [
              ['"r"', 'Read', 'Read only', 'Raises FileNotFoundError'],
              ['"w"', 'Write', 'Write only', 'Creates new file / Overwrites'],
              ['"a"', 'Append', 'Write only', 'Creates new file / Appends'],
              ['"b"', 'Binary', 'Bytes I/O', 'Depends on mode']
            ]
          }
        }
      ],
      codeExample: 'with open("demo.txt", "w", encoding="utf-8") as f:\n    f.write("PyStudio File System Test\\nLine 1\\nLine 2")\n\nwith open("demo.txt", "r", encoding="utf-8") as f:\n    print("File read result:\\n" + f.read())',
      tips: ['Files created or modified in PyStudio code sync in real-time to the left file tree!']
    }
  },

  // --- Stage 6 ---
  p6_mpl_intro: {
    title: 'Matplotlib Overview',
    stage: 'Stage 6: Visualization',
    summary: 'Core concepts of Matplotlib 2D plotting library, Figure canvas, and Axes.',
    content: {
      overview: 'Matplotlib is Python\'s foundational plotting library offering Figure and Axes interfaces.',
      sections: [
        {
          heading: 'Matplotlib Features',
          text: '1. Wide chart variety: Line, scatter, bar, pie, histogram, contours.\n2. Precise styling: Granular control over axes, legends, grids, colors.\n3. Native integration: Seamless pairing with NumPy and Pandas.',
          code: 'import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nprint("Created Figure and Axes:", type(fig), type(ax))'
        }
      ],
      codeExample: 'import matplotlib.pyplot as plt\nprint("Matplotlib ready for data chart rendering.")',
      tips: ['Matplotlib is essential for data science and AI visualization.']
    }
  },
  p6_mpl_start: {
    title: 'Line & Scatter Plots',
    stage: 'Stage 6: Visualization',
    summary: 'Drawing line plots, scatter plots, custom styling, and grid labels with pyplot.',
    content: {
      overview: 'Use `matplotlib.pyplot` to create quick charts, set axis labels, legends, and grid styles.',
      sections: [
        {
          heading: 'Plotting API',
          text: '• `plt.plot(x, y)`: Line plot.\n• `plt.scatter(x, y)`: Scatter plot.\n• `plt.title()`, `plt.xlabel()`, `plt.ylabel()`: Axis labels.',
          code: 'x = [1, 2, 3, 4, 5]\ny1 = [2, 4, 9, 16, 25]\nprint("Plot X points:", x)\nprint("Plot Y points:", y1)'
        }
      ],
      codeExample: 'x_vals = list(range(10))\ny_vals = [x**2 for x in x_vals]\nprint("X values:", x_vals)\nprint("Y values:", y_vals)',
      tips: ['Manage scientific packages easily via Package Manager.']
    }
  },

  // --- CLI Reference ---
  cmd_cli_flags: {
    title: 'CLI Command Line Flags',
    stage: 'CLI & Built-ins Reference',
    summary: 'Complete guide to python [options] [-c cmd | -m mod | file] [args] CLI flags.',
    content: {
      overview: 'The python CLI supports options to control execution, debugging, optimization, and sandboxing.',
      sections: [
        {
          heading: 'Python CLI Flags Quick Reference',
          text: 'Summary of standard CPython command line flags:',
          table: {
            headers: ['Flag', 'Example', 'Function & Execution Logic'],
            rows: [
              ['-c cmd', 'python -c "import sys; print(sys.version)"', 'Execute string directly as Python code'],
              ['-m mod', 'python -m http.server 8000', 'Run standard or package module as __main__'],
              ['-i', 'python -i script.py', 'Inspect interactively after running script'],
              ['-v', 'python -v script.py', 'Verbose trace of module loading and imports'],
              ['-O', 'python -O script.py', 'Optimize bytecode, removing assert statements'],
              ['-OO', 'python -OO script.py', 'Discard docstrings in addition to -O optimizations'],
              ['-B', 'python -B script.py', 'Don\'t write .pyc bytecode files'],
              ['-s', 'python -s script.py', 'Don\'t add user site-packages directory'],
              ['-E', 'python -E script.py', 'Ignore all Python environment variables'],
              ['-q', 'python -q', 'Quiet startup mode without banner'],
              ['-V / --version', 'python -V', 'Print Python interpreter version'],
              ['-h / --help', 'python -h', 'Print full CLI help message']
            ]
          }
        }
      ],
      codeExample: 'import sys\nprint("Command line arguments sys.argv:", sys.argv)',
      tips: ['Using python -m pip avoids path confusion across multiple Python installations.']
    }
  },
  cmd_m_modules: {
    title: 'python -m Built-in Modules',
    stage: 'CLI & Built-ins Reference',
    summary: 'Guide to http.server, json.tool, venv, timeit, cProfile, and pydoc CLI tools.',
    content: {
      overview: 'The standard library includes modules runnable directly as command line tools.',
      sections: [
        {
          heading: 'Built-in CLI Modules Reference',
          text: 'Most useful built-in command line module utilities:',
          table: {
            headers: ['Module', 'CLI Syntax Example', 'Description'],
            rows: [
              ['http.server', 'python -m http.server 8000', 'Zero-config local static HTTP server'],
              ['json.tool', 'python -m json.tool data.json', 'Format, pretty-print, and validate JSON'],
              ['venv', 'python -m venv .venv', 'Create an isolated virtual environment'],
              ['pip', 'python -m pip install <pkg>', 'Official package manager'],
              ['timeit', 'python -m timeit "sum(range(100))"', 'Benchmark code snippet execution time'],
              ['cProfile', 'python -m cProfile script.py', 'Profile function execution time'],
              ['pydoc', 'python -m pydoc -p 8080', 'Browse module API docs via local web server'],
              ['unittest', 'python -m unittest discover', 'Discover and run unit test suites'],
              ['dis', 'python -m dis script.py', 'Disassemble bytecode instructions']
            ]
          }
        }
      ],
      codeExample: 'import json\nformatted = json.dumps(json.loads(\'{"app":"PyStudio"}\'), indent=2)\nprint("json.tool format result:\\n", formatted)',
      tips: ['python -m http.server is convenient for quick static file sharing.']
    }
  },
  cmd_keywords: {
    title: '35 Reserved Keywords',
    stage: 'CLI & Built-ins Reference',
    summary: 'Comprehensive reference of Python 35 reserved keywords, definitions, and categories.',
    content: {
      overview: 'Keywords are reserved words with special syntax meaning that cannot be used as variable names.',
      sections: [
        {
          heading: '35 Reserved Keywords Categorized',
          text: 'Get full list anytime via `import keyword; print(keyword.kwlist)`:',
          table: {
            headers: ['Category', 'Keywords', 'Description'],
            rows: [
              ['Booleans & Singleton', 'False, True, None', 'Boolean values and None singleton'],
              ['Conditionals', 'if, elif, else', 'Multi-branch flow control'],
              ['Loops & Control', 'for, while, break, continue, pass', 'Loop structures and pass placeholder'],
              ['Functions & Classes', 'def, return, lambda, class', 'Functions, returns, lambdas, and classes'],
              ['Exception Handling', 'try, except, finally, raise, assert', 'Catch errors, cleanup, and assertions'],
              ['Modules & Imports', 'import, from, as', 'Import modules and alias names'],
              ['Variables & Scope', 'global, nonlocal, del', 'Scope declarations and deletion'],
              ['Logical Operators', 'and, or, not, in, is', 'Boolean logic, membership, identity'],
              ['Context Manager', 'with', 'Auto resource management'],
              ['Async & Generators', 'async, await, yield', 'Coroutines and generator yields']
            ]
          }
        }
      ],
      codeExample: 'import keyword\nprint(f"Python has {len(keyword.kwlist)} reserved keywords:")\nprint(", ".join(keyword.kwlist))',
      tips: ['IDE syntax highlighters highlight reserved keywords automatically.']
    }
  },
  cmd_builtins: {
    title: 'Built-in Functions',
    stage: 'CLI & Built-ins Reference',
    summary: 'Categorized reference of Python native built-in functions (abs, len, type, map, open, etc.).',
    content: {
      overview: 'Built-in functions are global APIs available without import statements.',
      sections: [
        {
          heading: 'Core Built-in Functions',
          text: 'Standard built-in functions by functional domain:',
          table: {
            headers: ['Domain', 'Built-in APIs', 'Description'],
            rows: [
              ['Math & Numbers', 'abs(), pow(), round(), sum(), max(), min()', 'Absolute, exponent, round, sum, min/max'],
              ['Type Casting', 'int(), float(), str(), bool(), list(), dict()', 'Cast scalar & container types'],
              ['Object Reflection', 'type(), isinstance(), id(), getattr(), dir(), vars()', 'Type checks, memory ID, inspection'],
              ['Iteration & Sequences', 'len(), range(), enumerate(), zip(), sorted()', 'Length, indexing, pairing, sorting'],
              ['I/O & Formatting', 'print(), input(), open(), help(), format()', 'Console printing, user input, file handles'],
              ['Code Evaluation', 'eval(), exec(), globals(), locals(), super()', 'Dynamic evaluation, scope, super calls']
            ]
          }
        }
      ],
      codeExample: 'numbers = [-10, 15, -20, 30]\nabs_sorted = sorted(map(abs, numbers))\nprint("Sorted absolute values:", abs_sorted)',
      tips: ['Never override built-in function names like list = [1, 2] in custom code.']
    }
  }
};

export function getLocalizedTutorialStages(lang: Language): TutorialStage[] {
  if (lang === 'zh') {
    return TUTORIAL_STAGES;
  }

  // Deep copy / translate for English
  return TUTORIAL_STAGES.map((stage) => {
    const stageId = stage.id;
    let stageTitle = stage.title;

    if (stageId === 'stage1') stageTitle = 'Stage 1: Basic Syntax';
    else if (stageId === 'stage2') stageTitle = 'Stage 2: Data Containers';
    else if (stageId === 'stage3') stageTitle = 'Stage 3: Control Flow';
    else if (stageId === 'stage4') stageTitle = 'Stage 4: Functions & OOP';
    else if (stageId === 'stage5') stageTitle = 'Stage 5: Standard Library & I/O';
    else if (stageId === 'stage6') stageTitle = 'Stage 6: Specialized Modules';
    else if (stageId === 'cmd_help') stageTitle = 'CLI & Built-ins Reference';

    const translateTopic = (topic: TutorialTopic): TutorialTopic => {
      const enOverride = EnglishTutorialMap[topic.id];
      if (!enOverride) return topic;

      return {
        ...topic,
        title: enOverride.title || topic.title,
        stage: enOverride.stage || topic.stage,
        summary: enOverride.summary || topic.summary,
        content: {
          ...topic.content,
          overview: enOverride.content?.overview || topic.content.overview,
          sections: enOverride.content?.sections || topic.content.sections,
          codeExample: enOverride.content?.codeExample || topic.content.codeExample,
          tips: enOverride.content?.tips || topic.content.tips
        }
      };
    };

    if (stage.topics) {
      return {
        ...stage,
        title: stageTitle,
        topics: stage.topics.map(translateTopic)
      };
    }

    if (stage.subcategories) {
      return {
        ...stage,
        title: stageTitle,
        subcategories: stage.subcategories.map((sub) => ({
          ...sub,
          title: sub.id === 'matplotlib_sub' ? 'Matplotlib Visualization' : sub.title,
          topics: sub.topics.map(translateTopic)
        }))
      };
    }

    return {
      ...stage,
      title: stageTitle
    };
  });
}
