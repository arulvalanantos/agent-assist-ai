import {
  bottomHeightAdjuster,
  enableSectionDragging,
  initializeToggleButtons,
  topHeightAdjuster,
  setupSummaryButtonTriggersAndListeners,
  importLogo,
  removeDuplicateToastMessage,
  showSentimentAnalysis,
  checkTranscriptVisibility,
  autoGenerateSummary,
  showTranslation,
  globalButtonListeners,
  loadSuggestionsOrder,
  loadSectionsHeight,
} from './utils.js';

window.addEventListener('load', function () {
  globalButtonListeners();
  loadSuggestionsOrder();
  loadSectionsHeight();

  importLogo();
  showSentimentAnalysis();
  showTranslation();
  setupSummaryButtonTriggersAndListeners();
  initializeToggleButtons();

  bottomHeightAdjuster('summary');
  topHeightAdjuster('smart-reply');
  enableSectionDragging();

  checkTranscriptVisibility();
  removeDuplicateToastMessage();
  autoGenerateSummary();

  // Add reload button event listener
  const reloadButton = document.getElementById('error-message-reload-btn');
  if (reloadButton) {
    reloadButton.onclick = function () {
      location.reload();
    };
  }
});
