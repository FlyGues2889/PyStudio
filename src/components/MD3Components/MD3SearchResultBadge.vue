<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    current?: number;
    total?: number;
    hasQuery?: boolean;
    noMatchText?: string;
  }>(),
  {
    current: 0,
    total: 0,
    hasQuery: false,
    noMatchText: '无结果'
  }
);

const badgeText = computed(() => {
  if (!props.hasQuery) return '';
  if (props.total > 0) {
    return `${props.current}/${props.total}`;
  }
  return props.noMatchText;
});

const isNoMatch = computed(() => {
  return props.hasQuery && props.total === 0;
});
</script>

<template>
  <span
    v-if="badgeText"
    class="md3-search-badge"
    :class="{ 'is-no-match': isNoMatch }"
  >
    {{ badgeText }}
  </span>
</template>

<style scoped>
.md3-search-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--md-sys-color-on-secondary-container, var(--on-secondary-container, #1d192b));
  background-color: var(--md-sys-color-secondary-container, var(--secondary-container, #e8def8));
  padding: 2px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  user-select: none;
  transition: all 0.15s ease;
}

.md3-search-badge.is-no-match {
  color: var(--md-sys-color-on-error-container, var(--on-error-container, #410002));
  background-color: var(--md-sys-color-error-container, var(--error-container, #ffdad6));
}
</style>
