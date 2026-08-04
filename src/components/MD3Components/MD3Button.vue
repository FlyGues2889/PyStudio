<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
    size?: 'S' | 'M' | 'L';
    icon?: string;
    trailingIcon?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    color?: 'primary' | 'secondary' | 'error' | 'inherit';
    fullWidth?: boolean;
    title?: string;
  }>(),
  {
    variant: 'filled',
    size: 'M',
    disabled: false,
    type: 'button',
    fullWidth: false
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e);
  }
};
</script>

<template>
  <button
    :type="type"
    class="m3-button"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      color ? `color-${color}` : '',
      {
        'is-disabled': disabled,
        'has-icon': !!icon,
        'has-trailing-icon': !!trailingIcon,
        'full-width': fullWidth
      }
    ]"
    :disabled="disabled"
    :title="title"
    @click="handleClick"
  >
    <!-- Leading Icon -->
    <span v-if="icon" class="material-symbols-rounded button-icon leading-icon">
      {{ icon }}
    </span>

    <!-- Label Text -->
    <span class="button-label">
      <slot />
    </span>

    <!-- Trailing Icon -->
    <span v-if="trailingIcon" class="material-symbols-rounded button-icon trailing-icon">
      {{ trailingIcon }}
    </span>
  </button>
</template>

<style scoped>
.m3-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  font-weight: 600;
  border-radius: 9999px;
  margin: 2px;
  transition:
    background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
    color 0.2s cubic-bezier(0.2, 0, 0, 1),
    border-color 0.2s cubic-bezier(0.2, 0, 0, 1),
    box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.m3-button.full-width {
  width: 100%;
}

/* Sizes */
.size-S {
  height: 32px;
  padding: 0 16px;
  gap: 6px;
  font-size: 0.8125rem; /* 13px */
}
.size-S.has-icon {
  padding-left: 10px;
}
.size-S.has-trailing-icon {
  padding-right: 10px;
}
.size-S .button-icon {
  font-size: var(--text-size-s);
}

.size-M {
  height: 40px;
  padding: 0 24px;
  gap: 8px;
  font-size: 0.875rem; /* 14px */
}
.size-M.has-icon {
  padding-left: 14px;
}
.size-M.has-trailing-icon {
  padding-right: 14px;
}
.size-M .button-icon {
  font-size: var(--text-size-m);
}

.size-L {
  height: 48px;
  padding: 0 28px;
  gap: 10px;
  font-size: 1rem; /* 16px */
}
.size-L.has-icon {
  padding-left: 18px;
}
.size-L.has-trailing-icon {
  padding-right: 18px;
}
.size-L .button-icon {
  font-size: var(--text-size-l);
}

/* Variants */
/* 颜色全部使用 theme.css 定义的二级变量（浅色/深色各一套），不依赖任何 --md-sys-* */

/* 1. Filled Button */
.variant-filled {
  background-color: var(--primary);
  color: var(--on-primary);
}
.variant-filled:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-primary) 12%, var(--primary));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.variant-filled:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-primary) 20%, var(--primary));
  box-shadow: none;
}

/* 2. Tonal Button */
.variant-tonal {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}
.variant-tonal:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-secondary-container) 10%, var(--secondary-container));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.variant-tonal:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-secondary-container) 16%, var(--secondary-container));
  box-shadow: none;
}

/* 3. Elevated Button */
.variant-elevated {
  background-color: var(--surface-container-low, var(--surface-color));
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
}
.variant-elevated:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 8%, var(--surface-container-low, var(--surface-color)));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
}
.variant-elevated:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 14%, var(--surface-container-low, var(--surface-color)));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

/* 4. Outlined Button */
.variant-outlined {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--primary);
}
.variant-outlined:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 8%, transparent);
}
.variant-outlined:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 14%, transparent);
  border-color: var(--primary);
}

/* 5. Text Button */
.variant-text {
  background-color: transparent;
  color: var(--primary);
  padding-left: 12px;
  padding-right: 12px;
}
.variant-text.has-icon {
  padding-left: 8px;
}
.variant-text.has-trailing-icon {
  padding-right: 8px;
}
.variant-text:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 8%, transparent);
}
.variant-text:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 14%, transparent);
}

/* Color overrides：secondary / error 变体，均补齐 hover 与 active 状态 */
.color-secondary.variant-filled {
  background-color: var(--secondary);
  color: var(--on-secondary);
}
.color-secondary.variant-filled:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-secondary) 12%, var(--secondary));
}
.color-secondary.variant-filled:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-secondary) 20%, var(--secondary));
}

.color-error.variant-filled {
  background-color: var(--error);
  color: var(--on-error);
}
.color-error.variant-filled:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-error) 12%, var(--error));
}
.color-error.variant-filled:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-error) 20%, var(--error));
}

.color-error.variant-tonal {
  background-color: var(--error-container);
  color: var(--on-error-container);
}
.color-error.variant-tonal:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-error-container) 10%, var(--error-container));
}
.color-error.variant-tonal:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-error-container) 16%, var(--error-container));
}

.color-error.variant-text,
.color-error.variant-outlined {
  color: var(--error);
}
.color-error.variant-text:hover:not(:disabled),
.color-error.variant-outlined:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--error) 8%, transparent);
}
.color-error.variant-text:active:not(:disabled),
.color-error.variant-outlined:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--error) 14%, transparent);
}

/* Disabled state */
.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none !important;
}

.button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.button-label {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
</style>
