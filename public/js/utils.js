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
  let isResizing = false;

  container.addEventListener('mousedown', e => {
    // Check if the click is near the bottom border
    const containerRect = container.getBoundingClientRect();
    const isBottomBorder =
      Math.abs(e.clientY - (containerRect.top + containerRect.height)) <= 5;

    if (isBottomBorder) {
      isResizing = true;
      container.classList.add('resizing');
      document.body.style.cursor = 'row-resize';
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isResizing) return;

    const containerRect = container.getBoundingClientRect();
    const newHeight = e.clientY - containerRect.top;

    // Ensure minimum height
    const minHeight = 50;
    container.style.height = Math.max(newHeight, minHeight) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      container.classList.remove('resizing');
      document.body.style.cursor = 'default';
    }
  });
}

export function topHeightAdjuster(targetId) {
  const resizableContainer = document.getElementById(targetId);
  let isResizing = false;
  let startY, startHeight;

  resizableContainer.addEventListener('mousedown', e => {
    // Check if the click is near the top border
    const containerRect = resizableContainer.getBoundingClientRect();
    const isTopBorder = Math.abs(e.clientY - containerRect.top) <= 5;

    if (isTopBorder) {
      isResizing = true;
      startY = e.clientY;
      startHeight = containerRect.height;
      resizableContainer.classList.add('top-resizing');
      document.body.style.cursor = 'row-resize';
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isResizing) return;

    const diffY = startY - e.clientY; // Calculate the movement difference
    const newHeight = startHeight + diffY;

    // Ensure minimum height
    const minHeight = 50;
    resizableContainer.style.height = Math.max(newHeight, minHeight) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      resizableContainer.classList.remove('top-resizing');
      document.body.style.cursor = 'default';
    }
  });
}
