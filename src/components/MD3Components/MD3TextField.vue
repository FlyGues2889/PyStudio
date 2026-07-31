<script setup lang="ts">
const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    id?: string;
    label: string;
    textarea?: boolean;
    rows?: number | string;
    type?: string;
  }>(),
  {
    id: () => 'm3-input-' + Math.random().toString(36).substring(2, 9),
    textarea: false,
    rows: 4,
    type: 'text',
  }
);
</script>

<template>
  <div class="m3-text-field-container">
    <div class="m3-text-field" :class="{ 'textarea-field': textarea }">
      <textarea
        v-if="textarea"
        :id="id"
        class="m3-field-input textarea-input"
        placeholder=" "
        v-model="model"
        :rows="rows"
      />
      <input
        v-else
        :type="type"
        :id="id"
        class="m3-field-input"
        placeholder=" "
        v-model="model"
      />
      <label :for="id" class="m3-field-label">
        {{ label }}
      </label>
      <div class="m3-field-line"></div>
    </div>
  </div>
</template>

<style scoped>
.m3-text-field-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.m3-text-field {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-inverse-on-surface);
  border-radius: 12px 12px 0 0;
  padding: 1.5rem 1rem 0.5rem 1rem;
  transition: background-color var(--transition-fast, 0.2s);
}

.m3-text-field:hover {
  background-color: var(--surface-container-high, rgba(128,128,128,0.18));
}

.m3-field-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--text-color);
  caret-color: var(--primary);
  line-height: 1.5;
}

.textarea-field {
  padding-top: 1.5rem;
}

.textarea-input {
  resize: none;
  min-height: 5rem;
}

/* Floating Label styling */
.m3-field-label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

/* Focus and Not-Empty states */
.m3-field-input:focus ~ .m3-field-label,
.m3-field-input:not(:placeholder-shown) ~ .m3-field-label {
  transform: translateY(-0.6rem) scale(0.75);
}

.m3-field-input:focus ~ .m3-field-label {
  color: var(--primary);
}

/* Active bottom line indicator */
.m3-field-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--border-color-muted);
  transition: background-color 0.15s;
}

.m3-field-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary);
  transform: scaleX(0);
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.m3-field-input:focus ~ .m3-field-line::after {
  transform: scaleX(1);
}
</style>
