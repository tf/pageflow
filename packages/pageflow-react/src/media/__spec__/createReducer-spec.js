import createReducer from '../createReducer';

import {actionCreators} from '../actions';


describe('createReducer creates function that', () => {
  test('handles actions for given media scope', () => {
    const {play} = actionCreators({scope: 'custom'});
    const reducer = createReducer({scope: 'custom'});

    const nextState = reducer({}, play());

    expect(nextState.shouldPlay).toBe(true);
  });

  test('ignores actions for other media scope', () => {
    const {play} = actionCreators({scope: 'other'});
    const reducer = createReducer({scope: 'custom'});

    const nextState = reducer({}, play());

    expect(nextState.shouldPlay).not.toBe(true);
  });

  describe('for TIME_UPDATE action', () => {
    test('updates currentTime', () => {
      const {timeUpdate} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({currentTime: 30},
                                timeUpdate({currentTime: 40, duration: 60}));

      expect(nextState.currentTime).toBe(40);
    });

    test('updates duration', () => {
      const {timeUpdate} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({}, timeUpdate({currentTime: 40, duration: 60}));

      expect(nextState.duration).toBe(60);
    });
  });

  describe('for PROGRESS action', () => {
    test('updates bufferedEnd', () => {
      const {progress} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({}, progress({bufferedEnd: 40}));

      expect(nextState.bufferedEnd).toBe(40);
    });
  });

  describe('for META_DATA_LOADED action', () => {
    test('updates duration', () => {
      const {metaDataLoaded} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({}, metaDataLoaded({duration: 50}));

      expect(nextState.duration).toBe(50);
    });
  });

  test('sets playFailed to true on PLAY_FAILED action', () => {
    const {playFailed} = actionCreators();
    const reducer = createReducer();

    const nextState = reducer({}, playFailed());

    expect(nextState.playFailed).toBe(true);
  });

  test('makes state look unplayed again in PLAY_FAILED action', () => {
    const {play, playFailed} = actionCreators();
    const reducer = createReducer();

    let state = {};
    state = reducer(state, play());
    state = reducer(state, playFailed());

    expect(state.shouldPlay).toBe(false);
    expect(state.unplayed).toBe(true);
  });

  test('resets playFailed on PLAY action', () => {
    const {play} = actionCreators();
    const reducer = createReducer();

    const nextState = reducer({playFailed: true}, play());

    expect(nextState.playFailed).toBe(false);
  });

  test('sets shouldPlay to true on PLAY', () => {
    const {play} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());

    expect(state.shouldPlay).toBe(true);
  });

  test(
    'sets shouldPlay to true on PLAYING even if play started playing by itself',
    () => {
      const {playing} = actionCreators();
      const reducer = createReducer();
      var state = {};

      state = reducer(state, playing());

      expect(state.shouldPlay).toBe(true);
    }
  );

  test('resets shouldPlay to false on PAUSE', () => {
    const {play, pause} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, pause());

    expect(state.shouldPlay).toBe(false);
  });

  test(
    'sets shouldPlay to false on PAUSED even if player pauses by itself',
    () => {
      const {play, playing, paused} = actionCreators();
      const reducer = createReducer();
      var state = {};

      state = reducer(state, play());
      state = reducer(state, playing());
      state = reducer(state, paused());

      expect(state.shouldPlay).toBe(false);
    }
  );

  test('resets shouldPlay to false on ENDED', () => {
    const {play, playing, ended} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, playing());
    state = reducer(state, ended());

    expect(state.shouldPlay).toBe(false);
  });

  test('leaves shouldPlay true on PAUSED action during buffer underuns', () => {
    const {play, paused, bufferUnderrun} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, bufferUnderrun());
    state = reducer(state, paused());

    expect(state.shouldPlay).toBe(true);
  });

  test(
    'sets shouldPlay to false on PAUSED action again after buffer underun',
    () => {
      const {play, paused, bufferUnderrun, bufferUnderrunContinue} = actionCreators();
      const reducer = createReducer();
      var state = {};

      state = reducer(state, play());
      state = reducer(state, bufferUnderrun());
      state = reducer(state, bufferUnderrunContinue());
      state = reducer(state, paused());

      expect(state.shouldPlay).toBe(false);
    }
  );


  test('sets isPlaying to true on PLAYING action', () => {
    const {playing} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());

    expect(state.isPlaying).toBe(true);
  });

  test('resets isPlaying to false on PAUSED action', () => {
    const {playing, paused} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());
    state = reducer(state, paused());

    expect(state.isPlaying).toBe(false);
  });

  test('resets isPlaying to false on ENDED action', () => {
    const {playing, ended} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());
    state = reducer(state, ended());

    expect(state.isPlaying).toBe(false);
  });

  test('does not change isPlaying on actions that only intend to play', () => {
    const {paused, play, playAndFadeIn} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, paused());
    state = reducer(state, play());
    state = reducer(state, playAndFadeIn({fadeDuration: 1000}));

    expect(state.isPlaying).toBe(false);
  });

  test('does not change isPlaying on actions that only intend to pause', () => {
    const {playing, pause, fadeOutAndPause} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());
    state = reducer(state, pause());
    state = reducer(state, fadeOutAndPause({fadeDuration: 1000}));

    expect(state.isPlaying).toBe(true);
  });
});
