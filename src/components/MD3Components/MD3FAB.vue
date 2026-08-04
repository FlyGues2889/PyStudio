<script setup lang="ts">
defineProps<{
  icon: string;
  title?: string;
  desc?: string;
  position?: 'absolute' | 'fixed' | 'static';
  bottom?: string;
  right?: string;
  size?: 'S' | 'M' | 'L';
  variant?: 'primary' | 'secondary' | 'success';
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    class="md3-fab"
    :class="[
      'is-' + (position || 'absolute'),
      'size-' + (size || 'M'),
      'variant-' + (variant || 'secondary'),
      { 'has-desc': !!desc },
    ]"
    :style="{
      bottom: bottom || '16px',
      right: right || '16px',
    }"
    :title="title || ''"
    @click="$emit('click')"
  >
    <span class="material-symbols-rounded">{{ icon }}</span>
    <span v-if="desc" class="fab-desc">{{ desc }}</span>
  </button>
</template>

<style scoped>
/* === Base === */
.md3-fab {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  z-index: 50;
}

.md3-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

.md3-fab:active {
  transform: scale(0.95);
}

/* === Position === */
.md3-fab.is-absolute {
  position: absolute;
}

.md3-fab.is-fixed {
  position: fixed;
}

.md3-fab.is-static {
  position: static;
}

/* === Size S (Small FAB) === */
.md3-fab.size-S {
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.md3-fab.size-S .material-symbols-rounded {
  font-size: var(--text-size-s);
}

/* === Size M (Standard FAB) === */
.md3-fab.size-M {
  width: 56px;
  height: 56px;
  border-radius: 16px;
}

.md3-fab.size-M .material-symbols-rounded {
  font-size: var(--text-size-m);
}

/* === Size L (Large FAB) === */
.md3-fab.size-L {
  width: 96px;
  height: 96px;
  border-radius: 28px;
}

.md3-fab.size-L .material-symbols-rounded {
  font-size: var(--text-size-l);
}

/* === 带文字（desc）时变成 Extended FAB：宽度自适应 + 文字间距 === */
.md3-fab.has-desc {
  width: auto;
  padding: 0 20px;
  gap: 8px;
}

.md3-fab.has-desc .material-symbols-rounded {
  flex-shrink: 0;
}

.fab-desc {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

/* === Variant: secondary (default) === */
.md3-fab.variant-secondary {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.md3-fab.variant-secondary:hover {
  background-color: var(--secondary);
  color: var(--on-secondary);
}

/* === Variant: primary === */
.md3-fab.variant-primary {
  background-color: var(--primary);
  color: var(--on-primary);
}

.md3-fab.variant-primary:hover {
  background-color: var(--primary-hover);
  color: var(--on-primary);
}

/* === Variant: success（答对 / 完成等正向状态） === */
.md3-fab.variant-success {
  background-color: #2e7d32;
  color: #ffffff;
}

.md3-fab.variant-success:hover {
  background-color: #1b5e20;
  color: #ffffff;
}
</style>
