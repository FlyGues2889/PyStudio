<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { type TutorialStage, type TutorialTopic } from './tutorialData';
import { currentLanguage } from '../../utils/i18n';
import { getLocalizedTutorialStages, tutorialUI } from '../../i18n/tutorialI18n';
import MD3Input from '../MD3Components/MD3Input.vue';

const props = defineProps<{
  activeTopicId: string;
  collapsed?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-topic', topicId: string): void;
  (e: 'toggle-collapse'): void;
}>();

const ui = computed(() => tutorialUI[currentLanguage.value] || tutorialUI.zh);
const stages = computed(() => getLocalizedTutorialStages(currentLanguage.value));

const searchQuery = ref('');

// State for expanded stages and subcategories
const expandedStages = ref<Record<string, boolean>>({
  stage1: true,
  stage2: true,
  stage3: false,
  stage4: false,
  stage5: false,
  stage6: false,
  cmd_help: true,
});

const expandedSubs = ref<Record<string, boolean>>({
  matplotlib_sub: true,
  cli_sub: true,
  modules_sub: true,
  builtins_sub: true,
  keywords_sub: true
});

const toggleStage = (stageId: string) => {
  expandedStages.value[stageId] = !expandedStages.value[stageId];
};

const toggleSub = (subId: string) => {
  expandedSubs.value[subId] = !expandedSubs.value[subId];
};

// Locate active topic in catalog
const scrollToActiveTopic = () => {
  if (!props.activeTopicId) return;

  // Ensure stage and subcategory containing activeTopicId are expanded
  for (const stage of stages.value) {
    if (stage.topics?.some(t => t.id === props.activeTopicId)) {
      expandedStages.value[stage.id] = true;
    }
    if (stage.subcategories) {
      for (const sub of stage.subcategories) {
        if (sub.topics?.some(t => t.id === props.activeTopicId)) {
          expandedStages.value[stage.id] = true;
          expandedSubs.value[sub.id] = true;
        }
      }
    }
  }

  nextTick(() => {
    setTimeout(() => {
      const activeEl = document.querySelector('.tutorial-tree-container .topic-item.is-active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
  });
};

watch(
  () => props.activeTopicId,
  (newId) => {
    if (newId) {
      scrollToActiveTopic();
    }
  },
  { immediate: true }
);

watch(
  () => props.collapsed,
  (isCollapsed) => {
    if (!isCollapsed) {
      scrollToActiveTopic();
    }
  }
);

// Search filter logic
const filteredStages = computed(() => {
  if (!searchQuery.value.trim()) {
    return stages.value;
  }
  const q = searchQuery.value.toLowerCase().trim();

  return stages.value.map(stage => {
    let matchedTopics: TutorialTopic[] = [];
    if (stage.topics) {
      matchedTopics = stage.topics.filter(
        t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
      );
    }

    let matchedSubs: { id: string; title: string; topics: TutorialTopic[] }[] = [];
    if (stage.subcategories) {
      matchedSubs = stage.subcategories.map(sub => ({
        ...sub,
        topics: sub.topics.filter(
          t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
        )
      })).filter(sub => sub.topics.length > 0 || sub.title.toLowerCase().includes(q));
    }

    const stageTitleMatches = stage.title.toLowerCase().includes(q);

    if (stageTitleMatches || matchedTopics.length > 0 || matchedSubs.length > 0) {
      return {
        ...stage,
        topics: stageTitleMatches ? stage.topics : matchedTopics,
        subcategories: stageTitleMatches ? stage.subcategories : matchedSubs
      };
    }
    return null;
  }).filter(Boolean) as TutorialStage[];
});
</script>

<template>
  <div class="tutorial-tree-container" :class="{ 'is-collapsed': collapsed }">
    <!-- Collapse Toggle Button -->
    <button
      class="tree-collapse-toggle"
      :title="collapsed ? ui.expandCatalog : ui.collapseCatalog"
      @click="emit('toggle-collapse')"
    >
      <span class="material-symbols-rounded">
        {{ collapsed ? 'arrow_menu_open' : 'arrow_menu_close' }}
      </span>
    </button>

    <div v-if="!collapsed" class="tree-content">
      <!-- Header -->
      <div class="tree-header">
        <div class="tree-title-group">
          <span class="material-symbols-rounded header-icon">menu_book</span>
          <span class="tree-title">{{ ui.tutorialCatalog }}</span>
        </div>
      </div>

      <!-- Search Input -->
      <div class="search-box">
        <MD3Input
          v-model="searchQuery"
          icon="search"
          :placeholder="ui.searchPlaceholder"
        />
        <button
          v-if="searchQuery"
          class="clear-search-btn"
          @click="searchQuery = ''"
        >
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>

      <!-- Tree Items List -->
      <div class="tree-nodes-list custom-scrollbar">
        <div
          v-for="stage in filteredStages"
          :key="stage.id"
          class="stage-block"
        >
          <!-- Stage Header Folder -->
          <div
            class="stage-header-item"
            @click="toggleStage(stage.id)"
          >
            <span
              class="material-symbols-rounded folder-arrow"
              :class="{ 'is-open': expandedStages[stage.id] || searchQuery }"
            >
              chevron_right
            </span>
            <span class="material-symbols-rounded-fill folder-icon">folder</span>
            <span class="stage-title-text">{{ stage.title }}</span>
          </div>

          <!-- Stage Level Topics -->
          <Transition name="expand">
            <div
              v-if="(expandedStages[stage.id] || searchQuery) && stage.topics"
              class="topic-group"
            >
              <div
                v-for="topic in stage.topics"
                :key="topic.id"
                class="topic-item"
                :class="{ 'is-active': activeTopicId === topic.id }"
                @click="emit('select-topic', topic.id)"
              >
                <span
                  :class="[
                    activeTopicId === topic.id ? 'material-symbols-rounded-fill' : 'material-symbols-rounded',
                    'topic-icon'
                  ]"
                >
                  article
                </span>
                <span class="topic-title-text">{{ topic.title }}</span>
              </div>
            </div>
          </Transition>

          <!-- Subcategories (e.g. Matplotlib) -->
          <Transition name="expand">
            <div
              v-if="(expandedStages[stage.id] || searchQuery) && stage.subcategories"
              class="subcat-group"
            >
              <div
                v-for="sub in stage.subcategories"
                :key="sub.id"
                class="subcat-block"
              >
                <div
                  class="subcat-header-item"
                  @click="toggleSub(sub.id)"
                >
                  <span
                    class="material-symbols-rounded folder-arrow"
                    :class="{ 'is-open': expandedSubs[sub.id] || searchQuery }"
                  >
                    chevron_right
                  </span>
                  <span class="material-symbols-rounded-fill folder-icon">folder_special</span>
                  <span class="subcat-title-text">{{ sub.title }}</span>
                </div>

                <Transition name="expand">
                  <div
                    v-if="(expandedSubs[sub.id] || searchQuery) && sub.topics"
                    class="topic-group indented"
                  >
                    <div
                      v-for="topic in sub.topics"
                      :key="topic.id"
                      class="topic-item"
                      :class="{ 'is-active': activeTopicId === topic.id }"
                      @click="emit('select-topic', topic.id)"
                    >
                      <span
                        :class="[
                          activeTopicId === topic.id ? 'material-symbols-rounded-fill' : 'material-symbols-rounded',
                          'topic-icon'
                        ]"
                      >
                        article
                      </span>
                      <span class="topic-title-text">{{ topic.title }}</span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>

        <div v-if="filteredStages.length === 0" class="empty-search-notice">
          未找到匹配的教程内容
        </div>
      </div>

      <!-- MD3 Small Floating Action Button (Locate current topic) -->
      <button
        class="fab-locate-btn"
        title="定位当前课程在目录中的位置"
        @click="scrollToActiveTopic"
      >
        <span class="material-symbols-rounded">my_location</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tutorial-tree-container {
  width: 280px;
  min-width: 280px;
  height: 100%;
  background-color: var(--surface-color);
  border-right: 1px solid var(--border-color-muted);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.2s ease, min-width 0.2s ease;
  user-select: none;
}

.tutorial-tree-container.is-collapsed {
  width: 0;
  min-width: 0;
  border-right: none;
}

.tree-collapse-toggle {
  position: absolute;
  right: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 36px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color-muted);
  border-left: none;
  border-radius: 0 1rem 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-tertiary);
  z-index: 20;
  box-shadow: none;
  transition: background-color 0.15s, color 0.15s;
}

.tree-collapse-toggle:hover {
  background-color: var(--secondary-container);
  color: var(--primary);
}

.tree-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.tree-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: none;
}

.tree-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
}

.header-icon {
  font-size: 1.25rem;
}

.tree-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-color);
}

.search-box {
  padding: 4px 12px 8px 12px;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: none;
}

.clear-search-btn {
  position: absolute;
  right: 18px;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.tree-nodes-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 4px;
}

.stage-block {
  margin-bottom: 4px;
}

.stage-header-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  min-width: 0;
  white-space: nowrap;
}

.stage-header-item:hover {
  background-color: var(--surface-variant);
}

.folder-arrow {
  font-size: 1.125rem;
  color: var(--text-tertiary);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.folder-arrow.is-open {
  transform: rotate(90deg);
}

/* Folder expand/collapse transition animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 800px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
  overflow: hidden;
}

.folder-icon {
  font-size: 1.125rem;
  color: var(--secondary);
  flex-shrink: 0;
}

.stage-title-text {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-color);
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.subcat-header-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px 5px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  min-width: 0;
  white-space: nowrap;
}

.subcat-header-item:hover {
  background-color: var(--surface-variant);
}

.subcat-title-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.topic-group {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}

.topic-group.indented {
  padding-left: 32px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  transition: all 0.15s;
  margin: 1px 0;
  border: 1px solid transparent;
  min-width: 0;
  white-space: nowrap;
}

.topic-item:hover {
  background-color: var(--surface-variant);
  color: var(--text-color);
}

.topic-item.is-active {
  background-color: transparent;
  color: var(--text-color);
  font-weight: 600;
  border: 1px solid var(--md-sys-color-secondary, var(--secondary, #625b71));
  border-radius: 9999px;
}

.topic-icon {
  font-size: 1rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.topic-item.is-active .topic-icon {
  color: var(--md-sys-color-secondary, var(--secondary, #625b71));
}

.topic-title-text {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.empty-search-notice {
  padding: 24px;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.fab-locate-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  z-index: 10;
}

.fab-locate-btn:hover {
  transform: translateY(-2px);
  background-color: var(--secondary);
  color: var(--on-secondary);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

.fab-locate-btn:active {
  transform: scale(0.95);
}
</style>
