<script setup lang="ts">
defineProps<{
  tab: string;
  activeTab: string;
  label: string;
  icon: string;
  expanded: boolean;
}>();

defineEmits<{
  (e: 'select', tab: any): void;
}>();
</script>

<template>
  <button
    @click="$emit('select', tab)"
    class="m3-nav-item"
    :class="[
      activeTab === tab ? 'active' : 'inactive',
      expanded ? 'drawer-mode' : 'rail-mode'
    ]"
    :title="!expanded ? label : undefined"
  >
    <!-- Indicator wrapper for the icon (M3 Rail active pill indicator) -->
    <div class="icon-indicator-wrapper">
      <span 
        :class="activeTab === tab ? 'material-symbols-rounded-fill' : 'material-symbols-rounded'" 
        class="nav-icon"
      >
        {{ icon }}
      </span>
    </div>
    <!-- Label text -->
    <span class="nav-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.m3-nav-item {
  display: flex;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  font-family: var(--font-sans), sans-serif;
  user-select: none;
  box-sizing: border-box;
  
  /* Default transitions (fast, no delay - ideal for collapsing and hover) */
  transition: 
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease,
    width 0.2s cubic-bezier(0.2, 0, 0, 1),
    max-width 0.2s cubic-bezier(0.2, 0, 0, 1),
    padding 0.2s cubic-bezier(0.2, 0, 0, 1),
    gap 0.2s cubic-bezier(0.2, 0, 0, 1);
}

/* --- COLLAPSED / RAIL MODE (80px width) --- */
.m3-nav-item.rail-mode {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 3.5rem; /* 56px (Circular) */
  max-width: 3.5rem;
  height: 3.5rem; /* 56px (Matches drawer-mode height) */
  border-radius: 9999px; /* Perfect circle */
  padding: 0;
  gap: 0;
}

.m3-nav-item.rail-mode.active {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.m3-nav-item.rail-mode.inactive:hover {
  background-color: var(--border-color-muted);
  color: var(--text-color);
}

.m3-nav-item.rail-mode .icon-indicator-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
}

/* Explicitly disable shadow and scaling on focus/active in rail mode */
.m3-nav-item.rail-mode:focus,
.m3-nav-item.rail-mode:focus-visible,
.m3-nav-item.rail-mode:active,
.m3-nav-item.rail-mode:focus-within {
  outline: none !important;
  outline-offset: 0 !important;
  box-shadow: none !important;
  transform: none !important;
}

.m3-nav-item.rail-mode:focus .icon-indicator-wrapper,
.m3-nav-item.rail-mode:focus-visible .icon-indicator-wrapper,
.m3-nav-item.rail-mode:active .icon-indicator-wrapper,
.m3-nav-item.rail-mode:focus-within .icon-indicator-wrapper {
  transform: none !important;
  box-shadow: none !important;
}

.m3-nav-item.rail-mode .nav-icon {
  font-size: 1.5rem; /* 24px (M3 standard) */
  transition: color 0.2s;
}

.m3-nav-item.rail-mode.active .nav-icon {
  color: var(--on-secondary-container);
}

.m3-nav-item.rail-mode.inactive .nav-icon {
  color: var(--text-secondary);
}

.m3-nav-item.rail-mode:hover .nav-icon {
  color: var(--text-color);
}

/* Text transitions & states */
.m3-nav-item .nav-label {
  font-size: 1rem; /* 16px as requested */
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Collapsing transitions: fast fade-out, no delay */
  transition: 
    opacity 0.15s ease,
    max-width 0.15s cubic-bezier(0.2, 0, 0, 1);
}

.m3-nav-item.rail-mode .nav-label {
  opacity: 0;
  max-width: 0;
  width: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
}

/* --- EXPANDED / DRAWER MODE (256px / 16rem width) --- */
.m3-nav-item.drawer-mode {
  flex-direction: row;
  align-items: center;
  width: fit-content;
  max-width: 14rem; /* Safe maximum capsule width */
  align-self: flex-start;
  height: 3.5rem; /* 56px height for drawer item */
  padding: 0 1.5rem; /* Balanced horizontal padding for beautiful capsule */
  border-radius: 9999px; /* stadium shape background */
  gap: 0.75rem;
  margin-bottom: 0.25rem;

  /* Overrides for expanding: add 0.1s delay to lag behind sidebar animation */
  transition: 
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease,
    width 0.25s cubic-bezier(0.2, 0, 0, 1) 0.1s,
    max-width 0.25s cubic-bezier(0.2, 0, 0, 1) 0.1s,
    padding 0.25s cubic-bezier(0.2, 0, 0, 1) 0.1s,
    gap 0.25s cubic-bezier(0.2, 0, 0, 1) 0.1s;
}

.m3-nav-item.drawer-mode .icon-indicator-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  transition: color 0.2s;
}

.m3-nav-item.drawer-mode .nav-icon {
  font-size: 1.5rem; /* 24px */
}

.m3-nav-item.drawer-mode.active {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.m3-nav-item.drawer-mode.active .nav-icon {
  color: var(--on-secondary-container);
}

.m3-nav-item.drawer-mode.inactive {
  color: var(--text-secondary);
}

.m3-nav-item.drawer-mode.inactive:hover {
  background-color: var(--border-color-muted);
  color: var(--text-color);
}

.m3-nav-item.drawer-mode .nav-label {
  opacity: 1;
  max-width: 10rem;
  
  /* Expanding transitions: delay opacity slightly more to let width expand first */
  transition: 
    opacity 0.2s ease 0.18s,
    max-width 0.5s cubic-bezier(0.2, 0, 0, 1) 0.05s;
}

.m3-nav-item.drawer-mode.active .nav-label {
  font-weight: 700;
}
</style>
