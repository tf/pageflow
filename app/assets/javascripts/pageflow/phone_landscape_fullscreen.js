pageflow.phoneLandscapeFullscreen = function() {
  if (window.screen.orientation) {
    pageflow.ready.then(function() {
      if (pageflow.browser.has('phone platform') &&
          !pageflow.browser.has('iphone platform')) {

        window.screen.orientation.onchange = function() {
          if (isLandscape()) {
            requestFullscreen(document.body);
          }
          else {
            exitFullscreen();
          }
        };
      }
    });
  }

  function isLandscape() {
    return window.orientation == 90 || window.orientation == -90;
  }

  function requestFullscreen(el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
    else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    }
    else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
    else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document.mozExitFullScreen) {
      document.mozExitFullScreen();
    }
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};