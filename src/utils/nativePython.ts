// 原生 Python 引擎适配层：与 PythonRunnerService 对外行为保持一致，
// 通过 nativeApi 驱动本机 Python 子进程，输出统一转成 ConsoleOutput。
import { ref } from 'vue';
import { nativeApi } from './native';
import type { ConsoleOutput, FSItem } from '../types';

type Session = 'run' | 'repl' | 'pip';

const uid = () => Math.random().toString(36).substring(2);
const now = () => new Date().toLocaleTimeString();

// 过滤 REPL 会话中 Python 打印的 >>> / ... 提示符
function cleanReplLine(text: string): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed === '>>>' || trimmed === '...') return '';
  return text.replace(/^\s*(>>>|\.\.\.)\s*/, '');
}

class NativePythonRunner {
  private detected: boolean | null = null;
  private pythonAvailable = false;
  private pythonVersion = '';
  private listenerRegistered = false;
  private listeners: Record<Session, ((kind: string, text: string) => void) | null> = {
    run: null,
    repl: null,
    pip: null,
  };
  private replStarted = false;
  private tempWorkspacePath: string | null = null;

  public statusLabel = ref('Python 3.11 Pyodide');

  get supported(): boolean {
    return nativeApi.available();
  }

  async detect(): Promise<{ available: boolean; version: string }> {
    if (this.detected !== null) {
      return { available: this.pythonAvailable, version: this.pythonVersion };
    }
    try {
      const info = await nativeApi.detectPython();
      this.pythonAvailable = !!info.available;
      this.pythonVersion = info.version || '';
    } catch {
      this.pythonAvailable = false;
    }
    this.detected = true;
    this.statusLabel.value = this.pythonAvailable
      ? `Python ${this.pythonVersion} (本地进程)`
      : 'Pyodide (未检测到本机 Python)';
    return { available: this.pythonAvailable, version: this.pythonVersion };
  }

  private async ensureListener() {
    if (this.listenerRegistered) return;
    await nativeApi.onPythonEvent((e) => {
      const handler = this.listeners[e.session as Session];
      if (handler) handler(e.kind, e.text);
    });
    this.listenerRegistered = true;
  }

  // 有本地工作区根目录时直接以它为 cwd；否则把虚拟工作区落盘到临时目录
  private async resolveCwd(workspaceFiles: FSItem[], nativeRoot: string | null): Promise<string | null> {
    if (nativeRoot) return nativeRoot;
    if (this.tempWorkspacePath) return this.tempWorkspacePath;
    const items = workspaceFiles.map((f) => ({
      path: f.path,
      content: f.content || '',
      isFolder: f.isFolder,
    }));
    const path = await nativeApi.materializeWorkspace(items);
    this.tempWorkspacePath = path;
    return path;
  }

  async runCode(
    code: string,
    workspaceFiles: FSItem[],
    onOutput: (out: ConsoleOutput) => void,
    nativeRoot: string | null
  ): Promise<{ success: boolean; durationMs: number }> {
    const startTime = performance.now();
    const session: Session = 'run';
    await this.ensureListener();

    onOutput({
      id: uid(),
      type: 'system',
      text: `▶ 使用本机 Python ${this.pythonVersion || ''} 执行...`,
      timestamp: now(),
    });

    return new Promise(async (resolve) => {
      this.listeners[session] = (kind, text) => {
        if (kind === 'stdout') {
          onOutput({ id: uid(), type: 'stdout', text: text + '\n', timestamp: now() });
        } else if (kind === 'stderr') {
          onOutput({ id: uid(), type: 'stderr', text: text + '\n', timestamp: now() });
        } else if (kind === 'done') {
          this.listeners[session] = null;
          const duration = Math.round(performance.now() - startTime);
          onOutput({
            id: uid(),
            type: 'system',
            text: `[INFO] 进程已结束，退出码 ${text}，耗时 ${duration}ms`,
            timestamp: now(),
          });
          resolve({ success: text === '0', durationMs: duration });
        } else if (kind === 'error') {
          this.listeners[session] = null;
          onOutput({ id: uid(), type: 'error', text, timestamp: now() });
          resolve({ success: false, durationMs: Math.round(performance.now() - startTime) });
        }
      };
      try {
        const cwd = await this.resolveCwd(workspaceFiles, nativeRoot);
        await nativeApi.runPython(code, cwd);
      } catch (err: any) {
        this.listeners[session] = null;
        onOutput({
          id: uid(),
          type: 'error',
          text: err?.message || String(err),
          timestamp: now(),
        });
        resolve({ success: false, durationMs: Math.round(performance.now() - startTime) });
      }
    });
  }

  private forwardRepl(kind: string, text: string, onOutput: (out: ConsoleOutput) => void) {
    if (kind === 'stdout') {
      const cleaned = cleanReplLine(text);
      if (cleaned) onOutput({ id: uid(), type: 'stdout', text: cleaned + '\n', timestamp: now() });
    } else if (kind === 'stderr') {
      onOutput({ id: uid(), type: 'stderr', text: text + '\n', timestamp: now() });
    } else if (kind === 'done') {
      this.replStarted = false;
      this.listeners['repl'] = null;
      onOutput({ id: uid(), type: 'system', text: '[INFO] REPL 会话已结束', timestamp: now() });
    }
  }

  async runREPL(
    statement: string,
    onOutput: (out: ConsoleOutput) => void,
    nativeRoot: string | null
  ): Promise<any> {
    const session: Session = 'repl';
    onOutput({ id: uid(), type: 'input', text: `>>> ${statement}`, timestamp: now() });
    await this.ensureListener();

    // REPL 会话是持久的，但每条语句传入的 onOutput 回调可能不同，这里始终更新
    this.listeners[session] = (kind, text) => this.forwardRepl(kind, text, onOutput);

    if (!this.replStarted) {
      try {
        await nativeApi.replStart(nativeRoot);
        this.replStarted = true;
      } catch (err: any) {
        this.replStarted = false;
        this.listeners[session] = null;
        onOutput({
          id: uid(),
          type: 'error',
          text: `无法启动本地 REPL: ${err?.message || err}`,
          timestamp: now(),
        });
        return undefined;
      }
    }
    try {
      await nativeApi.replInput(statement);
    } catch (err: any) {
      onOutput({ id: uid(), type: 'error', text: String(err?.message || err), timestamp: now() });
    }
    return undefined;
  }

  async loadPackage(pkgName: string, onOutput: (out: ConsoleOutput) => void): Promise<boolean> {
    const session: Session = 'pip';
    await this.ensureListener();

    return new Promise(async (resolve) => {
      this.listeners[session] = (kind, text) => {
        if (kind === 'stdout' || kind === 'stderr') {
          onOutput({
            id: uid(),
            type: kind === 'stdout' ? 'stdout' : 'stderr',
            text: text + '\n',
            timestamp: now(),
          });
        } else if (kind === 'done') {
          this.listeners[session] = null;
          const ok = text === '0';
          onOutput({
            id: uid(),
            type: 'system',
            text: ok ? `[Pip] 已通过 pip 安装 ${pkgName}` : `[Pip] 安装 ${pkgName} 失败（退出码 ${text}）`,
            timestamp: now(),
          });
          resolve(ok);
        }
      };
      try {
        await nativeApi.pipInstall(pkgName);
      } catch (err: any) {
        this.listeners[session] = null;
        onOutput({
          id: uid(),
          type: 'error',
          text: `[Pip] ${err?.message || err}`,
          timestamp: now(),
        });
        resolve(false);
      }
    });
  }

  // 杀掉当前子进程。注意：不要清除 run 监听器，让 "done" 事件正常收尾 Promise。
  async stop(): Promise<void> {
    try {
      await nativeApi.stopPython();
    } catch {
      // ignore
    }
    this.replStarted = false;
  }
}

export const nativePython = new NativePythonRunner();
