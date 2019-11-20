import pageTypesModule from 'pageTypes';
import {pageType} from 'pageTypes/selectors';

import createStore from 'createStore';


describe('pageType', () => {
  test('provides selector to get page type config of a page', () => {
    const pageTypesSeed = {video: {name: 'video'}};
    const store = createStore([pageTypesModule], {
      pageTypesSeed
    });

    const result = pageType({page: {type: 'video'}})(store.getState());

    expect(result.name).toBe('video');
  });

  test('allows to get page from selector props', () => {
    const pageTypesSeed = {video: {name: 'video'}};
    const store = createStore([pageTypesModule], {
      pageTypesSeed
    });
    const props = {
      targetPage: {type: 'video'}
    };

    const result = pageType({
      page: props => props.targetPage
    })(store.getState(), props);

    expect(result.name).toBe('video');
  });

  test('return null if page is null', () => {
    const pageTypesSeed = {video: {}};
    const store = createStore([pageTypesModule], {
      pageTypesSeed
    });

    const result = pageType({
      page: props => props.targetPage
    })(store.getState(), {});

    expect(result).toBeNull();
  });
});
