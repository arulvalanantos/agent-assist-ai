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
} from './utils.js';

window.addEventListener('load', function () {
  globalButtonListeners();

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
});
