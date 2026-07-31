<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TutorialTree from './TutorialTree.vue';
import TutorialContent from './TutorialContent.vue';
import { type TutorialTopic } from './tutorialData';
import { currentLanguage } from '../../utils/i18n';
import { getLocalizedTutorialStages } from '../../i18n/tutorialI18n';
import { safeStorage } from '../../utils/storage';

const props = defineProps<{
  activeTopicIdProp?: string;
}>();

const emit = defineEmits<{
  (e: 'load-code-to-editor', payload: { code: string; topicId: string; topicTitle: string }): void;
  (e: 'contextmenu-tutorial', event: MouseEvent): void;
  (e: 'update-active-topic', topicId: string): void;
}>();

const savedTopicId = safeStorage.getItem('pystudio_last_tutorial_topic');
const activeTopicId = ref(props.activeTopicIdProp || savedTopicId || 'p1_home');
const isTreeCollapsed = ref(false);

watch(() => props.activeTopicIdProp, (newVal) => {
  if (newVal) {
    activeTopicId.value = newVal;
  }
});

watch(activeTopicId, (newTopicId) => {
  if (newTopicId) {
    safeStorage.setItem('pystudio_last_tutorial_topic', newTopicId);
  }
});

const localizedStages = computed(() => getLocalizedTutorialStages(currentLanguage.value));

const allTopics = computed(() => {
  const topics: TutorialTopic[] = [];
  for (const stage of localizedStages.value) {
    if (stage.topics) {
      topics.push(...stage.topics);
    }
    if (stage.subcategories) {
      for (const sub of stage.subcategories) {
        if (sub.topics) {
          topics.push(...sub.topics);
        }
      }
    }
  }
  return topics;
});

const currentTopic = computed<TutorialTopic>(() => {
  const found = allTopics.value.find(t => t.id === activeTopicId.value);
  if (found) return found;
  return allTopics.value[0];
});

const handleSelectTopic = (topicId: string) => {
  activeTopicId.value = topicId;
  isTreeCollapsed.value = false;
  safeStorage.setItem('pystudio_last_tutorial_topic', topicId);
  emit('update-active-topic', topicId);
};

const handleLoadCode = (payload: { code: string; topicId: string; topicTitle: string }) => {
  emit('load-code-to-editor', payload);
};
</script>

<template>
  <div class="tutorial-main-view">
    <!-- Left Tree Navigation -->
    <TutorialTree
      :active-topic-id="activeTopicId"
      :collapsed="isTreeCollapsed"
      @select-topic="handleSelectTopic"
      @toggle-collapse="isTreeCollapsed = !isTreeCollapsed"
    />

    <!-- Right Tutorial Article Content -->
    <TutorialContent
      :topic="currentTopic"
      @select-topic="handleSelectTopic"
      @load-code-to-editor="handleLoadCode"
      @contextmenu-tutorial="e => emit('contextmenu-tutorial', e)"
    />
  </div>
</template>

<style scoped>
.tutorial-main-view {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
}
</style>
