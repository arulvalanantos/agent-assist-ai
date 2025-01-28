import {
  bottomHeightAdjuster,
  enableSectionDragging,
  initializeToggleButtons,
  topHeightAdjuster,
  setupSummaryButtonTriggersAndListeners,
  importLogo,
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
});
