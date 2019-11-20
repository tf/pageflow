import reducer from '../reducer';
import {update} from '../actions';


describe('entry reducer', () => {
  test('sets slug on update', () => {
    const entry = {slug: 'my-entry'};
    const result = reducer(undefined, update({entry}));

    expect(result.slug).toBe('my-entry');
  });

  test('keeps state on other action', () => {
    const state = {slug: 'my-entry'};
    const result = reducer(state, {type: 'other'});

    expect(result).toBe(state);
  });
});
