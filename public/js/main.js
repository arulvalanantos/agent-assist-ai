import { togglers } from './static.js';
import {
  setupAndInitializeToggler,
  setupHeightAdjusterBottom,
  setupHeightAdjusterTop,
} from './utils.js';

window.addEventListener('load', function () {
  togglers.forEach(({ togglerId, targetId }) => {
    setupAndInitializeToggler(togglerId, targetId);
  });

  setupHeightAdjusterBottom('summary-expander', 'summary');
  setupHeightAdjusterTop('smart-reply-expander', 'smart-reply');
});

document.getElementById('transcript').classList.add('show');
