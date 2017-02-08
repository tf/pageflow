//= require ./media_player

//= require_self

//= require ./video_player/ensure_android_native_controls_can_be_display_via_touch
//= require ./video_player/dash
//= require ./video_player/media_events
//= require ./video_player/prebuffering
//= require ./video_player/buffer_underrun_waiting
//= require ./video_player/fullscreen_during_phone_playback
//= require ./video_player/use_slim_controls_during_phone_playback
//= require ./video_player/filter_sources
//= require ./video_player/lazy

pageflow.VideoPlayer = function(element, options) {
  options = options || {};

  element = pageflow.VideoPlayer.filterSources(element);
  var player = videojs(element, options);

  if (options.fullscreenDuringPhonePlayback) {
    pageflow.VideoPlayer.fullscreenDuringPhonePlayback(player);
  }

  if (options.useSlimPlayerControlsDuringPhonePlayback) {
    pageflow.mediaPlayer.useSlimPlayerControlsDuringPhonePlayback(player);
  }

  pageflow.VideoPlayer.prebuffering(player);

  if (options.mediaEvents) {
    pageflow.VideoPlayer.mediaEvents(player, options.context);
  }

  if (options.bufferUnderrunWaiting) {
    pageflow.VideoPlayer.bufferUnderrunWaiting(player);
  }

  pageflow.mediaPlayer.enhance(player, options);

  return player;
};