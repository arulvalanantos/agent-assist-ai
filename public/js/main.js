import { togglers } from './static.js';
import {
  bottomHeightAdjuster,
  enableSectionDragging,
  setupAndInitializeToggler,
  topHeightAdjuster,
} from './utils.js';

window.addEventListener('load', function () {
  togglers.forEach(({ togglerId, targetId }) => {
    setupAndInitializeToggler(togglerId, targetId);
  });

  bottomHeightAdjuster('summary');
  topHeightAdjuster('smart-reply');

  enableSectionDragging();
});

document.getElementById('transcript').classList.add('show');
