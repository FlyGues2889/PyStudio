export interface TutorialTopic {
  id: string;
  title: string;
  stage: string;
  summary: string;
  content: {
    overview: string;
    sections: {
      heading: string;
      text: string;
      table?: {
        headers: string[];
        rows: string[][];
      };
      code?: string;
      notes?: string;
    }[];
    codeExample?: string;
    takeaways?: string[];
    tips?: string[];
  };
}

export interface TutorialStage {
  id: string;
  title: string;
  icon?: string;
  subcategories?: {
    id: string;
    title: string;
    topics: TutorialTopic[];
  }[];
  topics?: TutorialTopic[];
}

import { stage1 } from './data/stage1';
import { stage2 } from './data/stage2';
import { stage3 } from './data/stage3';
import { stage4 } from './data/stage4';
import { stage5 } from './data/stage5';
import { stage6 } from './data/stage6';
import { cmdHelp } from './data/cmdHelp';

export const TUTORIAL_STAGES: TutorialStage[] = [
  stage1,
  stage2,
  stage3,
  stage4,
  stage5,
  stage6,
  cmdHelp,
];

export const tutorialUI = {
  searchPlaceholder: '搜索课程或知识点...',
  noResults: '未找到与搜索内容匹配的教程章节',
  clickToRun: '点击在编辑器中直接运行',
  runInEditor: '载入编辑器并运行',
  copyCode: '复制源码',
  copied: '已复制到剪贴板',
  tipsTitle: '学习小贴士',
  returnToTutorial: '回到对应教程',
  stageTag: '阶段',
  sectionCodeTitle: '示例代码与校验',
  notesTitle: '说明：',
  tutorialCatalog: '教程目录',
  expandCatalog: '展开教程大纲',
  collapseCatalog: '收起教程大纲',
  interactiveExample: '交互式示例代码',
  codeSnippet: '代码片段',
  importAndRun: '导入运行',
  runInIDE: '在 IDE 中运行代码',
  previous: '上一页',
  next: '下一页'
};

// 扁平化所有主题，用于全局搜索与上下篇导航
export function getAllTutorialTopics(): TutorialTopic[] {
  const topics: TutorialTopic[] = [];
  for (const stage of TUTORIAL_STAGES) {
    if (stage.topics) {
      topics.push(...stage.topics);
    }
    if (stage.subcategories) {
      for (const sub of stage.subcategories) {
        topics.push(...sub.topics);
      }
    }
  }
  return topics;
}

export function getLocalizedTutorialStages(): TutorialStage[] {
  return TUTORIAL_STAGES;
}
