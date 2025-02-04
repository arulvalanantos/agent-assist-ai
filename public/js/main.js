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
  faqObserver,
  knowledgeAssistObserver,
  adjustFAQViewModeTitleAndDescription,
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

  faqObserver();
  knowledgeAssistObserver();

  adjustFAQViewModeTitleAndDescription();
});
