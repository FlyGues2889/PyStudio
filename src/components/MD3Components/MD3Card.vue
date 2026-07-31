<script setup lang="ts">
interface Props {
  variant?: 'elevated' | 'filled' | 'outlined' | 'transparent';
  noPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'outlined',
  noPadding: false,
});
</script>

<template>
  <div class="m3-card" :class="[`card--${variant}`, { 'card--no-padding': noPadding }]">
    <slot></slot>
  </div>
</template>

<style scoped>
.m3-card {
  display: flex;
  flex-direction: column;
  transition: background-color var(--transition-normal, 0.3s), 
              border-color var(--transition-normal, 0.3s), 
              box-shadow var(--transition-normal, 0.3s);
  border-radius: 28px;
  overflow: hidden;
  box-sizing: border-box;
}

/* Padding variants */
.m3-card:not(.card--no-padding) {
  padding: 1.5rem;
}

/* Material 3 Card Variants */
.card--elevated {
  background-color: var(--surface-color);
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
  border: none;
}

.card--filled {
  background-color: var(--surface-variant);
  border: none;
}

.card--outlined {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
}

.card--transparent {
  background-color: transparent;
  border: none;
  box-shadow: none;
}
</style>
