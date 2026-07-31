<script setup lang="ts">
import { ref, computed } from 'vue';
import { FSItem } from '../types';
import FileTreeNode from './FileTreeNode.vue';
import { useI18n } from '../utils/i18n';
import MD3Input from './MD3Components/MD3Input.vue';
import MD3IconButton from './MD3Components/MD3IconButton.vue';

const props = defineProps<{
  workspaceItems: FSItem[];
  activeFileId: string | null;
  collapsed?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-file', file: FSItem): void;
  (e: 'toggle-folder', item: FSItem): void;
  (e: 'create-file', parentId: string | null, name: string): void;
  (e: 'create-folder', parentId: string | null, name: string): void;
  (e: 'rename-item', item: FSItem, newName: string): void;
  (e: 'delete-item', item: FSItem): void;
  (e: 'run-file', item: FSItem): void;
  (e: 'download-file', item: FSItem): void;
  (e: 'toggle-collapse'): void;
  (e: 'import-files', files: FileList): void;
  (e: 'contextmenu-filetree', event: MouseEvent, item: FSItem | null): void;
}>();

const { t } = useI18n();
const searchQuery = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);

// Inline creation and rename state
const creatingState = ref<{ parentId: string | null; isFolder: boolean } | null>(null);
const editingItemId = ref<string | null>(null);
const rootNewName = ref('');

// Custom directive for autofocus & text select
const vAutofocus = {
  mounted: (el: HTMLElement) => {
    el.focus();
    if (el instanceof HTMLInputElement) {
      el.select();
    }
  }
};

const ensureFolderOpen = (folderId: string) => {
  const findAndOpen = (items: FSItem[]): boolean => {
    for (const item of items) {
      if (item.id === folderId && item.isFolder) {
        if (!item.isOpen) {
          emit('toggle-folder', item);
        }
        return true;
      }
      if (item.children && findAndOpen(item.children)) return true;
    }
    return false;
  };
  findAndOpen(props.workspaceItems);
};

const startCreateFile = (parentId: string | null = null) => {
  editingItemId.value = null;
  creatingState.value = { parentId, isFolder: false };
  rootNewName.value = '';
  if (parentId) {
    ensureFolderOpen(parentId);
  }
};

const startCreateFolder = (parentId: string | null = null) => {
  editingItemId.value = null;
  creatingState.value = { parentId, isFolder: true };
  rootNewName.value = '';
  if (parentId) {
    ensureFolderOpen(parentId);
  }
};

const startRename = (item: FSItem) => {
  creatingState.value = null;
  editingItemId.value = item.id;
};

const handleConfirmCreate = (parentId: string | null, name: string, isFolder: boolean) => {
  let finalName = name.trim();
  if (!finalName) {
    cancelInline();
    return;
  }
  if (!isFolder && !finalName.includes('.')) {
    finalName += '.py';
  }
  if (isFolder) {
    emit('create-folder', parentId, finalName);
  } else {
    emit('create-file', parentId, finalName);
  }
  cancelInline();
};

const handleConfirmCreateRoot = () => {
  if (!creatingState.value) return;
  handleConfirmCreate(creatingState.value.parentId, rootNewName.value, creatingState.value.isFolder);
};

const handleConfirmRename = (item: FSItem, newName: string) => {
  const finalName = newName.trim();
  if (finalName && finalName !== item.name) {
    emit('rename-item', item, finalName);
  }
  editingItemId.value = null;
};

const cancelInline = () => {
  creatingState.value = null;
  editingItemId.value = null;
  rootNewName.value = '';
};

const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('import-files', target.files);
    target.value = '';
  }
};

// Filtered tree logic
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return props.workspaceItems;
  const q = searchQuery.value.toLowerCase().trim();

  const filterNodes = (nodes: FSItem[]): FSItem[] => {
    return nodes.reduce<FSItem[]>((acc, item) => {
      if (item.isFolder && item.children) {
        const matchingChildren = filterNodes(item.children);
        if (matchingChildren.length > 0 || item.name.toLowerCase().includes(q)) {
          acc.push({ ...item, isOpen: true, children: matchingChildren });
        }
      } else if (item.name.toLowerCase().includes(q)) {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  return filterNodes(props.workspaceItems);
});
</script>

<template>
  <div class="attached-file-tree" :class="{ 'is-collapsed': collapsed }">
    <!-- Collapse/Expand handle button on right edge -->
    <button
      class="tree-collapse-toggle"
      :title="collapsed ? t('expandFileTree') : t('collapseFileTree')"
      @click="emit('toggle-collapse')"
    >
      <span class="material-symbols-rounded">
        {{ collapsed ? 'arrow_menu_open' : 'arrow_menu_close' }}
      </span>
    </button>

    <div v-if="!collapsed" class="tree-content">
      <!-- Tree Header Bar -->
      <div class="tree-header">
        <div class="tree-title-group">
          <span class="material-symbols-rounded header-icon">folder</span>
          <span class="tree-title">{{ t('workspace') }}</span>
        </div>

        <div class="tree-header-actions">
          <!-- New File -->
          <MD3IconButton
            variant="standard"
            size="SM"
            icon="note_add"
            :title="t('newFileTooltip')"
            @click="startCreateFile(null)"
          />

          <!-- New Folder -->
          <MD3IconButton
            variant="standard"
            size="SM"
            icon="create_new_folder"
            :title="t('newFolderTooltip')"
            @click="startCreateFolder(null)"
          />

          <!-- Upload File -->
          <MD3IconButton
            variant="standard"
            size="SM"
            icon="upload_file"
            :title="t('importFilesTooltip')"
            @click="triggerFileUpload"
          />
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept=".py,.json,.txt,.md,.csv"
            style="display: none;"
            @change="handleFileChange"
          />
        </div>
      </div>

      <!-- Quick Filter Search Input -->
      <div class="search-box">
        <MD3Input
          v-model="searchQuery"
          icon="search"
          :placeholder="t('searchFiles')"
        />
        <button
          v-if="searchQuery"
          class="clear-search-btn"
          @click="searchQuery = ''"
        >
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>

      <!-- File Tree Node List -->
      <div class="tree-node-list custom-scrollbar" @contextmenu.prevent="e => emit('contextmenu-filetree', e, null)">
        <!-- Inline Create Row at Root Level -->
        <div
          v-if="creatingState && creatingState.parentId === null"
          class="tree-node-item inline-edit-row"
          style="padding-left: 12px;"
        >
          <span class="node-spacer"></span>
          <span
            class="material-symbols-rounded node-icon"
            :style="{ color: creatingState.isFolder ? 'var(--accent-amber-text)' : 'var(--text-secondary)' }"
          >
            {{ creatingState.isFolder ? 'folder' : 'code_blocks' }}
          </span>
          <input
            v-autofocus
            v-model="rootNewName"
            type="text"
            class="node-inline-input"
            :placeholder="creatingState.isFolder ? t('folderNamePlaceholder') : t('fileNamePlaceholder')"
            @keyup.enter="handleConfirmCreateRoot"
            @keyup.esc="cancelInline"
            @blur="handleConfirmCreateRoot"
            @click.stop
          />
        </div>

        <div v-if="filteredItems.length === 0 && (!creatingState || creatingState.parentId !== null)" class="empty-tree-state">
          <span class="material-symbols-rounded empty-icon">folder_off</span>
          <p>{{ t('noMatchingFiles') }}</p>
        </div>

        <FileTreeNode
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :active-file-id="activeFileId"
          :depth="0"
          :editing-item-id="editingItemId"
          :creating-parent-id="creatingState ? creatingState.parentId : null"
          :creating-is-folder="creatingState ? creatingState.isFolder : false"
          @select-file="f => emit('select-file', f)"
          @toggle-folder="f => emit('toggle-folder', f)"
          @start-create-file="p => startCreateFile(p)"
          @start-create-folder="p => startCreateFolder(p)"
          @start-rename="f => startRename(f)"
          @confirm-create="(p, n, isF) => handleConfirmCreate(p, n, isF)"
          @confirm-rename="(f, n) => handleConfirmRename(f, n)"
          @cancel-inline="cancelInline"
          @delete-item="f => emit('delete-item', f)"
          @run-file="f => emit('run-file', f)"
          @download-file="f => emit('download-file', f)"
          @contextmenu-item="(e, f) => emit('contextmenu-filetree', e, f)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.attached-file-tree {
  width: 256px;
  height: 100%;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color-muted);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.2s ease;
  user-select: none;
}

.attached-file-tree.is-collapsed {
  width: 0;
  border-right: none;
}

.tree-collapse-toggle {
  position: absolute;
  right: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 36px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-left: none;
  border-radius: 0 1rem 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-tertiary);
  z-index: 20;
  box-shadow: none;
  transition: background-color 0.15s, color 0.15s;
}

.tree-collapse-toggle:hover {
  background-color: var(--secondary-container);
  color: var(--primary);
}

.tree-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.tree-header {
  height: 48px;
  padding: 0 12px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: none;
}

.tree-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
}

.header-icon {
  font-size: 1.25rem;
}

.tree-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-color);
}

.tree-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-box {
  padding: 4px 12px 8px 12px;
  position: relative;
  display: flex;
  align-items: center;
}

.clear-search-btn {
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn span {
  font-size: 1rem;
}

.tree-node-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.empty-tree-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: var(--text-tertiary);
  font-size: 0.8125rem;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.tree-node-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding-right: 8px;
  border-radius: 9999px;
  margin: 1px 4px;
  user-select: none;
  font-size: 0.875rem;
  color: var(--text-color);
  position: relative;
}

.node-spacer {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.node-icon {
  font-size: 1.125rem;
  margin-right: 6px;
  flex-shrink: 0;
}

.node-inline-input {
  flex: 1;
  height: 26px;
  padding: 0 8px;
  font-size: 0.8125rem;
  font-family: inherit;
  border: 1px solid var(--border-color-muted);
  border-radius: 8px;
  background-color: var(--surface-variant);
  color: var(--text-color);
  outline: none;
  box-sizing: border-box;
  margin-right: 4px;
  transition: border-color 0.15s ease, border-width 0.15s ease, background-color 0.15s ease;
}

.node-inline-input:focus {
  border: 2px solid var(--primary);
  border-radius: 8px;
  padding: 0 7px;
  background-color: var(--surface-color);
}
</style>
