import {
  bottomHeightAdjuster,
  enableSectionDragging,
  initializeToggleButtons,
  topHeightAdjuster,
  setupCopyButtons,
  handleKnowledgeAssistContentView,
  handleSmartReplyContentView,
  handleFaqContentView,
  addLogo,
} from './utils.js';

window.addEventListener('load', function () {
  addLogo();

  initializeToggleButtons();

  bottomHeightAdjuster('summary');
  topHeightAdjuster('smart-reply');

  enableSectionDragging();

  // Set up copy buttons for FAQ suggestions
  setupCopyButtons('.faq-suggestion', '.faq-suggestion-content');

  // Set up copy buttons for Knowledge Assist content items
  setupCopyButtons(
    '.knowledge-assist-content-item',
    '.knowledge-assist-suggestion'
  );

  // handleKnowledgeAssistContentView();
  // handleSmartReplyContentView();
  // handleFaqContentView();

  // show transcript only for voice channel
  const channel = document.body.getAttribute('data-channel');
  if (channel?.toLowerCase() === 'voice') {
    document.getElementById('transcript').classList.add('show');
  }
});
