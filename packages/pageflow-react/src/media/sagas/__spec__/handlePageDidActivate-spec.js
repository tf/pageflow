import handlePageDidActivate from '../handlePageDidActivate';
import {PREBUFFER, PLAY, actionCreators} from '../../actions';
import {pageDidActivate, pageWillDeactivate} from 'pages/actions';
import backgroundMediaModule from 'backgroundMedia';
import {mute as backgroundMediaMute, unmute as backgroundMediaUnmute} from 'backgroundMedia/actions';

import {delay} from 'redux-saga';

import {runSagaInPageScope} from 'support/sagas';
import sinon from 'sinon';

const {prebuffered} = actionCreators();

describe('handlePageDidActivate', () => {
  function initialState(backgroundMedia = {}) {
    return {backgroundMedia};
  }

  test('prebuffers when page did activate', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .dispatch(pageDidActivate());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PREBUFFER}));
  });

  test('plays video once it is prebuffered', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  test('does not play video once prebuffered if autoplay is false', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}],
      page: {attributes: {autoplay: false}}
    })
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  test('does not play video once prebuffered if background media muted', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .stubCall(delay)
      .dispatch(backgroundMediaMute())
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  test('supports option to play even if background media muted', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{
        autoplayWhenBackgroundMediaMuted: true,
        canAutoplay: true
      }]
    })
      .stubCall(delay)
      .dispatch(backgroundMediaMute())
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  describe('with retryOnUnmute option', () => {
    test('plays media once unmuted', () => {
      const run = runSagaInPageScope(handlePageDidActivate, {
        reduxModules: [backgroundMediaModule],
        args: [{
          retryOnUnmute: true,
          canAutoplay: true
        }]
      })
        .stubCall(delay)
        .dispatch(backgroundMediaMute())
        .dispatch(pageDidActivate())
        .dispatch(backgroundMediaUnmute())
        .dispatch(prebuffered());

      expect(run.put).to.have.been.calledWith(sinon.match({type: PLAY}));
    });

    test('does not retry if page has been deactivated', () => {
      const run = runSagaInPageScope(handlePageDidActivate, {
        reduxModules: [backgroundMediaModule],
        args: [{
          retryOnUnmute: true,
          canAutoplay: true
        }]
      })
        .stubCall(delay)
        .dispatch(backgroundMediaMute())
        .dispatch(pageDidActivate())
        .dispatch(pageWillDeactivate())
        .dispatch(backgroundMediaUnmute())
        .dispatch(prebuffered());

      expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
    });

    test('does not retry if autoplay is false', () => {
      const run = runSagaInPageScope(handlePageDidActivate, {
        reduxModules: [backgroundMediaModule],
        page: {attributes: {autoplay: false}},
        args: [{
          retryOnUnmute: true,
          canAutoplay: true,
        }]
      })
        .stubCall(delay)
        .dispatch(backgroundMediaMute())
        .dispatch(pageDidActivate())
        .dispatch(backgroundMediaUnmute())
        .dispatch(prebuffered());

      expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
    });
  });

  test('does not play video if page is deactivated while prebuffering', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(pageWillDeactivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });
});
