import {
  bottomHeightAdjuster,
  enableSectionDragging,
  initializeToggleButtons,
  topHeightAdjuster,
  setupSummaryButtonTriggersAndListeners,
  importLogo,
  removeDuplicateElements,
} from './utils.js';

window.addEventListener('load', function () {
  importLogo();

  setupSummaryButtonTriggersAndListeners();

  initializeToggleButtons();

  bottomHeightAdjuster('summary');
  topHeightAdjuster('smart-reply');

  enableSectionDragging();

  // show transcript only for voice channel
  const channel = document.body.getAttribute('data-channel');
  if (channel?.toLowerCase() === 'voice') {
    document.getElementById('transcript').classList.add('show');
  }

  document.getElementById('regenerate-btn').click();

  const observer = new MutationObserver(() => {
    removeDuplicateElements('.cdk-overlay-container');
  });

  // Start observing the body for child changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
