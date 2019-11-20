import createItemsSelector from '../createItemsSelector';

import {expect} from 'support/chai';

describe('createItemsSelector', () => {
  describe('creates selector that', () => {
    test('can look up item collection', () => {
      const state = {
        posts: {
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        }
      };
      const selector = createItemsSelector('posts');

      const result = selector(state);

      expect(result).toBe(state.posts.items);
    });

    test('return empty object if collection with name exists', () => {
      const state = {
        posts: {}
      };
      const selector = createItemsSelector('posts');

      const result = selector(state);

      expect(result).toEqual({});
    });

    describe('with namespace option', () => {
      test('can look up items in namespace', () => {
        const state = {
          myNamespace: {
            posts: {
              items: {
                4: {id: 4, title: 'Minor news'},
                5: {id: 5, title: 'Big news'}
              }
            }
          }
        };
        const selector = createItemsSelector('posts', {namespace: 'myNamespace'});

        const result = selector(state);

        expect(result).toBe(state.myNamespace.posts.items);
      });

      test('throws descriptive error if namespace is unknown', () => {
        const state = {
        };
        const selector = createItemsSelector('items', {namespace: 'ufos'});

        expect(() => {
          selector(state);
        }).toThrowError(/unknown namespace/);
      });
    });
  });
});
