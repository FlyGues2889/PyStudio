<script setup lang="ts">
import MD3Input from './MD3Input.vue';

const model = defineModel<string>({ default: '' });

defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <MD3Input
    v-model="model"
    icon="search"
    :placeholder="placeholder"
  />
</template>
