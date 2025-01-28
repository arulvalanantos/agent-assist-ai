import {
  bottomHeightAdjuster,
  enableSectionDragging,
  initializeToggleButtons,
  topHeightAdjuster,
  setupSummaryButtonTriggers,
  addLogo,
} from './utils.js';

window.addEventListener('load', function () {
  addLogo();

  // Call the function to set up the button triggers
  setupSummaryButtonTriggers();

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
});
