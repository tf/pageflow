pageflow.VideoPlayer.cueSettingsMethods = function(player) {
  player.updateCueLineSettings = function(line, forceUpdate) {
    var value = line.split('.')[0];
    value = value == 'top' ? 1 : value;

    _(player.textTracks()).each(function(textTrack) {
      if (textTrack.mode == 'showing' && textTrack.cues) {
        for (var i = 0; i < textTrack.cues.length; i++) {
          if (textTrack.cues[i].line != value) {
            textTrack.cues[i].line = value;
          }
        }
      }
    });

    if (this.prevLine !== line) {
      player.tech({IWillNotUseThisInPlugins: true}).trigger('texttrackchange');
    }

    this.prevLine = line;
  };
};
