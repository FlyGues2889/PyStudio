<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
  step?: number | string;
  variant?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'sm' | 'md' | 'lg';
}>(), {
  min: 0,
  max: 100,
  step: 1,
  variant: 'xs'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const normalizedVariant = computed(() => {
  const v = props.variant.toLowerCase();
  if (v === 'sm' || v === 's') return 's';
  if (v === 'md' || v === 'm') return 'm';
  if (v === 'lg' || v === 'l') return 'l';
  return v; // 'xs' or 'xl'
});

const sliderRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);

const percentage = computed(() => {
  const range = props.max - props.min;
  if (range === 0) return 0;
  return Math.min(Math.max(((props.modelValue - props.min) / range) * 100, 0), 100);
});

const updateValueFromCoords = (clientX: number) => {
  if (!sliderRef.value) return;
  const rect = sliderRef.value.getBoundingClientRect();
  const width = rect.width;
  // Calculate relative coordinate within the slider boundary
  const x = Math.min(Math.max(0, clientX - rect.left), width);
  const percent = x / width;
  const rawValue = props.min + percent * (props.max - props.min);
  
  // Apply step refinement
  let steppedValue = rawValue;
  if (props.step) {
    const stepNum = typeof props.step === 'string' ? parseFloat(props.step) : props.step;
    const steps = Math.round((rawValue - props.min) / stepNum);
    steppedValue = props.min + steps * stepNum;
  }
  
  // Bound the final value
  steppedValue = Math.min(Math.max(steppedValue, props.min), props.max);
  emit('update:modelValue', steppedValue);
};

const handlePointerDown = (event: PointerEvent) => {
  if (sliderRef.value) {
    sliderRef.value.setPointerCapture(event.pointerId);
  }
  isDragging.value = true;
  updateValueFromCoords(event.clientX);
  
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return;
  updateValueFromCoords(event.clientX);
};

const handlePointerUp = (event: PointerEvent) => {
  if (isDragging.value) {
    if (sliderRef.value) {
      sliderRef.value.releasePointerCapture(event.pointerId);
    }
    isDragging.value = false;
  }
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerup', handlePointerUp);
};

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerup', handlePointerUp);
});

const handleKeyDown = (event: KeyboardEvent) => {
  const stepNum = typeof props.step === 'string' ? parseFloat(props.step) : props.step || 1;
  let newValue = props.modelValue;
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    newValue += stepNum;
    event.preventDefault();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    newValue -= stepNum;
    event.preventDefault();
  } else if (event.key === 'Home') {
    newValue = props.min;
    event.preventDefault();
  } else if (event.key === 'End') {
    newValue = props.max;
    event.preventDefault();
  }
  newValue = Math.min(Math.max(newValue, props.min), props.max);
  emit('update:modelValue', newValue);
};
</script>

<template>
  <div 
    ref="sliderRef" 
    class="m3-slider-btn" 
    :class="[`m3-slider--${normalizedVariant}`, { 'is-dragging': isDragging }]"
    :style="{ '--active-width': percentage + '%' }"
    tabindex="0"
    @keydown="handleKeyDown"
    @pointerdown="handlePointerDown"
  >
    <!-- Left Active Background -->
    <div class="active-bkg"></div>

    <!-- Active Center Control Button (Slider Thumb) -->
    <div class="control-btn" :class="{ 'grabbing': isDragging }"></div>

    <!-- Right Unactive Background -->
    <div class="unactive-bkg"></div>

    <!-- M3 Decorative Dot Left -->
    <div class="decorate-dot-left"></div>

    <!-- M3 Decorative Dot Right -->
    <div class="decorate-dot-right"></div>
  </div>
</template>

<style scoped>
.m3-slider-btn {
  /* Dynamic custom sizing variables initialized to XS (default/thinnest variant) */
  --active-width: 0%;
  --active-color: var(--primary);
  --bkg-color: var(--primary-container);
  
  --bkg-height: 0.25rem;       /* Thinnest default background track height (4px) */
  --control-height: 1.125rem;  /* Control button height (18px) */
  --control-width: 0.1rem;     /* Control button width reduced */
  --slider-height: 2rem;       /* Total height of component */
  --border-radius-factor: 0.1rem;

  width: 100%;
  height: var(--slider-height);
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  outline: none;
  touch-action: none;
  user-select: none;
}

/* 1. XS - Thinnest variant (Application Default) */
.m3-slider--xs {
  --bkg-height: 0.25rem;
  --control-height: 1.125rem;
  --control-width: 0.1rem;
  --slider-height: 2rem;
  --border-radius-factor: 0.1rem;
}

/* 2. S - Small variant */
.m3-slider--s {
  --bkg-height: 0.5rem;
  --control-height: 1.5rem;
  --control-width: 0.12rem;
  --slider-height: 2.2rem;
  --border-radius-factor: 0.2rem;
}

/* 3. M - Medium variant (matches CSS example specifications) */
.m3-slider--m {
  --bkg-height: 1rem;
  --control-height: 2.2rem;
  --control-width: 0.15rem;
  --slider-height: 2.6rem;
  --border-radius-factor: 0.4rem;
}

/* 4. L - Large variant */
.m3-slider--l {
  --bkg-height: 1.6rem;
  --control-height: 2.8rem;
  --control-width: 0.18rem;
  --slider-height: 3.2rem;
  --border-radius-factor: 0.6rem;
}

/* 5. XL - Extra Large variant */
.m3-slider--xl {
  --bkg-height: 2.5rem;
  --control-height: 3.8rem;
  --control-width: 0.24rem;
  --slider-height: 4.2rem;
  --border-radius-factor: 0.8rem;
}

/* Active background track (Left) */
.active-bkg {
  width: calc(var(--active-width) - (var(--control-width) / 2));
  height: var(--bkg-height);
  background-color: var(--active-color);
  border-radius: calc(var(--border-radius-factor) * 2) var(--border-radius-factor) var(--border-radius-factor) calc(var(--border-radius-factor) * 2);
  transition: width 0.05s linear;
}

/* Center thumb/control handle */
.control-btn {
  width: var(--control-width);
  height: var(--control-height);
  z-index: 2;
  margin: 0 0.25rem;
  background-color: var(--active-color);
  border-radius: 9999px;
  cursor: grab;

  transition: height 0.15s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s, transform 0.15s cubic-bezier(0.2, 0, 0, 1);
}

/* Hover effect on slider container scales control button slightly */
.m3-slider-btn:hover .control-btn {
  transform: scaleY(1.);
}

/* Active or dragging state increases thumb height/thickness slightly and adds subtle shadow */
.control-btn.grabbing,
.m3-slider-btn:active .control-btn {
  height: calc(var(--control-height) + (var(--bkg-height) * 0.4));
  cursor: grabbing;
  transform: scaleY(1.1) scaleX(1.1);
}

/* Unactive background track (Right) */
.unactive-bkg {
  flex-grow: 1;
  width: calc(100% - var(--active-width) - (var(--control-width) / 2));
  height: var(--bkg-height);
  background-color: var(--bkg-color);
  border-radius: var(--border-radius-factor) calc(var(--border-radius-factor) * 2) calc(var(--border-radius-factor) * 2) var(--border-radius-factor);
  transition: width 0.05s linear;
}

/* Decorate Dots Left/Right */
.decorate-dot-left {
  width: 0.15rem;
  height: 0.15rem;
  background-color: var(--bkg-color);
  border-radius: 100%;
  position: absolute;
  top: 50%;
  left: 0.25rem;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.8;
  z-index: 1;
}

.decorate-dot-right {
  width: 0.15rem;
  height: 0.15rem;
  background-color: var(--active-color);
  border-radius: 100%;
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.8;
  z-index: 1;
}

/* Hide dots if active width is extremely close to either end */
.m3-slider-btn[style*="--active-width: 0%"] .decorate-dot-left,
.m3-slider-btn[style*="--active-width: 1%"] .decorate-dot-left,
.m3-slider-btn[style*="--active-width: 2%"] .decorate-dot-left {
  display: none;
}

.m3-slider-btn[style*="--active-width: 98%"] .decorate-dot-right,
.m3-slider-btn[style*="--active-width: 99%"] .decorate-dot-right,
.m3-slider-btn[style*="--active-width: 100%"] .decorate-dot-right {
  display: none;
}
</style>
