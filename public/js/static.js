export const togglers = [
  {
    togglerId: 'summary-toggler',
    targetId: 'summary',
    moduleName: 'CONVERSATION_SUMMARIZATION',
  },
  { togglerId: 'faq-toggler', targetId: 'faq', moduleName: 'FAQ' },
  {
    togglerId: 'knowledge-assist-toggler',
    targetId: 'knowledge-assist',
    moduleName: 'KNOWLEDGE_ASSIST_V2',
  },
  {
    togglerId: 'smart-reply-toggler',
    targetId: 'smart-reply',
    moduleName: 'SMART_REPLY',
  },
];

export const modules = {
  KNOWLEDGE_ASSIST_V2: 'KNOWLEDGE_ASSIST_V2',
  CONVERSATION_SUMMARIZATION: 'CONVERSATION_SUMMARIZATION',
  SMART_REPLY: 'SMART_REPLY',
  FAQ: 'FAQ',
  // ARTICLE_SEARCH: 'ARTICLE_SEARCH',
  // ARTICLE_SUGGESTION: 'ARTICLE_SUGGESTION',
};
