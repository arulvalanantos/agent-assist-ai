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

// export function setupHeightAdjuster(expanderId, targetId) {
//   const target = document.getElementById(targetId);
//   const expander = document.getElementById(expanderId);

//   let isResizing = false;

//   function onMouseMove(e) {
//     if (!isResizing) return;

//     const newHeight = e.clientY - target.getBoundingClientRect().top;
//     target.style.height = `${newHeight}px`;
//   }

//   function onMouseUp() {
//     isResizing = false;
//     document.body.style.cursor = 'default';

//     // Remove event listeners after resizing is finished
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
//   }

//   expander.addEventListener('mousedown', function (e) {
//     isResizing = true;
//     document.body.style.cursor = 'ns-resize';
//     e.preventDefault();

//     // Add the event listeners for mousemove and mouseup
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//   });

//   expander.addEventListener('mouseleave', function () {
//     if (isResizing) {
//       onMouseUp(); // Stop resizing when the mouse leaves the expander
//     }
//   });
// }

// export function setupHeightAdjusterTop(expanderId, targetId) {
//   const target = document.getElementById(targetId);
//   const expander = document.getElementById(expanderId);

//   let isResizing = false;
//   let initialMouseY = 0;
//   let initialHeight = 0;

//   function onMouseMove(e) {
//     if (!isResizing) return;

//     const deltaY = initialMouseY - e.clientY;
//     const newHeight = initialHeight + deltaY;
//     const adjustedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

//     target.style.height = `${adjustedHeight}px`;
//   }

//   function onMouseUp() {
//     isResizing = false;
//     document.body.style.cursor = 'default';

//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
//   }

//   expander.addEventListener('mousedown', function (e) {
//     isResizing = true;
//     initialMouseY = e.clientY;
//     initialHeight = target.getBoundingClientRect().height;

//     document.body.style.cursor = 'ns-resize';
//     e.preventDefault();

//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//   });

//   expander.addEventListener('mouseleave', function () {
//     if (isResizing) {
//       onMouseUp();
//     }
//   });
// }
