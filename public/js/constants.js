const constants = {
  TOAST_DURATION: 4000, // 4 seconds
  VIEW_MODE: {
    TITLE_MIN: 18,
    TITLE_MAX: 24,
    DESCRIPTION_MIN: 14,
    DESCRIPTION_MAX: 20,
  },
  MESSAGE: {
    COPIED: 'Copied to clipboard.',
  },
  LOCAL_STORAGE: {
    PREFERRED_SUMMARY_HEIGHT: 'preferred-summary-height',
    PREFERRED_SMART_REPLY_HEIGHT: 'preferred-smart-reply-height',
    SUMMARY_CURRENT_HEIGHT: 'summary-current-height',
    FAQ_TITLE_FONT_SIZE: 'faq-view-mode-title-fontsize',
    FAQ_DESCRIPTION_FONT_SIZE: 'faq-view-mode-description-fontsize',
    KNOW_ASSIST_TITLE_FONT_SIZE: 'knowledge-assist-view-mode-title-fontsize',
    KNOW_ASSIST_DESCRIPTION_FONT_SIZE:
      'knowledge-assist-view-mode-description-fontsize',
  },
};

export default Object.freeze(constants);
