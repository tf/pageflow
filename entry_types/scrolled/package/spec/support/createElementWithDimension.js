export function createElementWithDimension({
  viewportLeft = 0, viewportTop = 0, offsetLeft = 0, offsetTop = 0, width = 100, height = 100
}) {
  const el = document.createElement('div');

  el.getBoundingClientRect = function() {
    return {
      left: viewportLeft,
      top: viewportTop,
      right: viewportLeft + width,
      bottom: viewportTop + height,
      width,
      height
    }
  };

  Object.defineProperties(el, {
    offsetLeft: {
      get() { return offsetLeft; }
    },
    offsetTop: {
      get() { return offsetTop; }
    },
    offsetWidth: {
      get() { return width; }
    },
    offsetHeight: {
      get() { return height; }
    }
  });

  return el;
}
