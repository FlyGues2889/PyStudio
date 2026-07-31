<script setup lang="ts" generic="T extends string | number | boolean">
defineProps<{
  options: { value: T; label: string }[];
  modelValue: T;
}>();

defineEmits<{
  (e: 'update:modelValue', value: T): void;
}>();
</script>

<template>
  <div class="m3-segmented-button-group" role="radiogroup">
    <button
      v-for="option in options"
      :key="String(option.value)"
      type="button"
      role="radio"
      :aria-checked="modelValue === option.value"
      @click="$emit('update:modelValue', option.value)"
      class="m3-segment-btn"
      :class="{ 'active': modelValue === option.value }"
    >
      <div class="m3-segment-content">
        <!-- Scale/fade checkmark transition -->
        <Transition name="check-pop">
          <span 
            v-if="modelValue === option.value"
            class="material-symbols-rounded check-icon-active"
          >
            check
          </span>
        </Transition>
        <span class="m3-segment-label">{{ option.label }}</span>
      </div>
    </button>
  </div>
</template>

<style scoped>
.m3-segmented-button-group {
  display: inline-flex;
  align-items: center;
  gap: 2px; /* Distinct 2px gap between buttons as requested */
  background-color: transparent;
  box-sizing: border-box;
}

.m3-segment-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 1.25rem; /* 20px horizontal padding per M3 spec */
  border-radius: 20px; /* Mathematical capsule/pill shape for height 40px */
  font-family: var(--font-sans, inherit);
  font-size: 0.875rem; /* Label Large (14px) */
  font-weight: 500;
  letter-spacing: 0.1px;
  background-color: var(--secondary-container); /* Unselected background is Secondary Container as requested */
  border: none;
  color: var(--secondary); /* Unselected text is Secondary as requested */
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1), 
              color 0.2s cubic-bezier(0.2, 0, 0, 1),
              border-radius 0.2s cubic-bezier(0.2, 0, 0, 1),
              transform 0.1s ease;
  outline: none;
}

.m3-segment-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover, Focus, & Active States */
.m3-segment-btn:hover:not(.active) {
  opacity: 0.9;
}

.m3-segment-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.m3-segment-btn:active {
  transform: scale(0.97); /* Small click feedback */
}

/* Selected Active State - Styled exactly with Secondary background and bg-color (surface) text */
.m3-segment-btn.active {
  background-color: var(--secondary); /* Selected background is Secondary as requested */
  color: var(--bg-color); /* Selected text color is Surface (bg-color) as requested */
  font-weight: 600; /* Emphasized text for selection */
  border-radius: 12px; /* Smaller rounded corners for the selected button */
}

/* Checkmark Vue Transition styles */
.check-icon-active {
  font-size: 1.125rem; /* 18px */
  color: var(--bg-color); /* Match selected text color (surface / bg-color) */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  will-change: transform, opacity, width, margin-right;
}

/* Smooth pop-in transition classes */
.check-pop-enter-active {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.2s cubic-bezier(0.2, 0, 0, 1),
              width 0.2s cubic-bezier(0.2, 0, 0, 1),
              margin-right 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.check-pop-leave-active {
  transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1),
              opacity 0.15s cubic-bezier(0.2, 0, 0, 1),
              width 0.15s cubic-bezier(0.2, 0, 0, 1),
              margin-right 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.check-pop-enter-from,
.check-pop-leave-to {
  transform: scale(0);
  opacity: 0;
  width: 0px;
  margin-right: 0px;
}

.check-pop-enter-to,
.check-pop-leave-from {
  transform: scale(1);
  opacity: 1;
  width: 18px;
  margin-right: 0.375rem;
}
</style>
