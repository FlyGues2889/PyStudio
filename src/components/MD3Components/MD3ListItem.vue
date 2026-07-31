<script setup lang="ts">
withDefaults(defineProps<{
  interactive?: boolean;
  divider?: boolean;
}>(), {
  interactive: false,
  divider: false
});
</script>

<template>
  <div 
    class="m3-list-item" 
    :class="{ 
      'm3-list-item-interactive': interactive,
      'has-divider': divider
    }"
  >
    <!-- Leading Element Slot (Icon, Switch, Avatar, etc.) -->
    <div v-if="$slots.leading" class="m3-list-item-leading">
      <slot name="leading" />
    </div>

    <!-- Content Area (Headline + Supporting Text) -->
    <div class="m3-list-item-content">
      <div v-if="$slots.headline" class="m3-list-item-headline">
        <slot name="headline" />
      </div>
      <div v-if="$slots.supporting" class="m3-list-item-supporting">
        <slot name="supporting" />
      </div>
    </div>

    <!-- Trailing Element Slot (Metadata, Switch, Buttons, etc.) -->
    <div v-if="$slots.trailing" class="m3-list-item-trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped>
.m3-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  min-height: 56px;
  background-color: transparent;
  color: var(--text-color);
  font-family: var(--font-sans);
  position: relative;
  transition: background-color var(--transition-fast, 0.2s) ease;
}

/* For 3-line lists with supporting text */
.m3-list-item:has(.m3-list-item-supporting) {
  align-items: center;
  padding: 14px 16px;
}

.m3-list-item-interactive {
  cursor: pointer;
}

.m3-list-item-interactive:hover {
  background-color: rgba(var(--md-sys-color-primary-rgb), 0.04);
}

.m3-list-item-interactive:active {
  background-color: rgba(var(--md-sys-color-primary-rgb), 0.1);
}

.m3-list-item-leading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 24px;
  color: var(--secondary);
}

.m3-list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* Ensures text-truncation can work if applied */
}

.m3-list-item-headline {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--text-color);
}

.m3-list-item-supporting {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--text-secondary);
  margin-top: 2px;
}

.m3-list-item-trailing {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  color: var(--text-secondary);
}

/* Optional divider line style */
.m3-list-item.has-divider::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 1px;
  background-color: var(--border-color-muted);
}
</style>
