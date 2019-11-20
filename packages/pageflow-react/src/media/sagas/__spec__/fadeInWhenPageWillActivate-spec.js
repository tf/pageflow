import fadeInWhenPageWillActivate from '../fadeInWhenPageWillActivate';
import {PREBUFFER, PLAY, CHANGE_VOLUME_FACTOR, actionCreators} from '../../actions';
import {pageWillActivate, pageDidActivate, pageWillDeactivate} from 'pages/actions';
import backgroundMediaModule from 'backgroundMedia';

import {delay} from 'redux-saga';

import {runSagaInPageScope} from 'support/sagas';
import sinon from 'sinon';

const {prebuffered} = actionCreators();

describe('fadeInWhenPageWillActivate', () => {
  test('prebuffers when page will activate', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(pageWillActivate());

    expect(run.put).toHaveBeenCalledWith(action(PREBUFFER));
  });

  test('does not play video before it is prebuffered', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(pageWillActivate());

    expect(run.put).not.toHaveBeenCalledWith(action(PLAY));
  });

  test('plays video silently once it is prebuffered', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .stubCall(delay)
      .dispatch(pageWillActivate())
      .dispatch(prebuffered());

    expect(run.put).toHaveBeenCalledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 0}));
    expect(run.put).toHaveBeenCalledWith(action(PLAY));
  });

  test(
    'does not play video if page is deactivated before video is prebuffered',
    () => {
      const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
        reduxModules: [backgroundMediaModule]
      })
        .dispatch(pageWillActivate())
        .dispatch(pageWillDeactivate())
        .dispatch(prebuffered());

      expect(run.put).not.toHaveBeenCalledWith(action(PLAY));
    }
  );

  test('does not turn up volume before video is prebuffered', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(pageWillActivate());

    expect(run.put).not.toHaveBeenCalledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  test('does not turn up volume before page did activate', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(prebuffered());

    expect(run.put).not.toHaveBeenCalledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  test('turns up volume when video is prebuffered and page did acticate', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .stubCall(delay)
      .dispatch(pageWillActivate())
      .dispatch(prebuffered())
      .dispatch(pageDidActivate());

    expect(run.put).toHaveBeenCalledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  test('does not turn up volume when page is deactivated again', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .stubCall(delay)
      .dispatch(pageWillActivate())
      .dispatch(pageDidActivate())
      .dispatch(pageWillDeactivate())
      .dispatch(prebuffered());

    expect(run.put).not.toHaveBeenCalledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  function action(type, payload = {}) {
    return sinon.match({type, payload});
  }
});
