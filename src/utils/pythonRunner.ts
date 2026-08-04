import { ConsoleOutput, FSItem } from '../types';
import { nativePython } from './nativePython';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    pyodideInstance?: any;
  }
}

export class PythonRunnerService {
  private pyodide: any = null;
  private isLoading = false;
  private isReady = false;
  private demoScope: Record<string, any> = {};

  // 当前原生工作区根目录（由 App 在打开本地文件夹时设置），用于给本机 Python 指定 cwd
  public workspaceRoot: string | null = null;

  public async initPyodide(onOutput?: (out: ConsoleOutput) => void): Promise<boolean> {
    if (this.isReady) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    try {
      if (typeof window !== 'undefined') {
        if (!window.loadPyodide) {
          onOutput?.({
            id: Math.random().toString(36).substring(2),
            type: 'system',
            text: '[INFO] Connecting to Pyodide WASM engine...',
            timestamp: new Date().toLocaleTimeString()
          });

          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Pyodide CDN unavailable'));
            document.head.appendChild(script);
          });
        }

        if (window.loadPyodide) {
          const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/';
          this.pyodide = await window.loadPyodide({ indexURL: PYODIDE_CDN });
          window.pyodideInstance = this.pyodide;
          this.isReady = true;
          this.isLoading = false;

          onOutput?.({
            id: Math.random().toString(36).substring(2),
            type: 'system',
            text: '[INFO] Pyodide Python 3.11 WASM Engine Active!',
            timestamp: new Date().toLocaleTimeString()
          });
          return true;
        }
      }
      throw new Error('Web environment missing');
    } catch (err: any) {
      this.isLoading = false;
      this.isReady = false;
      onOutput?.({
        id: Math.random().toString(36).substring(2),
        type: 'system',
        text: '[INFO] Web Presentation Mode active (Using Instant Python Demo Engine).',
        timestamp: new Date().toLocaleTimeString()
      });
      return false;
    }
  }

  public isPyodideReady(): boolean {
    return this.isReady;
  }

  public syncFileSystem(items: FSItem[], _basePath = '') {
    if (!this.pyodide) return;
    try {
      const fs = this.pyodide.FS;
      for (const item of items) {
        const fullPath = item.path.startsWith('/') ? item.path : '/' + item.path;
        if (item.isFolder) {
          try { fs.mkdir(fullPath); } catch (e: any) {}
          if (item.children) this.syncFileSystem(item.children, fullPath);
        } else {
          const content = item.content || '';
          try {
            const parts = fullPath.split('/').filter(Boolean);
            if (parts.length > 1) {
              let currentDir = '';
              for (let i = 0; i < parts.length - 1; i++) {
                currentDir += '/' + parts[i];
                try { fs.mkdir(currentDir); } catch (e) {}
              }
            }
            fs.writeFile(fullPath, content);
          } catch (e) {}
        }
      }
    } catch (err) {}
  }

  public async runCode(
    code: string,
    workspaceFiles: FSItem[],
    onOutput: (out: ConsoleOutput) => void,
    forceDemoMode = false
  ): Promise<{ success: boolean; durationMs: number }> {
    // 渐进增强：Tauri 环境且本机有 Python 时，优先用真实子进程执行
    if (!forceDemoMode && nativePython.supported) {
      const det = await nativePython.detect();
      if (det.available) {
        return nativePython.runCode(code, workspaceFiles, onOutput, this.workspaceRoot);
      }
    }

    const startTime = performance.now();

    if (!forceDemoMode && !this.isReady && !this.isLoading) {
      await this.initPyodide(onOutput);
    }

    if (!forceDemoMode && this.isReady && this.pyodide) {
      try {
        this.syncFileSystem(workspaceFiles);

        const stdoutHandler = (text: string) => {
          onOutput({
            id: Math.random().toString(36).substring(2),
            type: 'stdout',
            text,
            timestamp: new Date().toLocaleTimeString()
          });
        };

        const stderrHandler = (text: string) => {
          onOutput({
            id: Math.random().toString(36).substring(2),
            type: 'stderr',
            text,
            timestamp: new Date().toLocaleTimeString()
          });
        };

        this.pyodide.setStdout({ batched: stdoutHandler });
        this.pyodide.setStderr({ batched: stderrHandler });

        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'stdout',
          text: '\n',
          timestamp: new Date().toLocaleTimeString()
        });

        await this.pyodide.runPythonAsync(code);

        const durationMs = Math.round(performance.now() - startTime);

        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'stdout',
          text: '\n',
          timestamp: new Date().toLocaleTimeString()
        });

        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'system',
          text: `[INFO] Process finished with code 0 in ${durationMs}ms`,
          timestamp: new Date().toLocaleTimeString()
        });

        return { success: true, durationMs };
      } catch (err: any) {
        const durationMs = Math.round(performance.now() - startTime);
        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'error',
          text: err?.message || String(err),
          timestamp: new Date().toLocaleTimeString()
        });
        return { success: false, durationMs };
      }
    }

    // Default: Lightweight instant presentation demo mode
    return this.runDemoInterpreter(code, workspaceFiles, onOutput, startTime);
  }

  public async runREPL(
    statement: string,
    onOutput: (out: ConsoleOutput) => void,
    forceDemoMode = false
  ): Promise<any> {
    if (!forceDemoMode && nativePython.supported) {
      const det = await nativePython.detect();
      if (det.available) {
        return nativePython.runREPL(statement, onOutput, this.workspaceRoot);
      }
    }

    onOutput({
      id: Math.random().toString(36).substring(2),
      type: 'input',
      text: `>>> ${statement}`,
      timestamp: new Date().toLocaleTimeString()
    });

    if (!forceDemoMode && !this.isReady && !this.isLoading) {
      await this.initPyodide(onOutput);
    }

    if (!forceDemoMode && this.isReady && this.pyodide) {
      try {
        const stdoutHandler = (text: string) => {
          onOutput({
            id: Math.random().toString(36).substring(2),
            type: 'stdout',
            text,
            timestamp: new Date().toLocaleTimeString()
          });
        };
        this.pyodide.setStdout({ batched: stdoutHandler });
        const result = await this.pyodide.runPythonAsync(statement);
        if (result !== undefined) {
          onOutput({
            id: Math.random().toString(36).substring(2),
            type: 'stdout',
            text: String(result),
            timestamp: new Date().toLocaleTimeString()
          });
        }
        return result;
      } catch (err: any) {
        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'error',
          text: err?.message || String(err),
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } else {
      // Demo mode REPL
      return this.runDemoREPL(statement, onOutput);
    }
  }

  private runDemoInterpreter(
    code: string,
    _workspaceFiles: FSItem[],
    onOutput: (out: ConsoleOutput) => void,
    startTime: number
  ): { success: boolean; durationMs: number } {
    onOutput({
      id: Math.random().toString(36).substring(2),
      type: 'info',
      text: '[INFO] Running in Python You Presentation Demo Mode...',
      timestamp: new Date().toLocaleTimeString()
    });

    const logs: string[] = [];
    const scope: Record<string, any> = {
      math: { pi: Math.PI, e: Math.E, sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, factorial: (n: number) => { let r=1; for(let i=2;i<=n;i++) r*=i; return r; }, gcd: (a: number, b: number) => { return b === 0 ? a : scope.math.gcd(b, a % b); } },
      sys: { version: '3.11.0 (Demo Mode)', platform: 'browser' },
      json: { dumps: (v: any) => JSON.stringify(v, null, 2), loads: (s: string) => JSON.parse(s) },
      random: { randint: (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a },
      len: (obj: any) => obj ? (obj.length ?? Object.keys(obj).length) : 0,
      sum: (arr: number[]) => Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0,
      max: (...args: any[]) => Math.max(...(Array.isArray(args[0]) ? args[0] : args)),
      min: (...args: any[]) => Math.min(...(Array.isArray(args[0]) ? args[0] : args)),
      abs: (x: number) => Math.abs(x),
      range: (a: number, b?: number, step = 1) => {
        const start = b === undefined ? 0 : a;
        const stop = b === undefined ? a : b;
        const res = [];
        for (let i = start; i < stop; i += step) res.push(i);
        return res;
      }
    };

    try {
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        // Simple print(...) handling
        if (line.startsWith('print(') && line.endsWith(')')) {
          const content = line.substring(6, line.length - 1).trim();
          const evaluated = this.evaluatePythonExpression(content, scope);
          logs.push(String(evaluated));
          continue;
        }

        // Variable assignment
        if (line.includes('=') && !line.startsWith('if') && !line.startsWith('while') && !line.includes('==')) {
          const eqIdx = line.indexOf('=');
          const varName = line.substring(0, eqIdx).trim();
          const valExpr = line.substring(eqIdx + 1).trim();
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            scope[varName] = this.evaluatePythonExpression(valExpr, scope);
            continue;
          }
        }
      }

      onOutput({
        id: Math.random().toString(36).substring(2),
        type: 'stdout',
        text: '\n',
        timestamp: new Date().toLocaleTimeString()
      });

      if (logs.length > 0) {
        logs.forEach((log) => {
          onOutput({
            id: Math.random().toString(36).substring(2),
            type: 'stdout',
            text: log,
            timestamp: new Date().toLocaleTimeString()
          });
        });
      } else {
        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'stdout',
          text: '[INFO] Code executed successfully in presentation mode.',
          timestamp: new Date().toLocaleTimeString()
        });
      }

      const durationMs = Math.round(performance.now() - startTime);

      onOutput({
        id: Math.random().toString(36).substring(2),
        type: 'stdout',
        text: '\n',
        timestamp: new Date().toLocaleTimeString()
      });

      onOutput({
        id: Math.random().toString(36).substring(2),
        type: 'system',
        text: `[INFO] Process finished with code 0 in ${durationMs}ms`,
        timestamp: new Date().toLocaleTimeString()
      });

      return { success: true, durationMs };
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      onOutput({
        id: Math.random().toString(36).substring(2),
        type: 'error',
        text: err?.message || String(err),
        timestamp: new Date().toLocaleTimeString()
      });
      return { success: false, durationMs };
    }
  }

  private runDemoREPL(statement: string, onOutput: (out: ConsoleOutput) => void) {
    try {
      const trimmed = statement.trim();
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const content = trimmed.substring(6, trimmed.length - 1).trim();
        const res = this.evaluatePythonExpression(content, this.demoScope);
        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'stdout',
          text: String(res),
          timestamp: new Date().toLocaleTimeString()
        });
        return res;
      }

      if (trimmed.includes('=') && !trimmed.includes('==')) {
        const eqIdx = trimmed.indexOf('=');
        const varName = trimmed.substring(0, eqIdx).trim();
        const valExpr = trimmed.substring(eqIdx + 1).trim();
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
          const val = this.evaluatePythonExpression(valExpr, this.demoScope);
          this.demoScope[varName] = val;
          return val;
        }
      }

      const res = this.evaluatePythonExpression(trimmed, this.demoScope);
      if (res !== undefined) {
        onOutput({
          id: Math.random().toString(36).substring(2),
          type: 'stdout',
          text: typeof res === 'object' ? JSON.stringify(res) : String(res),
          timestamp: new Date().toLocaleTimeString()
        });
      }
      return res;
    } catch (err: any) {
      onOutput({
        id: Math.random().toString(36).substring(2),
        type: 'error',
        text: `[REPL Error] ${err?.message || err}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  private evaluatePythonExpression(expr: string, scope: Record<string, any>): any {
    expr = expr.trim();
    if (!expr) return '';

    // Handle string literal (unescape \n \t \\ \' \" so demo output matches Pyodide)
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.substring(1, expr.length - 1).replace(/\\(['"\\\\nrt])/g, (_, ch) => {
        switch (ch) { case 'n': return '\n'; case 't': return '\t'; case 'r': return '\r'; default: return ch; }
      });
    }

    // Handle f-string
    if ((expr.startsWith('f"') && expr.endsWith('"')) || (expr.startsWith("f'") && expr.endsWith("'"))) {
      let raw = expr.substring(2, expr.length - 1);
      let out = raw.replace(/\{([^}]+)\}/g, (_, sub) => {
        return String(this.evaluatePythonExpression(sub, scope));
      });
      return out.replace(/\\(['"\\\\nrt])/g, (_, ch) => {
        switch (ch) { case 'n': return '\n'; case 't': return '\t'; case 'r': return '\r'; default: return ch; }
      });
    }

    // Numbers
    if (!isNaN(Number(expr))) {
      return Number(expr);
    }

    // Booleans / None
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (expr === 'None') return null;

    // Direct scope variable lookup
    if (scope[expr] !== undefined) {
      return scope[expr];
    }

    // Basic arithmetic evaluation safety
    try {
      // Replace python operators ** and // for JS math evaluation
      let jsExpr = expr
        .replace(/\*\*/g, '**')
        .replace(/\/\//g, 'Math.floor/')
        .replace(/and/g, '&&')
        .replace(/or/g, '||')
        .replace(/not/g, '!');

      const keys = Object.keys(scope);
      const values = keys.map(k => scope[k]);
      const func = new Function(...keys, `return ${jsExpr};`);
      return func(...values);
    } catch (e) {
      return expr;
    }
  }

  public async loadPackage(pkgName: string, onOutput?: (out: ConsoleOutput) => void, forceDemoMode = false): Promise<boolean> {
    if (!forceDemoMode && nativePython.supported) {
      const det = await nativePython.detect();
      if (det.available && onOutput) {
        return nativePython.loadPackage(pkgName, onOutput);
      }
    }

    if (!forceDemoMode && !this.isReady && !this.isLoading) {
      await this.initPyodide(onOutput);
    }

    if (!forceDemoMode && this.isReady && this.pyodide) {
      try {
        onOutput?.({
          id: Math.random().toString(36).substring(2),
          type: 'system',
          text: `[INFO] Installing package '${pkgName}' via Pyodide micropip...`,
          timestamp: new Date().toLocaleTimeString()
        });
        await this.pyodide.loadPackage(pkgName);
        onOutput?.({
          id: Math.random().toString(36).substring(2),
          type: 'system',
          text: `[INFO] Package '${pkgName}' installed successfully!`,
          timestamp: new Date().toLocaleTimeString()
        });
        return true;
      } catch (err: any) {
        onOutput?.({
          id: Math.random().toString(36).substring(2),
          type: 'error',
          text: `[ERROR] Failed to install '${pkgName}': ${err?.message || err}`,
          timestamp: new Date().toLocaleTimeString()
        });
        return false;
      }
    }

    onOutput?.({
      id: Math.random().toString(36).substring(2),
      type: 'system',
      text: `[INFO] Package '${pkgName}' registered in presentation mode.`,
      timestamp: new Date().toLocaleTimeString()
    });
    return true;
  }

  // 停止当前运行的子进程（本机 Python 引擎可真正中断；Pyodide/演示模式为尽力而为）
  public async stop(): Promise<void> {
    if (nativePython.supported) {
      await nativePython.stop();
    }
  }
}

export const pythonRunner = new PythonRunnerService();
