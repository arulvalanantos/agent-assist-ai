import { togglers } from './static.js';
import {
  bottomHeightAdjuster,
  enableSectionDragging,
  setupAndInitializeToggler,
  topHeightAdjuster,
  setupCopyButtons
} from './utils.js';

window.addEventListener('load', function () {
  togglers.forEach(({ togglerId, targetId }) => {
    setupAndInitializeToggler(togglerId, targetId);
  });

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
});

document.getElementById('transcript').classList.add('show');
