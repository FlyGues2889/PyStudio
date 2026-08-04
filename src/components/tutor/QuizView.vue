<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  getTopicQuiz,
  getQuizQuestionResult,
  getTopicQuizScore,
  loadQuizResults,
  saveQuizResults,
  setQuizQuestionResult,
  syncQuizCompletion,
  getQuizAnswers,
  setQuizAnswer,
  clearQuizAnswers,
  type QuizQuestion
} from './quizData';
import { getAllTutorialTopics, type TutorialTopic } from './tutorialData';
import TutorialFormattedText from './TutorialFormattedText.vue';
import MD3Button from '../MD3Components/MD3Button.vue';
import MD3IconButton from '../MD3Components/MD3IconButton.vue';

const props = defineProps<{
  topicId: string;
}>();

const emit = defineEmits<{
  (e: 'back-to-tutorial'): void;
  (e: 'load-code-to-editor', payload: { code: string; topicId: string; topicTitle: string; isQuiz: boolean; questionId: string; expectedOutput: string }): void;
  (e: 'results-changed'): void;
}>();

const topic = computed<TutorialTopic | undefined>(() =>
  getAllTutorialTopics().find(t => t.id === props.topicId)
);

const quiz = computed(() => getTopicQuiz(props.topicId));

const choiceQuestions = computed(() =>
  (quiz.value?.questions.filter(q => q.type === 'choice') || []) as QuizQuestion[]
);

const codeQuestions = computed(() =>
  (quiz.value?.questions.filter(q => q.type === 'code') || []) as QuizQuestion[]
);

const answers = ref<Record<string, number>>({});
const submitted = ref(false);
const refreshTick = ref(0);

const syncSubmitted = () => {
  submitted.value = choiceQuestions.value.some(q => getQuizQuestionResult(props.topicId, q.id));
};

watch(
  () => props.topicId,
  () => {
    answers.value = getQuizAnswers(props.topicId);
    refreshTick.value++;
    syncSubmitted();
    syncQuizCompletion(props.topicId);
  },
  { immediate: true }
);

const score = computed(() => {
  void refreshTick.value;
  return getTopicQuizScore(props.topicId);
});

const answeredCount = computed(() =>
  choiceQuestions.value.filter(q => answers.value[q.id] !== undefined).length
);

const selectAnswer = (questionId: string, optionIndex: number) => {
  if (submitted.value) return;
  answers.value[questionId] = optionIndex;
  setQuizAnswer(props.topicId, questionId, optionIndex);
};

const submitChoice = () => {
  submitted.value = true;
  for (const q of choiceQuestions.value) {
    const chosen = answers.value[q.id];
    const pass = chosen !== undefined && chosen === q.answerIndex;
    setQuizQuestionResult(props.topicId, q.id, pass ? 'pass' : 'fail');
  }
  syncQuizCompletion(props.topicId);
  refreshTick.value++;
  emit('results-changed');
};

const resetQuiz = () => {
  const results = loadQuizResults();
  delete results[props.topicId];
  saveQuizResults(results);
  clearQuizAnswers(props.topicId);
  answers.value = {};
  submitted.value = false;
  refreshTick.value++;
  emit('results-changed');
};

const loadToEditor = (q: QuizQuestion) => {
  if (q.type !== 'code') return;
  emit('load-code-to-editor', {
    code: q.starterCode,
    topicId: props.topicId,
    topicTitle: topic.value?.title || '',
    isQuiz: true,
    questionId: q.id,
    expectedOutput: q.expectedOutput
  });
};

const getCodeStatus = (q: QuizQuestion): 'pass' | 'fail' | null =>
  getQuizQuestionResult(props.topicId, q.id);

const isChoicePass = (q: QuizQuestion) =>
  getQuizQuestionResult(props.topicId, q.id) === 'pass';
</script>

<template>
  <div class="quiz-view custom-scrollbar">
    <div class="quiz-wrapper">
      <div class="quiz-header">
        <MD3IconButton
          icon="arrow_back"
          size="S"
          title="返回教程"
          @click="emit('back-to-tutorial')"
        />
        <div class="quiz-title-group">
          <div>
            <div class="quiz-title">课后测验</div>
            <div class="quiz-topic-title">
              <TutorialFormattedText :text="topic?.title || topicId" />
            </div>
          </div>
        </div>
        <div class="quiz-score-badge" :class="{ 'is-done': score.correct > 0 && score.correct === score.total }">
          <span class="material-symbols-rounded">scoreboard</span>
          <span>答对 {{ score.correct }} / {{ score.total }}</span>
        </div>
      </div>

      <div v-if="!quiz || quiz.questions.length === 0" class="quiz-empty">
        该章节暂无测验题目。
      </div>

      <template v-else>
        <!-- 选择题 -->
        <div
          v-for="(q, qi) in choiceQuestions"
          :key="q.id"
          class="quiz-question-card"
        >
          <div class="question-label">
            <span class="q-index">第 {{ qi + 1 }} 题</span>
            <span class="q-type-chip">选择题</span>
            <span v-if="submitted" class="q-result-chip" :class="isChoicePass(q) ? 'chip-pass' : 'chip-fail'">
              {{ isChoicePass(q) ? '回答正确' : '回答错误' }}
            </span>
          </div>
          <p class="question-text"><TutorialFormattedText :text="q.question" /></p>
          <div class="option-list">
            <button
              v-for="(opt, oi) in q.options"
              :key="oi"
              class="option-item"
              :class="{
                'is-selected': answers[q.id] === oi,
                'is-correct': submitted && oi === q.answerIndex,
                'is-wrong': submitted && answers[q.id] === oi && oi !== q.answerIndex,
                'is-locked': submitted
              }"
              @click="selectAnswer(q.id, oi)"
            >
              <span class="option-mark material-symbols-rounded">
                {{
                  submitted && oi === q.answerIndex
                    ? 'check_circle'
                    : submitted && answers[q.id] === oi
                      ? 'cancel'
                      : answers[q.id] === oi
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked'
                }}
              </span>
              <span class="option-text"><TutorialFormattedText :text="opt" /></span>
            </button>
          </div>
          <div v-if="submitted && q.explanation" class="explanation-box">
            <span class="material-symbols-rounded">lightbulb</span>
            <span><TutorialFormattedText :text="q.explanation" /></span>
          </div>
        </div>

        <!-- 代码题 -->
        <div
          v-for="(q, qi) in codeQuestions"
          :key="q.id"
          class="quiz-question-card"
        >
          <div class="question-label">
            <span class="q-index">第 {{ choiceQuestions.length + qi + 1 }} 题</span>
            <span class="q-type-chip chip-code">代码题</span>
            <span v-if="getCodeStatus(q)" class="q-result-chip" :class="getCodeStatus(q) === 'pass' ? 'chip-pass' : 'chip-fail'">
              {{ getCodeStatus(q) === 'pass' ? '已通过' : '未通过' }}
            </span>
            <span v-else class="q-result-chip chip-pending">未作答</span>
          </div>
          <p class="question-text"><TutorialFormattedText :text="q.question" /></p>
          <div class="code-question-block">
            <pre class="code-preview"><code>{{ q.starterCode }}</code></pre>
            <div class="code-question-actions">
              <MD3Button
                variant="filled"
                size="S"
                icon="open_in_new"
                @click="loadToEditor(q)"
              >
                放入编辑器作答
              </MD3Button>
              <span class="code-action-hint">在编辑器窗口中修改代码，点击右下角「检查答案」校验输出</span>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="quiz-actions">
          <MD3Button
            variant="filled"
            icon="task_alt"
            :disabled="submitted"
            @click="submitChoice"
          >
            {{ submitted ? '选择题已提交' : `提交测验（已选 ${answeredCount}/${choiceQuestions.length}）` }}
          </MD3Button>
          <MD3Button
            variant="tonal"
            icon="restart_alt"
            @click="resetQuiz"
          >
            重新测验
          </MD3Button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.quiz-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-color);
  padding: 32px 48px;
  box-sizing: border-box;
  user-select: text;
}

.quiz-wrapper {
  max-width: 860px;
  margin: 0 auto;
}

.quiz-header {
  position: sticky;
  top: -32px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0 16px;
  background-color: var(--bg-color);
}

.quiz-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.quiz-header-icon {
  font-size: 1.75rem;
  color: var(--primary);
}

.quiz-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 1px;
}

.quiz-topic-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-color);
  line-height: 1.3;
}

.quiz-score-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background-color: var(--surface-variant);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
}

.quiz-score-badge.is-done {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.quiz-empty {
  padding: 48px;
  text-align: center;
  color: var(--text-tertiary);
}

.quiz-question-card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.question-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.q-index {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
}

.q-type-chip {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.q-type-chip.chip-code {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.q-result-chip {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 9999px;
}

.chip-pass {
  background-color: color-mix(in srgb, #2e7d32 14%, transparent);
  color: #2e7d32;
}

.chip-fail {
  background-color: color-mix(in srgb, var(--error, #ba1a1a) 12%, transparent);
  color: var(--error, #ba1a1a);
}

.chip-pending {
  background-color: var(--surface-variant);
  color: var(--text-tertiary);
}

.question-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 14px;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-color-muted);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.option-item:hover:not(.is-locked) {
  border-color: var(--primary);
  background-color: var(--surface-variant);
}

.option-item.is-selected {
  border-color: var(--primary);
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.option-item.is-correct {
  border-color: #2e7d32;
  background-color: color-mix(in srgb, #2e7d32 12%, var(--surface-color));
  color: #1b5e20;
}

.option-item.is-wrong {
  border-color: var(--error, #ba1a1a);
  background-color: color-mix(in srgb, var(--error, #ba1a1a) 10%, var(--surface-color));
  color: var(--error, #ba1a1a);
}

.option-item.is-locked {
  cursor: default;
}

.option-mark {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  min-width: 0;
}

.explanation-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  background-color: var(--surface-variant);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.explanation-box .material-symbols-rounded {
  font-size: 1rem;
  color: var(--secondary);
  flex-shrink: 0;
  margin-top: 1px;
}

.code-question-block {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color-muted);
}

.code-preview {
  margin: 0;
  padding: 14px 16px;
  background-color: #1e1e2e;
  color: #cdd6f4;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.55;
  overflow-x: auto;
  white-space: pre;
  user-select: text;
}

.code-question-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background-color: var(--surface-variant);
}

.code-action-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.quiz-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
</style>
