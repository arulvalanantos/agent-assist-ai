import constants from './constants.js';
import { modules, summaryTriggerButtonMappings, togglers } from './static.js';

let isSummaryResizing = false;
let isSmartReplyResizing = false;

/**
 * Setup hide/show toggler button feature for the UI modules
 * @param {*} togglerId
 * @param {*} targetId
 */
export function setupAndInitializeToggler(togglerId, targetId) {
  const toggler = document.getElementById(togglerId);
  const closeBtn = document.getElementById(`${targetId}-close-btn`);
  const target = document.getElementById(targetId);
  const toggleBtnImage = document.getElementById(`${togglerId}-image`);

  const channel = window.channel;

  if (
    targetId !== 'transcript' ||
    (channel === 'voice' && targetId === 'transcript')
  ) {
    // Add initial active classes
    toggler.classList.add('toggle-btn-active');
    target.classList.add('show');
    if (toggleBtnImage)
      toggleBtnImage.src = toggleBtnImage.src.replace('black', 'white');
  }

  // Setup event listener
  toggler.addEventListener('click', function () {
    toggler.classList.toggle('toggle-btn-active');
    target.classList.toggle('show');

    if (toggleBtnImage) {
      toggleBtnImage.src = toggler.classList.contains('toggle-btn-active')
        ? toggleBtnImage.src.replace('black', 'white')
        : toggleBtnImage.src.replace('white', 'black');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      toggler.classList.remove('toggle-btn-active');
      target.classList.remove('show');
      if (toggleBtnImage)
        toggleBtnImage.src = toggleBtnImage.src.replace('white', 'black');
    });
  }
}

/**
 * Implement height adjustment feature for the target id element
 * @param {*} targetId
 */
export function bottomHeightAdjuster(targetId) {
  const container = document.getElementById(targetId);
  const sections = document.querySelectorAll('.suggestions > section');

  container.addEventListener('mousedown', e => {
    // Check if the click is near the bottom border
    const containerRect = container.getBoundingClientRect();
    const isBottomBorder =
      Math.abs(e.clientY - (containerRect.top + containerRect.height)) <= 5;

    if (isBottomBorder) {
      isSummaryResizing = true;
      container.classList.add('resizing');
      document.body.style.cursor = 'row-resize';

      // prevent dragging of sections
      sections.forEach(section => {
        section.setAttribute('draggable', false);
      });
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isSummaryResizing) return;

    const containerRect = container.getBoundingClientRect();
    const newHeight = e.clientY - containerRect.top;

    // Ensure minimum height
    const minHeight = 50;
    const finalHeight = Math.max(newHeight, minHeight);
    const actualHeight = Math.min(250, finalHeight) + 'px';

    container.style.height = actualHeight;
    saveSectionsHeight(targetId, actualHeight);
  });

  document.addEventListener('mouseup', () => {
    if (isSummaryResizing) {
      isSummaryResizing = false;
      container.classList.remove('resizing');
      document.body.style.cursor = 'default';

      // allow dragging of sections
      sections.forEach(section => {
        section.setAttribute('draggable', true);
      });
    }
  });
}

/**
 * Implement height adjustment feature for target id element
 * @param {*} targetId
 */
export function topHeightAdjuster(targetId) {
  const resizableContainer = document.getElementById(targetId);
  const sections = document.querySelectorAll('.suggestions > section');

  let startY, startHeight;

  resizableContainer.addEventListener('mousedown', e => {
    // Check if the click is near the top border
    const containerRect = resizableContainer.getBoundingClientRect();
    const isTopBorder = Math.abs(e.clientY - containerRect.top) <= 5;

    if (isTopBorder) {
      isSmartReplyResizing = true;
      startY = e.clientY;
      startHeight = containerRect.height;
      resizableContainer.classList.add('top-resizing');
      document.body.style.cursor = 'row-resize';

      // prevent dragging of sections
      sections.forEach(section => {
        section.setAttribute('draggable', false);
      });
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isSmartReplyResizing) return;

    const diffY = startY - e.clientY; // Calculate the movement difference
    const newHeight = startHeight + diffY;

    // Ensure minimum height
    const minHeight = 50;
    const finalHeight = Math.max(newHeight, minHeight);
    const actualHeight = Math.min(250, finalHeight) + 'px';

    resizableContainer.style.height = actualHeight;
    saveSectionsHeight(targetId, actualHeight);
  });

  document.addEventListener('mouseup', () => {
    if (isSmartReplyResizing) {
      isSmartReplyResizing = false;
      resizableContainer.classList.remove('top-resizing');
      document.body.style.cursor = 'default';

      // allow dragging of sections
      sections.forEach(section => {
        section.setAttribute('draggable', true);
      });
    }
  });
}

/**
 * Add Draggable feature for suggestion sections
 */
export function enableSectionDragging() {
  // Select all draggable sections
  const suggestions = document.querySelector('.suggestions');
  const sections = document.querySelectorAll('.suggestions > section');

  let img = new Image();
  img.src = '../public/assets/list.png';

  // Variable to track the currently dragged section
  let draggedSection = null;

  // Add event listeners to each section
  sections.forEach(section => {
    // Start dragging
    section.addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', event.target.id);
      event.dataTransfer.setDragImage(img, 10, 10);

      if (!isSmartReplyResizing && !isSummaryResizing) {
        draggedSection = section;
        section.classList.add('dragging');
        suggestions.classList.add('draggable');

        document.getElementById('faq-close-view-btn')?.click();
        document.getElementById('knowledge-assist-close-view-btn')?.click();
      }
    });

    // End dragging
    section.addEventListener('dragend', () => {
      draggedSection = null;
      section.classList.remove('dragging');
      suggestions.classList.remove('draggable');
    });

    // Show receiver UI on dragover
    section.addEventListener('dragover', e => {
      e.preventDefault(); // Necessary to allow dropping
      if (section !== draggedSection) {
        section.classList.add('receiver');
      }
    });

    // Remove receiver UI on dragleave
    section.addEventListener('dragleave', () => {
      section.classList.remove('receiver');
    });

    // Handle drop event
    section.addEventListener('drop', e => {
      e.preventDefault();
      section.classList.remove('receiver'); // Remove receiver UI
      const targetSection = e.target.closest('section');

      // Swap the dragged section with the target section
      if (draggedSection && targetSection && draggedSection !== targetSection) {
        const parent = draggedSection.parentNode;
        const draggedIndex = Array.from(parent.children).indexOf(
          draggedSection
        );
        const targetIndex = Array.from(parent.children).indexOf(targetSection);

        // Perform the swap
        if (draggedIndex > targetIndex) {
          parent.insertBefore(draggedSection, targetSection);
        } else {
          parent.insertBefore(draggedSection, targetSection.nextSibling);
        }
      }

      saveSuggestionsOrder();
    });
  });
}

/**
 * Initialize Toggler Buttons for each UI modules
 */
export function initializeToggleButtons() {
  const features = document.body.getAttribute('data-features');
  const featureList = features.split(',');
  const filteredFeatures = featureList.filter(feature => modules[feature]);
  const filteredTogglers = togglers.filter(({ moduleName }) =>
    filteredFeatures.includes(moduleName)
  );

  // include transcript toggler
  const updatedTogglers = [
    filteredTogglers[0],
    togglers[1],
    ...filteredTogglers.slice(1),
  ];

  const togglerContainer = document.getElementById('toggle-btn-container');
  updatedTogglers.forEach(toggler => {
    const button = document.createElement('button');
    button.id = toggler.togglerId;
    button.type = 'button';
    button.className = 'toggle-btn';
    button.title = toggler.title;

    const img = document.createElement('img');
    img.id = `${toggler.togglerId}-image`;
    img.classList.add('toggle-btn-image');
    img.src = `../public/assets/buttons/${toggler.targetId}-black.svg`;
    img.alt = toggler.title;

    button.appendChild(img);
    togglerContainer.appendChild(button);
  });

  togglers.forEach(({ togglerId, targetId }) => {
    setupAndInitializeToggler(togglerId, targetId);
  });
}

/**
 * To check if the URL is a valid image URL
 * @param {*} url
 * @returns
 */
export function isValidImageUrl(url) {
  const absoluteUrlPattern =
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
  const relativeUrlPattern = /^(\.\.\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
  return absoluteUrlPattern.test(url) || relativeUrlPattern.test(url);
}

/**
 * To import customize logo which pass it as environment variable
 */
export function importLogo() {
  const fallbackURL = '../public/assets/logo.svg';

  const logoURL = document.body.getAttribute('data-logo-url');
  const logoContainer = document.getElementById('logo-container');

  const isValidURL = isValidImageUrl(logoURL);
  const src = !!logoURL && isValidURL ? logoURL : fallbackURL;

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Logo';
  img.height = 34;
  img.classList.add('logo');

  logoContainer.appendChild(img);
}

/**
 * Setting up summary button triggers and listener to do certain actions
 */
export function setupSummaryButtonTriggersAndListeners() {
  summaryTriggerButtonMappings.forEach(mapping => {
    const triggerButton = document.getElementById(mapping.triggerId);

    triggerButton.addEventListener('click', function () {
      const button = document.querySelector(mapping.targetSelector);
      if (button) {
        button.click();
      }
    });
  });
}

export function removeDuplicateElements(selector) {
  const elements = document.querySelectorAll(selector);

  if (elements.length > 1) {
    // Loop through elements and keep only the first one
    for (let i = 1; i < elements.length; i++) {
      elements[i].remove();
    }
  }
}

/**
 * Show sentiment analysis feature
 */
export function showSentimentAnalysis() {
  const shouldShow = document.body.getAttribute('data-sentiment-analysis');

  if (shouldShow === 'true') {
    const container = document.querySelector('.status-container');

    const image = document.createElement('img');
    image.src = '../public/assets/emotion/slightly_smiling_face.svg';
    image.alt = 'Sentiment Analysis';
    image.classList.add('sentiment-image');

    container.appendChild(image);
  }
}

/**
 * Show translation feature
 */
export function showTranslation() {
  const shouldShow = document.body.getAttribute('data-translation');

  if (shouldShow === 'true') {
    const container = document.querySelector('.translation-container');

    // Create the button element
    const button = document.createElement('button');
    button.className = 'translation-btn';
    button.title = 'Toggle Translation';

    // Create the image element
    const img = document.createElement('img');
    img.src = '../public/assets/buttons/translation-black.svg';
    img.alt = 'translate';

    // Create the span elements
    const span1 = document.createElement('span');
    span1.className = 'translation-status';

    const span2 = document.createElement('span');
    span2.textContent = 'Translation:';

    const span3 = document.createElement('span');
    span3.textContent = 'OFF';

    // Append spans to span1
    span1.appendChild(span2);
    span1.appendChild(span3);

    // Append img and span1 to button
    button.appendChild(img);
    button.appendChild(span1);

    // Append button to container
    container.appendChild(button);

    //on click on this translation button should add the active class and also change the text of one of spans from OFF to ON
    button.addEventListener('click', function () {
      button.classList.toggle('active');

      const isActive = button.classList.contains('active');

      img.src = `../public/assets/buttons/translation-${
        isActive ? 'white' : 'black'
      }.svg`;
      span3.textContent = isActive ? 'ON' : 'OFF';
    });
  }
}

/**
 * Check if the transcript is visible or not
 */
export function checkTranscriptVisibility() {
  // show transcript only for voice channel
  const channel = document.body.getAttribute('data-channel');
  if (channel?.toLowerCase() === 'voice') {
    document.getElementById('transcript').classList.add('show');
  } else {
    document.getElementById('transcript').classList.remove('show');
  }
}

/**
 * Remove duplicate toast messages
 */
export function removeDuplicateToastMessage() {
  const observer = new MutationObserver(() => {
    removeDuplicateElements('.cdk-overlay-container');
  });

  // Start observing the body for child changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Auto-generate summary feature
 */
export function autoGenerateSummary() {
  // Auto-regenerate summary every 60 seconds
  const shouldAutoGenerate = document.body.getAttribute(
    'data-auto-generate-summary'
  );

  if (shouldAutoGenerate === 'true') {
    const summaryInterval =
      document.body.getAttribute('data-auto-generate-summary-interval') ?? 60;

    let interval = parseInt(summaryInterval, 10);
    if (isNaN(interval)) {
      interval = 60; // Default value
    }

    const action = () => {
      const textarea = document.querySelector(
        'agent-assist-summarization textarea'
      );
      if (textarea) return;

      document.getElementById('regenerate-btn').click();
    };

    setInterval(action, interval * 1000);
  }
}

/**
 * Copy text to clipboard using Clipboard API
 * @param {*} text
 */
export function copyFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();

  // Try to use keyboard events for copying
  try {
    const successful = document.execCommand && document.execCommand('copy'); // Fallback if execCommand is still there
    if (!successful) throw new Error('execCommand failed');
    showToast(constants.MESSAGE.COPIED);
  } catch (err) {
    console.warn('execCommand is deprecated. Please use Clipboard API.');
  }

  document.body.removeChild(textarea);
}

/**
 * Global button listeners
 */
export function globalButtonListeners() {
  document.body.addEventListener('click', event => {
    const editButton = event.target.closest(
      '[data-test-id="edit-summary-button"]'
    );
    const confirmEditButton = event.target.closest(
      '[data-test-id="confirm-edit-summary-button"]'
    );
    const cancelEditButton = event.target.closest(
      '[data-test-id="cancel-edit-summary-button"]'
    );
    const smartReplyChip = event.target.closest(
      '.smart-reply-content mat-chip-option'
    );

    if (editButton) {
      const summary = document.querySelector('.summary');
      const summaryHeight = summary.getBoundingClientRect().height;
      sessionStorage.setItem(
        constants.SESSION_STORAGE.SUMMARY_CURRENT_HEIGHT,
        summaryHeight
      );

      summary.style.height = '250px';
    }

    if (confirmEditButton || cancelEditButton) {
      const summary = document.querySelector('.summary');
      const latestSummaryHeight = sessionStorage.getItem(
        constants.SESSION_STORAGE.SUMMARY_CURRENT_HEIGHT
      );

      summary.style.height = latestSummaryHeight
        ? `${latestSummaryHeight}px`
        : '120px';
    }

    if (smartReplyChip) {
      const content = smartReplyChip.querySelector(
        '.smart-reply-answer'
      ).textContent;

      navigator.clipboard
        .writeText(content)
        .then(() => showToast(constants.MESSAGE.COPIED))
        .catch(() => copyFallback(content));
    }
  });
}

/**
 * Save the order of the suggestion sections
 */
export function saveSuggestionsOrder() {
  const suggestionsContainer = document.getElementById('suggestions');

  const order = Array.from(suggestionsContainer.children).map(
    section => section.id
  );
  localStorage.setItem('suggestionsOrder', JSON.stringify(order));
}

/**
 * Load the order of the suggestion sections
 */
export function loadSuggestionsOrder() {
  const suggestionsContainer = document.getElementById('suggestions');
  const savedOrder = JSON.parse(localStorage.getItem('suggestionsOrder'));

  if (savedOrder) {
    savedOrder.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) suggestionsContainer.appendChild(section);
    });
  }
}

/**
 * Save the height of the sections
 * @param {*} targetId
 * @param {*} height
 */
export function saveSectionsHeight(targetId, height) {
  localStorage.setItem(`${targetId}-height`, height);
}

/**
 * Load the height of the sections
 */
export function loadSectionsHeight() {
  const summary = document.getElementById('summary');
  const smartReply = document.getElementById('smart-reply');

  const savedSummaryHeight = localStorage.getItem(`summary-height`);
  if (savedSummaryHeight) {
    summary.style.height = savedSummaryHeight;
  }

  const savedSmartReplyHeight = localStorage.getItem(`smart-reply-height`);
  if (savedSmartReplyHeight) {
    smartReply.style.height = savedSmartReplyHeight;
  }
}

export function reloadPage() {
  const reloadButton = document.getElementById('error-message-reload-btn');

  if (reloadButton) {
    reloadButton.onclick = function () {
      location.reload();
    };
  }
}

export function addViewButtonsToFAQs() {
  const suggestions = document.querySelectorAll('.faq .faq-assist__suggestion');

  suggestions?.forEach(faqContainer => {
    if (!faqContainer.querySelector('.view-btn')) {
      const button = document.createElement('button');
      button.className = 'view-btn faq-view-btn';
      button.innerHTML = `
        <span class="view-btn-image">
          <svg 
            class="view-icon" 
            viewBox="0 0 10 10" 
            xmlns="http://www.w3.org/2000/svg" 
            style="width: 1em; height: 1em; color: var(--color-primary);" 
            fill="currentColor">
            <path 
              d="M8.22581 0.483887H1.77419C0.795161 0.483887 0 1.27905 0 2.25808V2.90324C0 3.16937 0.217742 3.38711 0.483871 3.38711C0.75 3.38711 0.967742 3.16937 0.967742 2.90324V2.25808C0.967742 1.81292 1.32903 1.45163 1.77419 1.45163H8.22581C8.67097 1.45163 9.03226 1.81292 9.03226 2.25808V7.74195C9.03226 8.18711 8.67097 8.5484 8.22581 8.5484H6.6129C6.34677 8.5484 6.12903 8.76614 6.12903 9.03227C6.12903 9.2984 6.34677 9.51614 6.6129 9.51614H8.22581C9.20484 9.51614 10 8.72098 10 7.74195V2.25808C10 1.27905 9.20484 0.483887 8.22581 0.483887Z"
            />
            <path 
              d="M0 9.03226C0 9.16129 0.0499999 9.28226 0.141935 9.37419C0.324193 9.55645 0.643548 9.55645 0.825807 9.37419L3.54839 6.65161V8.70968C3.54839 8.97581 3.76613 9.19355 4.03226 9.19355C4.29839 9.19355 4.51613 8.97581 4.51613 8.70968V6.45161C4.51613 5.65161 3.86452 5 3.06452 5H0.806452C0.540323 5 0.322581 5.21774 0.322581 5.48387C0.322581 5.75 0.540323 5.96774 0.806452 5.96774H2.86452L0.141935 8.69032C0.0499999 8.78226 0 8.90323 0 9.03226Z"
            />
          </svg>
        </span>
        <span class="view-btn-title">View</span>`;
      faqContainer.appendChild(button);
      button.addEventListener('click', handleFaqContentView);
    }
  });
}

export function handleFaqContentView() {
  const faq = document.getElementById('faq');
  const titleContainer = faq.querySelector('.title-container');
  const content = faq.querySelector('.faq-content');
  const viewMode = faq.querySelector('.faq-view-mode');

  const contentItem = this.closest('.faq-assist__suggestion');

  const title = contentItem.querySelector(
    '.document-and-faq-assist__suggestion-title'
  ).innerText;

  const suggestion = contentItem.querySelector(
    '.document-and-faq-assist__suggestion-body span'
  ).innerText;

  content.style.display = 'none';
  titleContainer.style.display = 'none';
  faq.style.padding = '0px';
  viewMode.style.display = 'flex';

  viewMode.querySelector('.faq-view-title').innerText = title;
  viewMode.querySelector('.faq-view-suggestion').innerText = suggestion;

  const closeViewButton = viewMode.querySelector('.close-view-btn');
  closeViewButton.addEventListener('click', function () {
    viewMode.style.display = 'none';
    content.style.display = 'flex';
    titleContainer.style.display = 'flex';
    faq.style.padding = '8px';
  });

  const copyButton = viewMode.querySelector('.copy-btn');
  copyButton.addEventListener('click', function () {
    const faqSuggestion = viewMode.querySelector('.faq-view-suggestion');
    const faqSuggestionContent = faqSuggestion.textContent;

    navigator.clipboard
      .writeText(faqSuggestionContent)
      .then(() => showToast(constants.MESSAGE.COPIED))
      .catch(() => copyFallback(faqSuggestionContent));
  });
}

export function faqObserver() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        console.log(node, node.nodeType);
        if (
          node.nodeType === 1 &&
          node.classList.contains('document-and-faq-assist__suggestion')
        ) {
          addViewButtonsToFAQs();
        }
      });
    });
  });

  const faqContainer = document.getElementById('faq-container');
  observer.observe(faqContainer, { childList: true, subtree: true });
}

export function handleKnowledgeAssistContentView() {
  const faq = document.getElementById('knowledge-assist');
  const titleContainer = faq.querySelector('.title-container');
  const content = faq.querySelector('.knowledge-assist-content');
  const viewMode = faq.querySelector('.knowledge-assist-view-mode');

  const contentItem = this.closest('.answer-card-container');

  const title = contentItem.querySelector(
    '.answer-card-header-query-title'
  )?.innerText;

  const suggestion = contentItem.querySelector(
    '.answer-card-knowledge-answer'
  )?.innerText;

  if (!title || !suggestion) return;

  content.style.display = 'none';
  titleContainer.style.display = 'none';
  faq.style.padding = '0px';
  viewMode.style.display = 'flex';

  viewMode.querySelector('.knowledge-assist-view-title').innerText = title;
  viewMode.querySelector('.knowledge-assist-view-suggestion').innerText =
    suggestion;

  const closeViewButton = viewMode.querySelector('.close-view-btn');
  closeViewButton.addEventListener('click', function () {
    viewMode.style.display = 'none';
    content.style.display = 'flex';
    titleContainer.style.display = 'flex';
    faq.style.padding = '8px';
  });

  const copyButton = viewMode.querySelector('.copy-btn');
  copyButton.addEventListener('click', function () {
    const faqSuggestion = viewMode.querySelector(
      '.knowledge-assist-view-suggestion'
    );
    const faqSuggestionContent = faqSuggestion.textContent;

    navigator.clipboard
      .writeText(faqSuggestionContent)
      .then(() => showToast(constants.MESSAGE.COPIED))
      .catch(() => copyFallback(faqSuggestionContent));
  });
}

export function addViewButtonsToKnowledgeAssist() {
  const assistSearches = document.querySelectorAll(
    '.knowledge-assist-content knowledge-search-card'
  );

  assistSearches?.forEach(assistSearch => {
    const actionButtons = assistSearch.querySelector('.action-buttons');

    if (
      actionButtons &&
      !actionButtons.querySelector('.knowledge-assist-view-btn')
    ) {
      const button = document.createElement('button');
      button.className = 'knowledge-assist-view-btn';
      button.title = "View the knowledge assist's content";
      button.innerHTML = `
        <span class="view-btn-image">
          <svg 
            class="view-icon" 
            viewBox="0 0 10 10" 
            xmlns="http://www.w3.org/2000/svg" 
            style="width: 1em; height: 1em; color: var(--color-primary);" 
            fill="currentColor">
            <path 
              d="M8.22581 0.483887H1.77419C0.795161 0.483887 0 1.27905 0 2.25808V2.90324C0 3.16937 0.217742 3.38711 0.483871 3.38711C0.75 3.38711 0.967742 3.16937 0.967742 2.90324V2.25808C0.967742 1.81292 1.32903 1.45163 1.77419 1.45163H8.22581C8.67097 1.45163 9.03226 1.81292 9.03226 2.25808V7.74195C9.03226 8.18711 8.67097 8.5484 8.22581 8.5484H6.6129C6.34677 8.5484 6.12903 8.76614 6.12903 9.03227C6.12903 9.2984 6.34677 9.51614 6.6129 9.51614H8.22581C9.20484 9.51614 10 8.72098 10 7.74195V2.25808C10 1.27905 9.20484 0.483887 8.22581 0.483887Z"
            />
            <path 
              d="M0 9.03226C0 9.16129 0.0499999 9.28226 0.141935 9.37419C0.324193 9.55645 0.643548 9.55645 0.825807 9.37419L3.54839 6.65161V8.70968C3.54839 8.97581 3.76613 9.19355 4.03226 9.19355C4.29839 9.19355 4.51613 8.97581 4.51613 8.70968V6.45161C4.51613 5.65161 3.86452 5 3.06452 5H0.806452C0.540323 5 0.322581 5.21774 0.322581 5.48387C0.322581 5.75 0.540323 5.96774 0.806452 5.96774H2.86452L0.141935 8.69032C0.0499999 8.78226 0 8.90323 0 9.03226Z"
            />
          </svg>
        </span>`;

      actionButtons.appendChild(button);
      button.addEventListener('click', handleKnowledgeAssistContentView);
    }
  });
}

export function knowledgeAssistObserver() {
  const observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      if (
        mutation.target.classList &&
        mutation.target.classList.contains('answer-card-header-container')
      ) {
        addViewButtonsToKnowledgeAssist();
      }
    }
  });

  const knowledgeAssistContainer = document.getElementById(
    'knowledge-assist-container'
  );
  observer.observe(knowledgeAssistContainer, {
    childList: true,
    subtree: true,
  });
}

export function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';

  toast.appendChild(document.createTextNode(message));

  toastContainer.appendChild(toast);

  // Show the toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide the toast after the specified duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
}
