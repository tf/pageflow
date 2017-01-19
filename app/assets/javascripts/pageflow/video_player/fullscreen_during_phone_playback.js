pageflow.VideoPlayer.fullscreenDuringPhonePlayback = function(player) {
  var fullscreenChangeEvent = 'fullscreenchange mozfullscreenchange webkitfullscreenchange';
  var originalPlay = player.play;

  player.play = function() {
    if (pageflow.browser.has('phone platform') &&
        !pageflow.browser.has('iphone platform') &&
        !player.isAudio()) {

      var el = $(player.tech({IWillNotUseThisInPlugins: true}).el()).parents('section')[0];

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

      player.one('pause', function() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        else if (document.mozExitFullScreen) {
          document.mozExitFullScreen();
        }
        else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      });
    }

    originalPlay.apply(this, arguments);
  };

  function pauseOnExitFullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreen && !document.webkitIsFullScreen) {
      player.pause();
      $(document).off(fullscreenChangeEvent, pauseOnExitFullscreen);
    }
  }
};