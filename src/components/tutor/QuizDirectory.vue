<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getTopicQuizScore, type QuizScore } from './quizData';
import { getLocalizedTutorialStages, type TutorialStage, type TutorialTopic } from './tutorialData';
import MD3IconButton from '../MD3Components/MD3IconButton.vue';
import TutorialFormattedText from './TutorialFormattedText.vue';

const props = defineProps<{
  activeTopicId?: string;
}>();

const emit = defineEmits<{
  (e: 'open-quiz', topicId: string): void;
  (e: 'back-to-tutorial'): void;
}>();

const stages = computed(() => getLocalizedTutorialStages());
const refreshTick = ref(0);

watch(
  () => props.activeTopicId,
  () => {
    refreshTick.value++;
  },
  { immediate: true }
);

const getScore = (topicId: string): QuizScore => {
  void refreshTick.value;
  return getTopicQuizScore(topicId);
};

const topicRows = (stage: TutorialStage): TutorialTopic[] => {
  const rows: TutorialTopic[] = [];
  if (stage.topics) rows.push(...stage.topics);
  if (stage.subcategories) {
    for (const sub of stage.subcategories) {
      if (sub.topics) rows.push(...sub.topics);
    }
  }
  return rows;
};
</script>

<template>
  <div class="quiz-directory custom-scrollbar">
    <div class="quiz-dir-wrapper">
      <div class="quiz-dir-header">
        <MD3IconButton
          icon="arrow_back"
          size="S"
          title="返回教程"
          @click="emit('back-to-tutorial')"
        />
        <div>
          <div class="dir-title">测验目录</div>
          <div class="dir-subtitle">每节课后完成测验，巩固所学知识</div>
        </div>
      </div>

      <div class="dir-stages">
        <div v-for="stage in stages" :key="stage.id" class="dir-stage-block">
          <div class="dir-stage-header">
            <span class="material-symbols-rounded-fill dir-stage-icon">folder</span>
            <span class="dir-stage-title">{{ stage.title }}</span>
          </div>

          <div
            v-for="topic in topicRows(stage)"
            :key="topic.id"
            class="dir-topic-row"
            :class="{ 'is-active': activeTopicId === topic.id, 'is-disabled': getScore(topic.id).total === 0 }"
            @click="getScore(topic.id).total > 0 && emit('open-quiz', topic.id)"
          >
            <span class="material-symbols-rounded dir-topic-icon">fact_check</span>
            <span class="dir-topic-title">
              <TutorialFormattedText :text="topic.title" />
            </span>
            <span
              v-if="getScore(topic.id).total === 0"
              class="dir-score-chip chip-none"
            >暂无</span>
            <span
              v-else-if="getScore(topic.id).correct === getScore(topic.id).total && getScore(topic.id).total > 0"
              class="dir-score-chip chip-done"
            >
              <span class="material-symbols-rounded">check_circle</span>
              {{ getScore(topic.id).correct }}/{{ getScore(topic.id).total }}
            </span>
            <span v-else class="dir-score-chip">
              {{ getScore(topic.id).correct }}/{{ getScore(topic.id).total }}
            </span>
            <span class="material-symbols-rounded dir-arrow">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-directory {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-color);
  padding: 32px 48px;
  box-sizing: border-box;
  user-select: text;
}

.quiz-dir-wrapper {
  max-width: 860px;
  margin: 0 auto;
}

.quiz-dir-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.dir-icon {
  font-size: 2rem;
  color: var(--primary);
}

.dir-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text-color);
}

.dir-subtitle {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.dir-stage-block {
  margin-bottom: 20px;
}

.dir-stage-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background-color: var(--surface-variant);
  margin-bottom: 6px;
}

.dir-stage-icon {
  font-size: 1.125rem;
  color: var(--secondary);
}

.dir-stage-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-color);
}

.dir-topic-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  margin-bottom: 4px;
}

.dir-topic-row:hover {
  background-color: var(--surface-variant);
}

.dir-topic-row.is-active {
  background-color: var(--primary-container);
}

.dir-topic-row.is-disabled {
  opacity: 0.5;
  cursor: default;
}

.dir-topic-row.is-disabled:hover {
  background-color: transparent;
}

.dir-topic-icon {
  font-size: 1.125rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.dir-topic-row.is-active .dir-topic-icon {
  color: var(--primary);
}

.dir-topic-title {
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-score-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 9999px;
  padding: 2px 10px;
  flex-shrink: 0;
}

.dir-score-chip .material-symbols-rounded {
  font-size: 0.875rem;
}

.dir-score-chip.chip-done {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border-color: var(--primary);
}

.dir-score-chip.chip-none {
  color: var(--text-tertiary);
}

.dir-arrow {
  font-size: 1.125rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}
</style>
