import loadFromSeed from '../loadFromSeed';
import {RESET} from '../actions';

import sinon from 'sinon';

describe('loadFromSeed', () => {
  test('dispatches reset action initially', () => {
    const post = {title: 'News'};
    const collection = [post];
    const dispatch = sinon.spy();

    loadFromSeed({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['title']
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        collectionName: 'posts',
        items: [post]
      }
    }));
  });

  test('camelized attribute', () => {
    const post = {long_title: 'News'};
    const collection = [post];
    const dispatch = sinon.spy();

    loadFromSeed({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['long_title']
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        items: [{longTitle: 'News'}]
      }
    }));
  });

  test('supports mapping attribute names', () => {
    const post = {post_type: 'gallery'};
    const collection = [post];
    const dispatch = sinon.spy();

    loadFromSeed({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: [{type: 'post_type'}]
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        items: [{type: 'gallery'}]
      }
    }));
  });

  test('supports including configuration attributes', () => {
    const post = {configuration: {some: 'setting'}};
    const collection = [post];
    const dispatch = sinon.spy();

    loadFromSeed({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: [],
      includeConfiguration: true
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        items: [{some: 'setting'}]
      }
    }));
  });
});
