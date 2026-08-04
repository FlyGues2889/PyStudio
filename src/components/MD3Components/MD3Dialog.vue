<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../../utils/i18n';
import MD3Button from './MD3Button.vue';

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    visible?: boolean;
    title?: string;
    description?: string;
    content?: string;
    confirmText?: string;
    secondaryText?: string;
    cancelText?: string;
    danger?: boolean;
    icon?: string;
  }>(),
  {
    isOpen: undefined,
    visible: undefined,
    title: '',
    description: '',
    content: '',
    confirmText: '',
    secondaryText: '',
    cancelText: '',
    danger: false,
    icon: ''
  }
);

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'secondary'): void;
  (e: 'cancel'): void;
  (e: 'close'): void;
}>();

const { t } = useI18n();
const isDialogVisible = computed(() => {
  if (props.visible !== undefined) return props.visible;
  if (props.isOpen !== undefined) return props.isOpen;
  return false;
});

const dialogMessage = computed(() => props.description || props.content || '');

const handleCancel = () => {
  emit('cancel');
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="md3-dialog-fade">
      <div v-if="isDialogVisible" class="md3-dialog-backdrop" @click="handleCancel">
        <div class="md3-dialog-container" @click.stop>
          <div class="md3-dialog-header">
            <span class="material-symbols-rounded md3-dialog-icon" :class="{ 'is-danger': danger }">
              {{ icon || (danger ? 'warning' : 'help_outline') }}
            </span>
            <h3 class="md3-dialog-title">{{ title || t('confirmDeleteTitle') }}</h3>
          </div>

          <p v-if="dialogMessage" class="md3-dialog-description">{{ dialogMessage }}</p>

          <div class="md3-dialog-actions">
            <MD3Button
              variant="text"
              size="S"
              @click="handleCancel"
            >
              {{ cancelText || t('cancel') }}
            </MD3Button>
            <MD3Button
              v-if="secondaryText"
              variant="outlined"
              size="S"
              @click="emit('secondary')"
            >
              {{ secondaryText }}
            </MD3Button>
            <MD3Button
              variant="filled"
              size="S"
              :color="danger ? 'error' : 'primary'"
              @click="emit('confirm')"
            >
              {{ confirmText || t('confirm') }}
            </MD3Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.md3-dialog-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.md3-dialog-container {
  width: 100%;
  max-width: 440px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transform-origin: center;
}

.md3-dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.md3-dialog-icon {
  font-size: var(--text-size-l);
  color: var(--primary);
}

.md3-dialog-icon.is-danger {
  color: var(--error);
}

.md3-dialog-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.md3-dialog-description {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.md3-dialog-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.md3-dialog-btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

.cancel-btn {
  background-color: var(--surface-variant);
  color: var(--text-color);
  border: 1px solid var(--border-color-muted);
}

.cancel-btn:hover {
  background-color: var(--border-color-muted);
}

.secondary-btn {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color-muted);
}

.secondary-btn:hover {
  background-color: var(--surface-variant);
  color: var(--text-color);
}

.confirm-btn {
  background-color: var(--primary);
  color: var(--on-primary, #ffffff);
}

.confirm-btn:hover {
  opacity: 0.9;
}

.confirm-btn.is-danger {
  background-color: var(--error);
  color: var(--on-error);
}

.confirm-btn.is-danger:hover {
  background-color: var(--error);
  opacity: 0.9;
}

/* Modal Animations */
.md3-dialog-fade-enter-active,
.md3-dialog-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.md3-dialog-fade-enter-active .md3-dialog-container,
.md3-dialog-fade-leave-active .md3-dialog-container {
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.md3-dialog-fade-enter-from,
.md3-dialog-fade-leave-to {
  opacity: 0;
}

.md3-dialog-fade-enter-from .md3-dialog-container,
.md3-dialog-fade-leave-to .md3-dialog-container {
  transform: scale(0.9) translateY(10px);
}
</style>
