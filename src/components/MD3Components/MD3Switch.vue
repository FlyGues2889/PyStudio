<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
    class="m3-switch"
    :class="{ 'selected': modelValue, 'disabled': disabled }"
  >
    <span class="m3-switch-track">
      <span class="m3-switch-thumb">
        <!-- Checkmark icon inside the thumb when selected -->
        <svg
          v-if="modelValue"
          class="m3-switch-icon animate-scale-in"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    </span>
  </button>
</template>

<style scoped>
.m3-switch {
  position: relative;
  display: inline-flex;
  width: 52px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  user-select: none;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.m3-switch.disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.m3-switch-track {
  position: relative;
  width: 52px;
  height: 32px;
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: background-color 0.2s, border-color 0.2s;
  
  /* Unselected (Inactive) State */
  background-color: var(--surface-container-highest, rgba(128, 128, 128, 0.12));
  border: 2px solid var(--outline, var(--border-color));
}

.m3-switch.selected .m3-switch-track {
  /* Selected (Active) State */
  background-color: var(--primary);
  border-color: var(--primary);
}

.m3-switch-thumb {
  position: absolute;
  top: 50%;
  left: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), 
              width 0.25s cubic-bezier(0.2, 0, 0, 1), 
              height 0.25s cubic-bezier(0.2, 0, 0, 1), 
              background-color 0.2s;
  box-sizing: border-box;

  /* Unselected (Inactive) Thumb */
  width: 16px;
  height: 16px;
  background-color: var(--outline);
  transform: translate(6px, -50%);
}

.m3-switch.selected .m3-switch-thumb {
  /* Selected (Active) Thumb */
  width: 24px;
  height: 24px;
  background-color: var(--on-primary);
  transform: translate(22px, -50%);
}

/* Interaction effects */
.m3-switch:hover:not(.disabled) .m3-switch-thumb {
  background-color: var(--on-surface-variant);
}

.m3-switch.selected:hover:not(.disabled) .m3-switch-thumb {
  background-color: var(--primary-container);
}

.m3-switch-icon {
  width: 12px;
  height: 12px;
  color: var(--primary);
}

@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.15s cubic-bezier(0.2, 0, 0, 1) forwards;
}
</style>
