import reducer from '../reducer';
import {init} from '../actions';

import {expect} from 'support/chai';

describe('reducer', () => {
  test('sets locale on init', () => {
    const result = reducer(undefined, init({locale: 'fr'}));

    expect(result.locale).toBe('fr');
  });

  test('keeps state on other action', () => {
    const state = {locale: 'fr'};
    const result = reducer(state, {type: 'other'});

    expect(result).toBe(state);
  });
});
