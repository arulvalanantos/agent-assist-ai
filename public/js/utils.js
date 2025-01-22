import constants from './constants.js';
import { modules, togglers } from './static.js';

let isSummaryResizing = false;
let isSmartReplyResizing = false;

export function disablePointerEventsAndUserSelect(elements) {
  elements.forEach(element => {
    element.style.pointerEvents = 'none';
    element.style.userSelect = 'none';
  });
}

export function enablePointerEventsAndUserSelect(elements) {
  elements.forEach(element => {
    element.style.pointerEvents = 'auto';
    element.style.userSelect = 'auto';
  });
}

export function setupAndInitializeToggler(togglerId, targetId) {
  const toggler = document.getElementById(togglerId);
  const closeBtn = document.getElementById(`${targetId}-close-btn`);
  const target = document.getElementById(targetId);
  const toggleBtnImage = document.getElementById(`${togglerId}-image`);

  // Add initial active classes
  toggler.classList.add('toggle-btn-active');
  target.classList.add('show');
  if (toggleBtnImage)
    toggleBtnImage.src = toggleBtnImage.src.replace('black', 'white');

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

export function bottomHeightAdjuster(targetId) {
  const container = document.getElementById(targetId);
  const sections = document.querySelectorAll('.suggestions > section');
  const summary = document.querySelector('.summary-text');
  const smartReplies = document.querySelectorAll('.smart-reply-text');
  const faqSuggestions = document.querySelectorAll('.faq-suggestion');
  const knowledgeBaseSuggestions = document.querySelectorAll(
    '.knowledge-assist-content-item'
  );
  const transcript = document.querySelector('.transcript-content');

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

      disablePointerEventsAndUserSelect(smartReplies);
      disablePointerEventsAndUserSelect(faqSuggestions);
      disablePointerEventsAndUserSelect(knowledgeBaseSuggestions);
      disablePointerEventsAndUserSelect([summary]);
      disablePointerEventsAndUserSelect([transcript]);
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isSummaryResizing) return;

    const containerRect = container.getBoundingClientRect();
    const newHeight = e.clientY - containerRect.top;

    // Ensure minimum height
    const minHeight = 50;
    container.style.height = Math.max(newHeight, minHeight) + 'px';
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

      enablePointerEventsAndUserSelect(smartReplies);
      enablePointerEventsAndUserSelect(faqSuggestions);
      enablePointerEventsAndUserSelect(knowledgeBaseSuggestions);
      enablePointerEventsAndUserSelect([summary]);
      enablePointerEventsAndUserSelect([transcript]);
    }
  });
}

export function topHeightAdjuster(targetId) {
  const resizableContainer = document.getElementById(targetId);
  const sections = document.querySelectorAll('.suggestions > section');
  const summary = document.querySelector('.summary-text');
  const smartReplies = document.querySelectorAll('.smart-reply-text');
  const faqSuggestions = document.querySelectorAll('.faq-suggestion');
  const knowledgeBaseSuggestions = document.querySelectorAll(
    '.knowledge-assist-content-item'
  );

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

      disablePointerEventsAndUserSelect(smartReplies);
      disablePointerEventsAndUserSelect(faqSuggestions);
      disablePointerEventsAndUserSelect(knowledgeBaseSuggestions);
      disablePointerEventsAndUserSelect([summary]);
      disablePointerEventsAndUserSelect([transcript]);
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isSmartReplyResizing) return;

    const diffY = startY - e.clientY; // Calculate the movement difference
    const newHeight = startHeight + diffY;

    // Ensure minimum height
    const minHeight = 50;
    resizableContainer.style.height = Math.max(newHeight, minHeight) + 'px';
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

      enablePointerEventsAndUserSelect(smartReplies);
      enablePointerEventsAndUserSelect(faqSuggestions);
      enablePointerEventsAndUserSelect(knowledgeBaseSuggestions);
      enablePointerEventsAndUserSelect([summary]);
      enablePointerEventsAndUserSelect([transcript]);
    }
  });
}

export function enableSectionDragging() {
  // Select all draggable sections
  const sections = document.querySelectorAll('.suggestions > section');
  const summary = document.querySelector('.summary-text');

  // Variable to track the currently dragged section
  let draggedSection = null;

  // Add event listeners to each section
  sections.forEach(section => {
    // Start dragging
    section.addEventListener('dragstart', () => {
      if (!isSmartReplyResizing && !isSummaryResizing) {
        draggedSection = section;
        section.classList.add('dragging');

        disablePointerEventsAndUserSelect([summary]);
      }
    });

    // End dragging
    section.addEventListener('dragend', () => {
      draggedSection = null;
      section.classList.remove('dragging');

      enablePointerEventsAndUserSelect([summary]);
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
    });
  });
}

export function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';

  const tickImage = document.createElement('img');
  tickImage.src = '../public/assets/tick.png'; // Update the path to your tick image
  tickImage.alt = 'tick';
  tickImage.style.width = '16px';
  tickImage.style.height = '16px';
  tickImage.style.marginRight = '8px';

  toast.appendChild(tickImage);
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

export function setupCopyButtons(selector, contentSelector) {
  document.querySelectorAll(selector).forEach(item => {
    const copyBtn = item.querySelector('.copy-btn');
    const content = item.querySelector(contentSelector).innerText;

    copyBtn.addEventListener('click', () => {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          showToast(constants.MESSAGE.COPIED);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    });
  });
}

export function handleKnowledgeAssistContentView() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const knowledgeAssist = document.querySelector('.knowledge-assist');

  const titleContainer = knowledgeAssist.querySelector('.title-container');
  const content = knowledgeAssist.querySelector('.knowledge-assist-content');
  const viewMode = knowledgeAssist.querySelector('.knowledge-assist-view-mode');

  viewButtons.forEach(button => {
    button.addEventListener('click', function () {
      const contentItem = this.closest('.knowledge-assist-content-item');
      const title = contentItem.querySelector(
        '.knowledge-assist-title'
      ).innerText;
      const suggestion = contentItem.querySelector(
        '.knowledge-assist-suggestion'
      ).innerText;

      // Hide the knowledge-assist content and title
      content.style.display = 'none';
      titleContainer.style.display = 'none';

      // Show the view mode section
      viewMode.style.display = 'flex';

      // Update the view mode section with the corresponding title and content
      viewMode.querySelector('.knowledge-assist-view-title').innerText = title;
      viewMode.querySelector('.knowledge-assist-view-suggestion').innerText =
        suggestion;
    });
  });

  // Close view mode button functionality
  const closeViewButton = viewMode.querySelector('.close-view-btn');
  closeViewButton.addEventListener('click', function () {
    // Hide the view mode section
    viewMode.style.display = 'none';

    // Show the knowledge-assist content and title
    content.style.display = 'flex';
    titleContainer.style.display = 'flex';
  });

  // Copy button functionality
  const copyButton = viewMode.querySelector('.copy-btn');
  copyButton.addEventListener('click', function () {
    const suggestionContent = viewMode.querySelector(
      '.knowledge-assist-view-suggestion'
    ).innerText;
    navigator.clipboard.writeText(suggestionContent).then(() => {
      showToast(constants.MESSAGE.COPIED);
    });
  });
}

export function handleSmartReplyContentView() {
  const viewButtons = document.querySelectorAll('.smart-reply .view-btn');
  const smartReply = document.querySelector('.smart-reply');

  const titleContainer = smartReply.querySelector('.title-container');
  const content = smartReply.querySelector('.smart-reply-content');
  const viewMode = smartReply.querySelector('.smart-reply-view-mode');

  viewButtons.forEach(button => {
    button.addEventListener('click', function () {
      const contentItem = this.closest('.smart-reply-text');
      const text = contentItem.querySelector('p').innerText;

      // Hide the smart-reply content and title
      content.style.display = 'none';
      titleContainer.style.display = 'none';

      // Show the view mode section
      viewMode.style.display = 'flex';

      // Update the view mode section with the corresponding content
      viewMode.querySelector('.smart-reply-view-text').innerText = text;
    });
  });

  // Close view mode button functionality
  const closeViewButton = viewMode.querySelector('.close-view-btn');
  closeViewButton.addEventListener('click', function () {
    // Hide the view mode section
    viewMode.style.display = 'none';

    // Show the smart-reply content and title
    content.style.display = 'flex';
    titleContainer.style.display = 'flex';
  });

  // Copy button functionality
  const copyButton = viewMode.querySelector('.copy-btn');
  copyButton.addEventListener('click', function () {
    const suggestionContent = viewMode.querySelector(
      '.smart-reply-view-text'
    ).innerText;
    navigator.clipboard.writeText(suggestionContent).then(() => {
      showToast(constants.MESSAGE.COPIED);
    });
  });
}

export function handleFaqContentView() {
  const viewButtons = document.querySelectorAll('.faq .view-btn');
  const faq = document.querySelector('.faq');

  const titleContainer = faq.querySelector('.title-container');
  const searchContainer = faq.querySelector('.faq-search-container');
  const content = faq.querySelector('.faq-content');
  const viewMode = faq.querySelector('.faq-view-mode');

  viewButtons.forEach(button => {
    button.addEventListener('click', function () {
      const contentItem = this.closest('.faq-suggestion');
      const title = contentItem.querySelector(
        '.faq-suggestion-title'
      ).innerText;
      const suggestion = contentItem.querySelector(
        '.faq-suggestion-content'
      ).innerText;

      // Hide the faq content and title
      content.style.display = 'none';
      titleContainer.style.display = 'none';
      searchContainer.style.display = 'none';

      // Show the view mode section
      viewMode.style.display = 'flex';

      // Update the view mode section with the corresponding title and content
      viewMode.querySelector('.faq-view-title').innerText = title;
      viewMode.querySelector('.faq-view-suggestion').innerText = suggestion;
    });
  });

  // Close view mode button functionality
  const closeViewButton = viewMode.querySelector('.close-view-btn');
  closeViewButton.addEventListener('click', function () {
    // Hide the view mode section
    viewMode.style.display = 'none';

    // Show the faq content and title
    content.style.display = 'flex';
    titleContainer.style.display = 'flex';
    searchContainer.style.display = 'flex';
  });

  // Copy button functionality
  const copyButton = viewMode.querySelector('.copy-btn');
  copyButton.addEventListener('click', function () {
    const suggestionContent = viewMode.querySelector(
      '.faq-view-suggestion'
    ).innerText;
    navigator.clipboard.writeText(suggestionContent).then(() => {
      showToast(constants.MESSAGE.COPIED);
    });
  });
}

/**
 * Authenticate the Genesys Cloud access token
 * @param {string} accessToken
 * @return {!Promise<number>}
 */
export function authenticateGenesysCloud(accessToken) {
  return fetch(proxyServerEndPoint + '/register', {
    method: 'POST',
    headers: [['Authorization', accessToken]],
  });
}

export function initializeToggleButtons() {
  const features = document.body.getAttribute('data-features');
  const featureList = features.split(',');
  const filteredFeatures = featureList.filter(feature => modules[feature]);
  const filteredTogglers = togglers.filter(({ moduleName }) =>
    filteredFeatures.includes(moduleName)
  );

  const togglerContainer = document.getElementById('toggle-btn-container');
  filteredTogglers.forEach(toggler => {
    const button = document.createElement('button');
    button.id = toggler.togglerId;
    button.type = 'button';
    button.className = 'toggle-btn';
    button.title = toggler.title;

    const img = document.createElement('img');
    img.id = `${toggler.togglerId}-image`;
    img.src = `../public/assets/buttons/${toggler.targetId}-black.svg`;
    img.alt = toggler.title;

    button.appendChild(img);
    togglerContainer.appendChild(button);
  });

  filteredTogglers.forEach(({ togglerId, targetId }) => {
    setupAndInitializeToggler(togglerId, targetId);
  });
}
