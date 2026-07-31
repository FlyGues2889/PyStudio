import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
import i18n from './i18n';
import { minimizeWindow, maximizeWindow, closeWindow } from './utils/tauriWindow';

const app = createApp(App);
app.use(i18n);
app.mount('#root');

// Window control handlers (supports Tauri v1/v2 & Web fallback)
setTimeout(() => {
  document.getElementById('titlebar-minimize')?.addEventListener('click', () => {
    minimizeWindow();
  });
  document.getElementById('titlebar-maximize')?.addEventListener('click', () => {
    maximizeWindow();
  });
  document.getElementById('titlebar-close')?.addEventListener('click', () => {
    closeWindow();
  });
}, 100);

