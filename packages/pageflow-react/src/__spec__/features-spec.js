import featuresModule from '../features';
import {isFeatureEnabled} from '../features/selectors';
import createStore from 'createStore';

import {expect} from 'support';

describe('features', () => {
  function setup({enabledFeatureNames}) {
    const store = createStore([featuresModule], {enabledFeatureNames});

    return {
      select(selector) {
        return selector(store.getState());
      }
    };
  }

  test('provides selector to get feature state', () => {
    const {select} = setup({enabledFeatureNames: ['some_feature']});

    expect(select(isFeatureEnabled('some_feature'))).toBe(true);
    expect(select(isFeatureEnabled('other_feature'))).toBe(false);
  });
});
