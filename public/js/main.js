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
  reloadPage,
  addViewButtonsToFAQs,
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
  reloadPage();

  // Observe for dynamically added FAQ sections
  const observer = new MutationObserver(() => {
    addViewButtonsToFAQs();
  });

  const faq = this.document.getElementById('faq');
  observer.observe(faq, { childList: true, subtree: true });
});
