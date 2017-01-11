pageflow.VideoPlayer.requestNativePlayerOnPhoneMethod = function(player) {
  var fullscreenChangeEvent = 'fullscreenchange mozfullscreenchange webkitfullscreenchange';

  player.requestNativePlayerOnPhone = function() {
    if (pageflow.browser.has('phone platform')) {
      var el = player.tech({IWillNotUseThisInPlugins: true}).el();

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

      $(document).on(fullscreenChangeEvent, pauseOnExitFullscreen);
    }
  };

  function pauseOnExitFullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreen && !document.webkitIsFullScreen) {
      player.pause();
      $(document).off(fullscreenChangeEvent, pauseOnExitFullscreen);
    }
  }
};