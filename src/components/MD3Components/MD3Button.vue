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
  font-size: 1.125rem; /* 18px */
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
  font-size: 1.25rem; /* 20px */
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
  font-size: 1.375rem; /* 22px */
}

/* Variants */

/* 1. Filled Button */
.variant-filled {
  background-color: var(--md-sys-color-primary, var(--primary, #6750a4));
  color: var(--md-sys-color-on-primary, #ffffff);
}
.variant-filled:hover:not(:disabled) {
  background-color: color-mix(in srgb, #ffffff 12%, var(--md-sys-color-primary, var(--primary, #6750a4)));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.variant-filled:active:not(:disabled) {
  background-color: color-mix(in srgb, #ffffff 20%, var(--md-sys-color-primary, var(--primary, #6750a4)));
  box-shadow: none;
}

/* 2. Tonal Button */
.variant-tonal {
  background-color: var(--md-sys-color-secondary-container, var(--secondary-container, #e8def8));
  color: var(--md-sys-color-on-secondary-container, var(--on-secondary-container, #1d192b));
}
.variant-tonal:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-secondary-container, #1d192b) 10%, var(--secondary-container, #e8def8));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.variant-tonal:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--on-secondary-container, #1d192b) 16%, var(--secondary-container, #e8def8));
  box-shadow: none;
}

/* 3. Elevated Button */
.variant-elevated {
  background-color: var(--md-sys-color-surface-container-low, var(--surface, #f7f2fa));
  color: var(--md-sys-color-primary, var(--primary, #6750a4));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
}
.variant-elevated:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 8%, var(--surface, #f7f2fa));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
}
.variant-elevated:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary) 14%, var(--surface, #f7f2fa));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

/* 4. Outlined Button */
.variant-outlined {
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline, var(--border-color, #79747e));
  color: var(--md-sys-color-primary, var(--primary, #6750a4));
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
  color: var(--md-sys-color-primary, var(--primary, #6750a4));
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

/* Color overrides */
.color-secondary.variant-filled {
  background-color: var(--secondary, #625b71);
  color: #ffffff;
}
.color-error.variant-filled {
  background-color: var(--md-sys-color-error, #ba1a1a);
  color: #ffffff;
}
.color-error.variant-tonal {
  background-color: var(--md-sys-color-error-container, #ffdad6);
  color: var(--md-sys-color-on-error-container, #410002);
}
.color-error.variant-text,
.color-error.variant-outlined {
  color: var(--md-sys-color-error, #ba1a1a);
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
