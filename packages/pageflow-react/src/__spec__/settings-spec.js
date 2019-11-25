import settingsModule from 'settings';
import {update} from 'settings/actions';
import {setting} from 'settings/selectors';
import createStore from 'createStore';

import {combineReducers} from 'redux';
import Backbone from 'backbone';

import {expect} from 'support/chai';

describe('settings', () => {
  test('initializes the store when calling watch', () => {
    const model = new Backbone.Model({volume: 0.7});
    const store = createStore([settingsModule], {settings: model});

    const result = setting({property: 'volume'})(store.getState());

    expect(result).toBe(0.7);
  });

  test('keeps the store in sync when settings change', () => {
    const model = new Backbone.Model({volume: 0.7});
    const store = createStore([settingsModule], {settings: model});

    model.set('volume', 0);

    const result = setting({property: 'volume'})(store.getState());

    expect(result).toBe(0);
  });

  test('allows updating settings', () => {
    const model = new Backbone.Model({volume: 0.7});
    const store = createStore([settingsModule], {settings: model});

    store.dispatch(update({property: 'volume', value: 0}));
    const result = setting({property: 'volume'})(store.getState());

    expect(result).toBe(0);
  });

  test('syncs updates back to model', () => {
    const model = new Backbone.Model({volume: 0.7});
    const store = createStore([settingsModule], {settings: model});

    store.dispatch(update({property: 'volume', value: 0}));

    expect(model.get('volume')).toBe(0);
  });
});
