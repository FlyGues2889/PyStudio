<script setup lang="ts">
import MD3Loading from './MD3Loading.vue';

interface Props {
  show: boolean;
}

defineProps<Props>();
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="m3-loading-modal-overlay" role="dialog" aria-modal="true">
      <MD3Loading variant="contained" size="48" />
    </div>
  </Transition>
</template>

<style scoped>
.m3-loading-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--surface-color, #ffffff);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30000;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

