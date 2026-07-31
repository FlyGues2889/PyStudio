<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
    size?: 'SM' | 'S' | 'M' | 'L';
    icon: string;
    filledIcon?: string;
    active?: boolean;
    disabled?: boolean;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    color?: 'primary' | 'secondary' | 'error' | 'surface' | 'inherit';
  }>(),
  {
    variant: 'standard',
    size: 'M',
    type: 'button',
    active: false,
    disabled: false
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
    class="m3-icon-button"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      color ? `color-${color}` : '',
      { 'is-active': active, 'is-disabled': disabled }
    ]"
    :disabled="disabled"
    :title="title"
    @click="handleClick"
  >
    <span
      class="icon-glyph"
      :class="active && filledIcon ? 'material-symbols-rounded-fill' : 'material-symbols-rounded'"
    >
      {{ active && filledIcon ? filledIcon : icon }}
    </span>
  </button>
</template>

<style scoped>
.m3-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  position: relative;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  border-radius: 50%;
  margin: 2px;
  transition:
    background-color 0.18s cubic-bezier(0.2, 0, 0, 1),
    color 0.18s cubic-bezier(0.2, 0, 0, 1),
    border-color 0.18s cubic-bezier(0.2, 0, 0, 1),
    box-shadow 0.18s cubic-bezier(0.2, 0, 0, 1);
}

/* Sizes according to M3 Icon Button specs */
.size-SM {
  height: 20px;
  width: 20px;
  min-width: 20px;
  margin: 1px;
}
.size-SM .icon-glyph {
  font-size: 1rem; /* 16px */
}

.size-S {
  height: 32px;
  width: 32px;
  min-width: 32px;
}
.size-S .icon-glyph {
  font-size: 1.125rem; /* 18px */
}

.size-M {
  height: 40px;
  width: 40px;
  min-width: 40px;
}
.size-M .icon-glyph {
  font-size: 1.375rem; /* 22px */
}

.size-L {
  height: 48px;
  width: 48px;
  min-width: 48px;
}
.size-L .icon-glyph {
  font-size: 1.5rem; /* 24px */
}

/* Variants */

/* 1. Standard */
.variant-standard {
  background-color: transparent;
  color: var(--md-sys-color-on-surface-variant, var(--text-color, #49454f));
}
.variant-standard:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--text-color, #49454f) 8%, transparent);
}
.variant-standard:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--text-color, #49454f) 14%, transparent);
}
.variant-standard.is-active {
  background-color: var(--md-sys-color-secondary-container, var(--secondary-container, #e8def8));
  color: var(--md-sys-color-on-secondary-container, var(--on-secondary-container, #1d192b));
}

/* 2. Filled */
.variant-filled {
  background-color: var(--md-sys-color-primary, var(--primary, #6750a4));
  color: var(--md-sys-color-on-primary, #ffffff);
}
.variant-filled:hover:not(:disabled) {
  background-color: color-mix(in srgb, #ffffff 12%, var(--md-sys-color-primary, var(--primary, #6750a4)));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
.variant-filled:active:not(:disabled) {
  background-color: color-mix(in srgb, #ffffff 20%, var(--md-sys-color-primary, var(--primary, #6750a4)));
  box-shadow: none;
}
.variant-filled.is-active {
  background-color: var(--md-sys-color-primary-container, var(--primary-container, #eaddff));
  color: var(--md-sys-color-on-primary-container, var(--on-primary-container, #21005d));
}

/* 3. Tonal */
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

/* 4. Outlined */
.variant-outlined {
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline, var(--border-color, #79747e));
  color: var(--md-sys-color-on-surface-variant, var(--text-color, #49454f));
}
.variant-outlined:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--text-color, #49454f) 8%, transparent);
}
.variant-outlined:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--text-color, #49454f) 14%, transparent);
}
.variant-outlined.is-active {
  background-color: var(--md-sys-color-inverse-surface, #313033);
  color: var(--md-sys-color-inverse-on-surface, #f4eff4);
  border-color: transparent;
}

/* Color overrides */
.color-primary.variant-standard {
  color: var(--primary);
}
.color-error.variant-standard {
  color: var(--md-sys-color-error, #ba1a1a);
}
.color-error.variant-filled {
  background-color: var(--md-sys-color-error, #ba1a1a);
  color: #ffffff;
}
.color-error.variant-tonal {
  background-color: var(--md-sys-color-error-container, #ffdad6);
  color: var(--md-sys-color-on-error-container, #410002);
}

/* Disabled state */
.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none !important;
}

.icon-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
