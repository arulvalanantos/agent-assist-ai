export const togglers = [
  {
    togglerId: 'summary-toggler',
    targetId: 'summary',
    moduleName: 'CONVERSATION_SUMMARIZATION',
    title: 'Summary',
  },
  {
    togglerId: 'transcript-toggler',
    targetId: 'transcript',
    moduleName: 'TRANSCRIPT',
    title: 'Transcript',
  },
  {
    togglerId: 'faq-toggler',
    targetId: 'faq',
    moduleName: 'FAQ',
    title: 'FAQ & Article Suggestion',
  },
  {
    togglerId: 'knowledge-assist-toggler',
    targetId: 'knowledge-assist',
    moduleName: 'KNOWLEDGE_ASSIST_V2',
    title: 'Knowledge Assist',
  },
  {
    togglerId: 'smart-reply-toggler',
    targetId: 'smart-reply',
    moduleName: 'SMART_REPLY',
    title: 'Smart Reply',
  },
];

export const modules = {
  KNOWLEDGE_ASSIST_V2: 'KNOWLEDGE_ASSIST_V2',
  CONVERSATION_SUMMARIZATION: 'CONVERSATION_SUMMARIZATION',
  SMART_REPLY: 'SMART_REPLY',
  FAQ: 'FAQ',
  TRANSCRIPT: 'TRANSCRIPT',
  // ARTICLE_SEARCH: 'ARTICLE_SEARCH',
  // ARTICLE_SUGGESTION: 'ARTICLE_SUGGESTION',
};

export const summaryTriggerButtonMappings = [
  { triggerId: 'regenerate-btn', targetSelector: '.generate-summary' },
  {
    triggerId: 'copy-btn',
    targetSelector: '[data-test-id="copy-summary-button"]',
  },
  {
    triggerId: 'edit-btn',
    targetSelector: '[data-test-id="edit-summary-button"]',
  },
];

export const summaryButtonListeners = [
  { targetId: '[data-test-id="confirm-summary-button"]' },
  { targetId: '[data-test-id="cancel-summary-button"]' },
];
