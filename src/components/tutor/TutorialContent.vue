<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { type TutorialTopic, getLocalizedTutorialStages, tutorialUI } from './tutorialData';
import { getTopicQuiz } from './quizData';
import { safeStorage } from '../../utils/storage';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import MD3Button from '../MD3Components/MD3Button.vue';
import MD3IconButton from '../MD3Components/MD3IconButton.vue';
import TutorialFormattedText from './TutorialFormattedText.vue';
import MD3FAB from '../MD3Components/MD3FAB.vue';

const props = defineProps<{
  topic: TutorialTopic;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-topic', topicId: string): void;
  (e: 'load-code-to-editor', payload: { code: string; topicId: string; topicTitle: string }): void;
  (e: 'toggle-completed'): void;
  (e: 'open-quiz'): void;
  (e: 'contextmenu-tutorial', event: MouseEvent): void;
}>();

const contentViewRef = ref<HTMLElement | null>(null);
const copiedCode = ref(false);
const ui = tutorialUI;

const hasQuiz = computed(() => !!getTopicQuiz(props.topic.id));

const showBackToTop = ref(false);
const activeTocIdx = ref(0);
const tocCollapsed = ref(false);

const readingTime = computed(() => {
  const text = (props.topic.content.overview || '') +
    props.topic.content.sections.map(s => (s.heading || '') + (s.text || '')).join('');
  return Math.max(1, Math.ceil(text.length / 400));
});

const tocItems = computed(() => {
  return props.topic.content.sections.map((s, idx) => ({
    id: `section-${props.topic.id}-${idx}`,
    title: s.heading,
    idx
  })).filter(s => s.title);
});

const currentProgress = computed(() => {
  const total = allTopics.value.length;
  const current = currentIndex.value + 1;
  return total > 0 ? `${current} / ${total}` : '';
});

const scrollToSection = (idx: number) => {
  const el = document.getElementById(`section-${props.topic.id}-${idx}`);
  if (el && contentViewRef.value) {
    const viewRect = contentViewRef.value.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const targetTop = contentViewRef.value.scrollTop + elRect.top - viewRect.top - 20;
    contentViewRef.value.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  }
};

const scrollToTop = () => {
  contentViewRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
};

const updateActiveToc = () => {
  if (!contentViewRef.value) return;
  const scrollTop = contentViewRef.value.scrollTop;
  showBackToTop.value = scrollTop > 400;
  const items = tocItems.value;
  for (let i = items.length - 1; i >= 0; i--) {
    const el = document.getElementById(items[i].id);
    if (el && el.offsetTop <= scrollTop + 60) {
      activeTocIdx.value = i;
      return;
    }
  }
  activeTocIdx.value = 0;
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target && props.topic?.id) {
    safeStorage.setItem(`python_you_tutorial_scroll_${props.topic.id}`, target.scrollTop.toString());
  }
  updateActiveToc();
};

const restoreOrResetScroll = (isTopicChanged: boolean) => {
  nextTick(() => {
    if (!contentViewRef.value) return;
    if (isTopicChanged) {
      contentViewRef.value.scrollTop = 0;
    } else {
      const saved = safeStorage.getItem(`python_you_tutorial_scroll_${props.topic?.id}`);
      if (saved !== null) {
        contentViewRef.value.scrollTop = parseFloat(saved) || 0;
      } else {
        contentViewRef.value.scrollTop = 0;
      }
    }
  });
};

onMounted(() => {
  restoreOrResetScroll(false);
});

watch(() => props.topic?.id, (newId, oldId) => {
  if (newId !== oldId) {
    restoreOrResetScroll(true);
  }
});

const highlightPython = (code: string) => {
  if (!code) return '';
  try {
    return hljs.highlight(code, { language: 'python' }).value;
  } catch (e) {
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};

const localizedStages = computed(() => getLocalizedTutorialStages());

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

const currentIndex = computed(() => {
  return allTopics.value.findIndex(t => t.id === props.topic.id);
});

const prevTopic = computed(() => {
  if (currentIndex.value > 0) {
    return allTopics.value[currentIndex.value - 1];
  }
  return null;
});

const nextTopic = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < allTopics.value.length - 1) {
    return allTopics.value[currentIndex.value + 1];
  }
  return null;
});

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  copiedCode.value = true;
  setTimeout(() => {
    copiedCode.value = false;
  }, 2000);
};

const openInEditor = (code: string) => {
  emit('load-code-to-editor', {
    code,
    topicId: props.topic.id,
    topicTitle: props.topic.title
  });
};
</script>

<template>
  <div
    ref="contentViewRef"
    class="tutorial-content-view custom-scrollbar"
    @scroll="handleScroll"
    @contextmenu.prevent="emit('contextmenu-tutorial', $event)"
  >
    <div class="content-wrapper">
      <!-- TOC Sidebar -->
      <aside v-if="tocItems.length > 0" class="toc-sidebar custom-scrollbar" :class="{ 'is-collapsed': tocCollapsed }">
        <div class="toc-title">
          <span v-if="!tocCollapsed">目录</span>
          <MD3IconButton
            class="toc-collapse-btn"
            variant="standard"
            size="S"
            :icon="tocCollapsed ? 'menu' : 'menu_open'"
            :title="tocCollapsed ? '展开目录' : '收起目录'"
            @click="tocCollapsed = !tocCollapsed"
          />
        </div>
        <ul v-if="!tocCollapsed" class="toc-list">
          <li
            v-for="item in tocItems"
            :key="item.id"
            :class="{ 'toc-active': activeTocIdx === item.idx }"
            @click="scrollToSection(item.idx)"
          >
            {{ item.title }}
          </li>
        </ul>
      </aside>

      <div class="main-content">
      <!-- Stage Breadcrumb Tag -->
      <div class="breadcrumb-bar">
        <span class="material-symbols-rounded">school</span>
        <span class="stage-tag"><TutorialFormattedText :text="topic.stage" /></span>
        <span class="separator">/</span>
        <span class="topic-tag"><TutorialFormattedText :text="topic.title" /></span>
      </div>

      <!-- Meta Info Bar -->
      <div class="meta-info-bar">
        <span class="meta-item">
          <span class="material-symbols-rounded" style="font-size:16px">schedule</span>
          <span>{{ readingTime }} min read</span>
        </span>
        <span class="meta-separator">·</span>
        <span class="meta-item">
          <span class="material-symbols-rounded" style="font-size:16px">format_list_numbered</span>
          <span>{{ currentProgress }}</span>
        </span>
      </div>

      <!-- Main Article Header -->
      <h1 class="article-title"><TutorialFormattedText :text="topic.title" /></h1>
      <p class="article-summary"><TutorialFormattedText :text="topic.summary" /></p>

      <!-- Overview Box -->
      <div class="overview-box">
        <TutorialFormattedText :text="topic.content.overview" tag="p" />
      </div>

      <!-- Main Runnable Code Example if present -->
      <div v-if="topic.content.codeExample" class="code-example-card">
        <div class="card-header">
          <div class="header-left">
            <span class="material-symbols-rounded">terminal</span>
            <span class="code-title">{{ ui.interactiveExample }}</span>
          </div>
          <div class="header-actions">
            <MD3Button
              variant="tonal"
              size="S"
              :icon="copiedCode ? 'check' : 'content_copy'"
              @click="copyCode(topic.content.codeExample!)"
            >
              {{ copiedCode ? ui.copied : ui.copyCode }}
            </MD3Button>
            <MD3Button
              variant="filled"
              size="S"
              icon="play_arrow"
              :title="ui.clickToRun"
              @click="openInEditor(topic.content.codeExample!)"
            >
              {{ ui.runInIDE }}
            </MD3Button>
          </div>
        </div>
        <pre class="code-block"><code class="hljs" v-html="highlightPython(topic.content.codeExample!)"></code></pre>
      </div>

      <!-- Sections -->
      <div
        v-for="(section, idx) in topic.content.sections"
        :key="idx"
        :id="`section-${topic.id}-${idx}`"
        class="section-block"
      >
        <h2 class="section-heading"><TutorialFormattedText :text="section.heading" /></h2>
        <p class="section-text"><TutorialFormattedText :text="section.text" /></p>

        <!-- Section Table if present -->
        <div v-if="section.table" class="md3-table-wrapper">
          <table class="md3-tutorial-table">
            <thead>
              <tr>
                <th v-for="(header, hIdx) in section.table.headers" :key="hIdx">
                  <TutorialFormattedText :text="header" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rIdx) in section.table.rows" :key="rIdx">
                <td v-for="(cell, cIdx) in row" :key="cIdx">
                  <TutorialFormattedText :text="cell" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section Code -->
        <div v-if="section.code" class="code-example-card sub-card">
          <div class="card-header">
            <span class="code-title">{{ ui.codeSnippet }}</span>
            <MD3Button
              variant="filled"
              size="S"
              icon="play_arrow"
              @click="openInEditor(section.code!)"
            >
              {{ ui.importAndRun }}
            </MD3Button>
          </div>
          <pre class="code-block"><code class="hljs" v-html="highlightPython(section.code!)"></code></pre>
        </div>

        <!-- Section Notes -->
        <div v-if="section.notes" class="notes-callout">
          <span class="material-symbols-rounded callout-icon">info</span>
          <p class="callout-text"><TutorialFormattedText :text="section.notes" /></p>
        </div>
      </div>

      <!-- Tips Box -->
      <div v-if="topic.content.tips && topic.content.tips.length > 0" class="tips-box">
        <div class="tips-header">
          <span class="material-symbols-rounded">lightbulb</span>
          <span>{{ ui.tipsTitle }}</span>
        </div>
        <ul>
          <li v-for="(tip, i) in topic.content.tips" :key="i">
            <TutorialFormattedText :text="tip" />
          </li>
        </ul>
      </div>

      <!-- Key Takeaways -->
      <div v-if="topic.content.takeaways && topic.content.takeaways.length > 0" class="takeaways-box">
        <div class="takeaways-header">
          <span class="material-symbols-rounded">psychology</span>
          <span>核心要点</span>
        </div>
        <ul>
          <li v-for="(item, i) in topic.content.takeaways" :key="i">
            <TutorialFormattedText :text="item" />
          </li>
        </ul>
      </div>

      <!-- Footer Navigation Buttons (Prev / Next) -->
      <div class="completed-bar">
        <button
          class="completed-btn"
          :class="{ 'is-completed': isCompleted }"
          @click="emit('toggle-completed')"
        >
          <span class="material-symbols-rounded">{{ isCompleted ? 'check_circle' : 'radio_button_unchecked' }}</span>
          <span>{{ isCompleted ? '已完成' : '标记为完成' }}</span>
        </button>
        <button
          v-if="hasQuiz"
          class="completed-btn quiz-btn"
          title="完成本节测验"
          @click="emit('open-quiz')"
        >
          <span class="material-symbols-rounded">fact_check</span>
          <span>测验</span>
        </button>
      </div>

      <div class="tutorial-nav-footer">
        <button
          v-if="prevTopic"
          class="nav-page-btn prev-btn"
          @click="emit('select-topic', prevTopic.id)"
        >
          <span class="material-symbols-rounded">arrow_back</span>
          <div class="nav-text-group">
            <span class="nav-direction">{{ ui.previous }}</span>
            <span class="nav-title">{{ prevTopic.title }}</span>
          </div>
        </button>

        <div v-else class="nav-placeholder"></div>

        <button
          v-if="nextTopic"
          class="nav-page-btn next-btn"
          @click="emit('select-topic', nextTopic.id)"
        >
          <div class="nav-text-group right-align">
            <span class="nav-direction">{{ ui.next }}</span>
            <span class="nav-title">{{ nextTopic.title }}</span>
          </div>
          <span class="material-symbols-rounded">arrow_forward</span>
        </button>
      </div>

      <!-- Back to Top (MD3 FAB) -->
      <MD3FAB
        v-show="showBackToTop"
        icon="arrow_upward"
        title="回到顶部"
        position="fixed"
        bottom="24px"
        right="24px"
        size="M"
        variant="secondary"
        @click="scrollToTop"
      >
      </MD3FAB>
    </div>
  </div>
</div>
</template>

<style scoped>
.tutorial-content-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-color);
  padding: 32px 48px;
  box-sizing: border-box;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

.tutorial-content-view *,
.content-wrapper,
.code-block,
.code-block code,
pre,
code {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

button,
.nav-page-btn,
.stage-tag,
.breadcrumb-bar {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.content-wrapper {
  max-width: 860px;
  margin: 0 auto;
}

.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.stage-tag {
  color: var(--primary);
  font-weight: 600;
}

.topic-tag {
  color: var(--text-secondary);
}

.article-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 12px;
  line-height: 1.25;
}

.article-summary {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.overview-box {
  background-color: var(--surface-color);
  border-left: 4px solid var(--primary);
  padding: 16px 20px;
  border-radius: 0 12px 12px 0;
  margin-bottom: 28px;
  font-size: 0.9375rem;
  color: var(--text-color);
  line-height: 1.7;
}

.section-block {
  margin-bottom: 36px;
  padding-top: 20px;
}

.section-heading {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
}

.section-text {
  font-size: 0.9375rem;
  color: var(--text-color);
  line-height: 1.7;
  white-space: pre-line;
  margin-bottom: 16px;
}

.code-example-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.code-example-card.sub-card {
  margin-top: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ccc;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

pre,
pre.code-block,
.code-block {
  margin: 0;
  padding: 0 !important;
}

.code-block code,
pre code {
  margin: 0;
  padding: 16px;
  font-family: var(--font-mono) !important;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #d4d4d4;
  overflow-x: auto;
  white-space: pre;
  display: block;
}

.notes-callout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 12px;
}

.callout-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.tips-box {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 36px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}

.tips-box ul {
  margin: 0;
  padding-left: 20px;
}

.tips-box li {
  font-size: 0.875rem;
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 6px;
}

.tutorial-nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid var(--border-color-muted);
  margin-bottom: 48px;
}

.nav-page-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.15s;
  max-width: 45%;
  text-align: left;
}

.nav-page-btn:hover {
  background-color: var(--secondary-container);
  border-color: var(--secondary);
  color: var(--on-secondary-container);
}

.nav-text-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.nav-text-group.right-align {
  align-items: flex-end;
  text-align: right;
}

.nav-direction {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.nav-title {
  font-size: 0.875rem;
  font-weight: 700;
}

.nav-placeholder {
  flex: 1;
}

/* MD3 Styled Table Components for Tutorials */
.md3-table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 16px 0 24px 0;
  border: 1px solid var(--border-color-muted);
  border-radius: 12px;
  background-color: var(--surface-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.md3-tutorial-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.md3-tutorial-table th {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  font-weight: 700;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color-muted);
  white-space: nowrap;
}

.md3-tutorial-table td {
  padding: 10px 16px;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color-muted);
  line-height: 1.5;
}

.md3-tutorial-table tr:last-child td {
  border-bottom: none;
}

.md3-tutorial-table tr:hover td {
  background-color: var(--surface-variant);
}

/* --- TOC Sidebar --- */
.content-wrapper {
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.toc-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color-muted);
}

.toc-collapse-btn {
  margin-left: auto;
}

.toc-sidebar.is-collapsed {
  width: 48px;
  padding: 8px;
}

.toc-sidebar.is-collapsed .toc-title {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
  justify-content: center;
}

.toc-sidebar.is-collapsed .toc-collapse-btn {
  margin-left: 0;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.4;
  margin-bottom: 2px;
}

.toc-list li:hover {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.toc-list li.toc-active {
  background-color: var(--secondary-container);
  color: var(--on-primary-container);
  font-weight: 600;
}

/* --- Meta Info Bar --- */
.meta-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-separator {
  opacity: 0.5;
}

/* Responsive: hide TOC on narrow screens */
@media (max-width: 1100px) {
  .toc-sidebar {
    display: none;
  }
}

/* --- Completed Bar --- */
.completed-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.completed-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 9999px;
  border: 2px solid var(--border-color-muted);
  background-color: var(--surface-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.completed-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.completed-btn.quiz-btn {
  border-color: var(--secondary);
  color: var(--secondary);
}

.completed-btn.quiz-btn:hover {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.completed-btn.is-completed {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border-color: var(--primary);
}

/* --- Takeaways Box --- */
.takeaways-box {
  background-color: var(--primary-container);
  border: 1px solid var(--primary);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 36px;
}

.takeaways-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--on-primary-container);
  margin-bottom: 12px;
}

.takeaways-box ul {
  margin: 0;
  padding-left: 20px;
}

.takeaways-box li {
  font-size: 0.875rem;
  color: var(--on-primary-container);
  line-height: 1.6;
  margin-bottom: 6px;
}
</style>
