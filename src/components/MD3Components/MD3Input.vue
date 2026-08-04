<script setup lang="ts">
import { ref } from 'vue';

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    icon?: string;
    type?: string;
    disabled?: boolean;
    autofocus?: boolean;
  }>(),
  {
    placeholder: '',
    icon: '',
    type: 'text',
    disabled: false,
    autofocus: false
  }
);

const emit = defineEmits<{
  (e: 'keyup', event: KeyboardEvent): void;
  (e: 'keydown', event: KeyboardEvent): void;
  (e: 'enter', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const focus = () => inputRef.value?.focus();
const select = () => inputRef.value?.select();

defineExpose({
  inputRef,
  focus,
  select
});
</script>

<template>
  <div class="md3-input-wrapper">
    <span v-if="icon" class="material-symbols-rounded md3-input-icon">{{ icon }}</span>
    <input
      ref="inputRef"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      class="md3-input-element"
      :class="{ 'has-icon': !!icon }"
      @keyup="emit('keyup', $event)"
      @keyup.enter="emit('enter', model)"
      @keydown="emit('keydown', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
  </div>
</template>

<style scoped>
.md3-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.md3-input-icon {
  position: absolute;
  left: 14px;
  font-size: var(--text-size-s);
  color: var(--text-tertiary);
  pointer-events: none;
  user-select: none;
}

.md3-input-element {
  width: 100%;
  height: 38px;
  padding: 0 16px;
  background-color: var(--surface-variant);
  border: 1px solid var(--border-color-muted);
  border-radius: 9999px;
  font-size: 0.8125rem;
  color: var(--text-color);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease, border-width 0.15s ease, background-color 0.15s ease;
  font-family: inherit;
}

.md3-input-element.has-icon {
  padding-left: 38px;
}

.md3-input-element::placeholder {
  color: var(--text-tertiary);
}

.md3-input-element:focus {
  border: 2px solid var(--primary);
  background-color: var(--surface-color);
}

.md3-input-element.has-icon:focus {
  padding-left: 37px;
}

.md3-input-element:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
