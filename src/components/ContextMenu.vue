<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../utils/i18n';
import { FSItem } from '../types';

const props = defineProps<{
  visible: boolean;
  x: number;
  y: number;
  type: 'editor' | 'terminal' | 'filetree' | 'tutorial' | 'general';
  targetItem?: FSItem | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'copy'): void;
  (e: 'cut'): void;
  (e: 'paste'): void;
  (e: 'find'): void;
  (e: 'replace'): void;
  (e: 'save'): void;
  (e: 'new-file'): void;
  (e: 'new-folder'): void;
  (e: 'rename', item: FSItem): void;
  (e: 'reveal-in-explorer', item: FSItem): void;
  (e: 'delete', item: FSItem): void;
  (e: 'run', item: FSItem): void;
}>();

const { t } = useI18n();
const menuRef = ref<HTMLDivElement | null>(null);

const pos = ref({ left: 0, top: 0 });

const adjustPosition = () => {
  if (!menuRef.value) {
    pos.value = { left: props.x, top: props.y };
    return;
  }
  const rect = menuRef.value.getBoundingClientRect();
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  let left = props.x;
  let top = props.y;

  if (left + rect.width > winW - 8) {
    left = Math.max(8, winW - rect.width - 8);
  }
  if (top + rect.height > winH - 8) {
    top = Math.max(8, winH - rect.height - 8);
  }

  pos.value = { left, top };
};

watch(
  () => [props.visible, props.x, props.y],
  () => {
    if (props.visible) {
      pos.value = { left: props.x, top: props.y };
      nextTick(() => {
        adjustPosition();
      });
    }
  },
  { immediate: true }
);

const handleAction = (action: string) => {
  if (action === 'copy') emit('copy');
  else if (action === 'cut') emit('cut');
  else if (action === 'paste') emit('paste');
  else if (action === 'find') emit('find');
  else if (action === 'replace') emit('replace');
  else if (action === 'save') emit('save');
  else if (action === 'new-file') emit('new-file');
  else if (action === 'new-folder') emit('new-folder');
  else if (action === 'rename' && props.targetItem) emit('rename', props.targetItem);
  else if (action === 'reveal-in-explorer' && props.targetItem) emit('reveal-in-explorer', props.targetItem);
  else if (action === 'delete' && props.targetItem) emit('delete', props.targetItem);
  else if (action === 'run' && props.targetItem) emit('run', props.targetItem);

  emit('close');
};

const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    emit('close');
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('scroll', () => emit('close'), true);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="m3-menu">
      <div
        v-if="visible"
        ref="menuRef"
        class="custom-context-menu"
        :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
        @click.stop
        @contextmenu.prevent
      >
        <!-- Terminal / Console Context Menu (ONLY Copy) -->
        <template v-if="type === 'terminal'">
          <button class="context-item-btn" @click="handleAction('copy')">
            <span class="material-symbols-rounded">content_copy</span>
            <span>{{ t('copy') }}</span>
            <span class="shortcut">Ctrl+C</span>
          </button>
        </template>

        <!-- Tutorial Context Menu (ONLY Copy) -->
        <template v-else-if="type === 'tutorial'">
          <button class="context-item-btn" @click="handleAction('copy')">
            <span class="material-symbols-rounded">content_copy</span>
            <span>{{ t('copy') }}</span>
            <span class="shortcut">Ctrl+C</span>
          </button>
        </template>

        <!-- Editor Context Menu (File & Edit options) -->
        <template v-else-if="type === 'editor'">
          <div class="menu-section-label">{{ t('editMenu') }}</div>
          <button class="context-item-btn" @click="handleAction('copy')">
            <span class="material-symbols-rounded">content_copy</span>
            <span>{{ t('copy') }}</span>
            <span class="shortcut">Ctrl+C</span>
          </button>
          <button class="context-item-btn" @click="handleAction('cut')">
            <span class="material-symbols-rounded">content_cut</span>
            <span>{{ t('cut') }}</span>
            <span class="shortcut">Ctrl+X</span>
          </button>
          <button class="context-item-btn" @click="handleAction('paste')">
            <span class="material-symbols-rounded">content_paste</span>
            <span>{{ t('paste') }}</span>
            <span class="shortcut">Ctrl+V</span>
          </button>
          <div class="menu-divider"></div>
          <button class="context-item-btn" @click="handleAction('find')">
            <span class="material-symbols-rounded">search</span>
            <span>{{ t('find') }}</span>
            <span class="shortcut">Ctrl+F</span>
          </button>
          <button class="context-item-btn" @click="handleAction('replace')">
            <span class="material-symbols-rounded">find_replace</span>
            <span>{{ t('replace') }}</span>
            <span class="shortcut">Ctrl+H</span>
          </button>

          <div class="menu-divider"></div>
          <div class="menu-section-label">{{ t('fileMenu') }}</div>
          <button class="context-item-btn" @click="handleAction('save')">
            <span class="material-symbols-rounded">save</span>
            <span>{{ t('save') }}</span>
            <span class="shortcut">Ctrl+S</span>
          </button>
          <button class="context-item-btn" @click="handleAction('new-file')">
            <span class="material-symbols-rounded">note_add</span>
            <span>{{ t('newFile') }}</span>
          </button>
        </template>

        <!-- File Tree Context Menu -->
        <template v-else-if="type === 'filetree'">
          <template v-if="targetItem">
            <button
              v-if="!targetItem.isFolder && targetItem.name.endsWith('.py')"
              class="context-item-btn run-item"
              @click="handleAction('run')"
            >
              <span class="material-symbols-rounded">play_arrow</span>
              <span>{{ t('run') }}</span>
            </button>
            <button class="context-item-btn" @click="handleAction('rename')">
              <span class="material-symbols-rounded">edit</span>
              <span>{{ t('rename') }}</span>
            </button>
            <button class="context-item-btn" @click="handleAction('reveal-in-explorer')">
              <span class="material-symbols-rounded">folder_open</span>
              <span>{{ t('openInExplorer') }}</span>
            </button>
            <button class="context-item-btn delete-item" @click="handleAction('delete')">
              <span class="material-symbols-rounded">delete</span>
              <span>{{ t('delete') }}</span>
            </button>
            <div class="menu-divider"></div>
          </template>

          <button class="context-item-btn" @click="handleAction('new-file')">
            <span class="material-symbols-rounded">note_add</span>
            <span>{{ t('newFile') }}</span>
          </button>
          <button class="context-item-btn" @click="handleAction('new-folder')">
            <span class="material-symbols-rounded">create_new_folder</span>
            <span>{{ t('newFolder') }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-context-menu {
  position: fixed;
  z-index: 999999;
  transform-origin: top left;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 16px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.3);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 260px;
  width: max-content;
  user-select: none;
}

.menu-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-tertiary);
  padding: 4px 10px 2px 10px;
  letter-spacing: 0.5px;
}

.context-item-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
  width: 100%;
  white-space: nowrap;
}

.context-item-btn:hover {
  background-color: var(--surface-variant);
  color: var(--primary);
}

.context-item-btn span.material-symbols-rounded {
  font-size: 18px;
}

.context-item-btn .shortcut {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  padding-left: 20px;
  flex-shrink: 0;
}

.context-item-btn.delete-item:hover {
  background-color: var(--error);
  color: var(--on-error);
}

.context-item-btn.run-item {
  color: #16a34a;
}

.context-item-btn.run-item:hover {
  background-color: #dcfce7;
  color: #15803d;
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color-muted);
  margin: 4px 0;
}

.m3-menu-enter-active,
.m3-menu-leave-active {
  transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.m3-menu-enter-from,
.m3-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
