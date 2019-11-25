import createStore from '../createStore';

import {call} from 'redux-saga/effects';

import sinon from 'sinon';

describe('createStore', () => {
  test('combines reducers of given Redux modules', () => {
    const options = {};
    const reduxModule = {
      createReducers() {
        return {
          test: function(state, action) {
            return 'new state';
          }
        };
      }
    };

    const store = createStore([reduxModule], options);
    store.dispatch({type: 'ACTION'});

    expect(store.getState()).toEqual({test: 'new state'});
  });

  test('passes options to createReducers function', () => {
    const options = {value: 'new state'};
    const reduxModule = {
      createReducers(options) {
        return {
          test: function(state, action) {
            return options.value;
          }
        };
      }
    };

    const store = createStore([reduxModule], options);
    store.dispatch({type: 'ACTION'});

    expect(store.getState()).toEqual({test: 'new state'});
  });

  test('runs sagas of passed Redux modules', () => {
    const options = {};
    const spy = sinon.spy();
    const reduxModule = {
      createSaga() {
        return function*() {
          yield call(spy);
        };
      }
    };

    createStore([reduxModule], options);

    expect(spy).toHaveBeenCalled();
  });

  test('passes options to saga', () => {
    const options = {some: 'value'};
    const spy = sinon.spy();
    const reduxModule = {
      createSaga(options) {
        return function*() {
          yield call(spy, options.some);
        };
      }
    };

    createStore([reduxModule], options);

    expect(spy).toHaveBeenCalledWith('value');
  });

  test('does not run sagas if isServerSide is true', () => {
    const options = {isServerSide: true};
    const spy = sinon.spy();
    const reduxModule = {
      createSaga() {
        spy();
        return function*() {
          yield call(() => {});
        };
      }
    };

    createStore([reduxModule], options);

    expect(spy).not.toHaveBeenCalled();
  });

  test('calls init function of passed Redux modules', () => {
    const options = {};
    const spy = sinon.spy();
    const reduxModule = {
      init: spy
    };

    createStore([reduxModule], options);

    expect(spy).toHaveBeenCalled();
  });

  test('passes options to init', () => {
    const options = {some: 'value'};
    const spy = sinon.spy();
    const reduxModule = {
      init: spy
    };

    createStore([reduxModule], options);

    expect(spy).toHaveBeenCalledWith(sinon.match(options));
  });

  test('passes dispatch to init', () => {
    const options = {some: 'value'};
    const spy = sinon.spy();
    const reduxModule = {
      createReducers() {
        return {
          test: function(state = {}, action) {
            spy(action);
            return state;
          }
        };
      },

      init({dispatch}) {
        dispatch({type: 'ACTION'});
      }
    };

    createStore([reduxModule], options);

    expect(spy).toHaveBeenCalledWith({type: 'ACTION'});
  });

  test('passes getState to init', () => {
    const options = {};
    let result;
    const reduxModule = {
      createReducers() {
        return {
          test: function(state = 'initial', action) {
            return state;
          }
        };
      },

      init({getState}) {
        result = getState();
      }
    };

    createStore([reduxModule], options);

    expect(result).toEqual({test: 'initial'});
  });

  test('lets redux module define custom middleware', () => {
    const options = {};
    const spy = sinon.spy();
    const reduxModule = {
      createMiddleware(options) {
        return function({getState}) {
          return next => action => {
            spy(action.type);
            return next(action);
          };
        };
      }
    };

    const store = createStore([reduxModule], options);
    store.dispatch({type: 'ACTION'});

    expect(spy).toHaveBeenCalledWith('ACTION');
  });

  test('passes options to createMiddleware', () => {
    const options = {some: 'value'};
    const spy = sinon.spy();
    const reduxModule = {
      createMiddleware(options) {
        return function({getState}) {
          return next => action => {
            spy(options.some);
            return next(action);
          };
        };
      }
    };

    const store = createStore([reduxModule], options);
    store.dispatch({type: 'ACTION'});

    expect(spy).toHaveBeenCalledWith('value');
  });
});
