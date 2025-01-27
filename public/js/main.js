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

  // set up regenerate button to trigger generate summary button
  document
    .getElementById('regenerate-btn')
    .addEventListener('click', function () {
      document.querySelector('.generate-summary').click();
    });

  // set up copy button to trigger copy summary button
  document.getElementById('copy-btn').addEventListener('click', function () {
    document.querySelector('[data-test-id="copy-summary-button"]').click();
  });

  // set up edit button to trigger edit summary button
  document.getElementById('edit-btn').addEventListener('click', function () {
    document.querySelector('[data-test-id="edit-summary-button"]').click();
  });

  initializeToggleButtons();

  bottomHeightAdjuster('summary');
  topHeightAdjuster('smart-reply');

  enableSectionDragging();

  // Set up copy buttons for FAQ suggestions
  // setupCopyButtons('.faq-suggestion', '.faq-suggestion-content');

  // // Set up copy buttons for Knowledge Assist content items
  // setupCopyButtons(
  //   '.knowledge-assist-content-item',
  //   '.knowledge-assist-suggestion'
  // );

  // handleKnowledgeAssistContentView();
  // handleSmartReplyContentView();
  // handleFaqContentView();

  // show transcript only for voice channel
  const channel = document.body.getAttribute('data-channel');
  if (channel?.toLowerCase() === 'voice') {
    document.getElementById('transcript').classList.add('show');
  }

  document.getElementById('regenerate-btn').click();
});
