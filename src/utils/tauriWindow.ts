export async function minimizeWindow(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    try {
      const tauriWin = (window as any).__TAURI__.window;
      if (tauriWin?.getCurrentWindow) {
        await tauriWin.getCurrentWindow().minimize();
        return;
      } else if (tauriWin?.appWindow) {
        await tauriWin.appWindow.minimize();
        return;
      }
    } catch (e) {
      console.error('Tauri minimize error:', e);
    }
  }

  try {
    const tauriWindow = await import('@tauri-apps/api/window');
    const win = tauriWindow.getCurrentWindow ? tauriWindow.getCurrentWindow() : (tauriWindow as any).appWindow;
    if (win?.minimize) {
      await win.minimize();
      return;
    }
  } catch (e) {
    // Not running under Tauri
  }

  console.log('Window minimize triggered (Web fallback)');
}

export async function maximizeWindow(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    try {
      const tauriWin = (window as any).__TAURI__.window;
      const win = tauriWin?.getCurrentWindow ? tauriWin.getCurrentWindow() : tauriWin?.appWindow;
      if (win) {
        if (win.toggleMaximize) {
          await win.toggleMaximize();
        } else if (win.isMaximized) {
          const isMax = await win.isMaximized();
          if (isMax) await win.unmaximize();
          else await win.maximize();
        }
        return;
      }
    } catch (e) {
      console.error('Tauri maximize error:', e);
    }
  }

  try {
    const tauriWindow = await import('@tauri-apps/api/window');
    const win = tauriWindow.getCurrentWindow ? tauriWindow.getCurrentWindow() : (tauriWindow as any).appWindow;
    if (win) {
      if (win.toggleMaximize) {
        await win.toggleMaximize();
        return;
      } else if (win.isMaximized) {
        const isMax = await win.isMaximized();
        if (isMax) await win.unmaximize();
        else await win.maximize();
        return;
      }
    }
  } catch (e) {
    // Not running under Tauri
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

export async function closeWindow(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    try {
      const tauriWin = (window as any).__TAURI__.window;
      const win = tauriWin?.getCurrentWindow ? tauriWin.getCurrentWindow() : tauriWin?.appWindow;
      if (win?.close) {
        await win.close();
        return;
      }
    } catch (e) {
      console.error('Tauri close error:', e);
    }
  }

  try {
    const tauriWindow = await import('@tauri-apps/api/window');
    const win = tauriWindow.getCurrentWindow ? tauriWindow.getCurrentWindow() : (tauriWindow as any).appWindow;
    if (win?.close) {
      await win.close();
      return;
    }
  } catch (e) {
    // Not running under Tauri
  }

  console.log('Window close triggered (Web fallback)');
}
