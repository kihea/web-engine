let deptharr = []

function autosize(container) {
  let childList = [];
  let elements = 0;
  let direction = 'horizontal';
  for (const child of container.children) {
    
    if (child.classList.contains('stack')) {
      autosize(child);
    } else if (child.classList.contains('resizer')) {
      direction = child.getAttribute('data-direction') || direction;

      continue;
    }
    elements += 1;
    childList.push(child);
  }
  childList.forEach(function(child) {
    if (direction == 'horizontal') {
      child.style.width = `${100 / elements}%`;
      child.style.height = `100%`
    } else if (direction == 'vertical') {
      child.style.height = `${100 / elements}%`;
      child.style.width = `100%`
    }
    
  });
}
const resizable = function (resizer) {
  const direction = resizer.getAttribute('data-direction') || 'horizontal';
  let prevSibling = resizer.previousElementSibling;
  let nextSibling = resizer.nextElementSibling;

  // The current position of mouse
  let x = 0;
  let y = 0;
  let prevSiblingHeight = 0;
  let prevSiblingWidth = 0;
  let nextSiblingHeight = 0;
  let nextSiblingWidth = 0;
  let resizeAreaHeight = 0;
  let resizeAreaWidth = 0;
  let parentHeight = 0;
  let parentWidth = 0;
  let percentHeight = 0;
  let percentWidth = 0;
  let ratioHeight = 0; 
  let ratioWidth = 0;
  // Handle the mousedown event
  // that's triggered when user drags the resizer
  const mouseDownHandler = function (e) {
    // Get the current mouse position
    prevSibling = resizer.previousElementSibling;
    nextSibling = resizer.nextElementSibling;
    x = e.clientX;
    y = e.clientY;
    const rect = prevSibling.getBoundingClientRect();
    const nrect = nextSibling.getBoundingClientRect();
    prevSiblingHeight = rect.height;
    prevSiblingWidth = rect.width;
    nextSiblingHeight = nrect.height;
    nextSiblingWidth = nrect.width;
    parentHeight = resizer.parentNode.getBoundingClientRect().height;
    parentWidth = resizer.parentNode.getBoundingClientRect().width;
    resizeAreaWidth = prevSiblingWidth + nextSiblingWidth;
    resizeAreaHeight = prevSiblingHeight + nextSiblingHeight;
    ratioHeight = (resizeAreaHeight / parentHeight);
    ratioWidth = (resizeAreaWidth / parentWidth);
    percentHeight = ratioHeight * 100;
    percentWidth = ratioWidth * 100;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    switch (direction) {
      case 'vertical':
        const h =
          ((prevSiblingHeight + dy) * 100) /
          resizer.parentNode.getBoundingClientRect().height;
        if (Math.round(h) <= 0) {
          prevSibling.style.display = 'none'
        } else {
          prevSibling.style.display = 'flex'
        }
        prevSibling.style.height = `${h}%`;
        nextSibling.style.height = `${100 * ratioHeight - h}%`
        break;
      case 'horizontal':
      default:
        const w =
          ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        if (Math.round(w) <= 0) {
          prevSibling.style.display = 'none'
        } else {
          prevSibling.style.display = 'flex'
        }
        prevSibling.style.width = `${w}%`;
        nextSibling.style.width = `${100 * ratioWidth - w}%`
        break;
    }
    const viewResize = new CustomEvent('viewresize', {
      prevSibling: prevSibling,
      nextSibling: nextSibling
    });
    document.dispatchEvent(viewResize);
    const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;

    prevSibling.style.userSelect = 'none';
    prevSibling.style.pointerEvents = 'none';

    nextSibling.style.userSelect = 'none';
    nextSibling.style.pointerEvents = 'none';
  };

  const mouseUpHandler = function () {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    prevSibling.style.removeProperty('user-select');
    prevSibling.style.removeProperty('pointer-events');

    nextSibling.style.removeProperty('user-select');
    nextSibling.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  // Attach the handler
  resizer.addEventListener('mousedown', mouseDownHandler);

};

// Query all resizers
document.querySelectorAll('.resizer').forEach(function (ele) {
  resizable(ele);
});
document.querySelectorAll('.view-grid').forEach(function(ele) {
  autosize(ele);
});

