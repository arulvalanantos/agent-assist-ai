import { togglers } from './static.js';
import { setupAndInitializeToggler } from './utils.js';

window.addEventListener('load', function () {
  togglers.forEach(({ togglerId, targetId }) => {
    setupAndInitializeToggler(togglerId, targetId);
  });

  // setupHeightAdjuster('summary-expander', 'summary');
  // setupHeightAdjusterTop('smart-reply-expander', 'smart-reply');
});

document.getElementById('transcript').classList.add('show');
