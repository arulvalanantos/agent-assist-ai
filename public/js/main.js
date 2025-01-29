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
} from './utils.js';

window.addEventListener('load', function () {
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
