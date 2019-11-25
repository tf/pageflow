import createFirstItemSelector from '../createFirstItemSelector';

import {expect} from 'support/chai';

describe('createFirstItemSelector', () => {
  describe('creates selector that', () => {
    test('can look up first collection item', () => {
      const state = {
        posts: {
          order: [5, 4],
          items: {
            4: {id: 4, title: 'Minor news'},
            5: {id: 5, title: 'Big news'}
          }
        }
      };
      const selector = createFirstItemSelector('posts');

      const result = selector(state);

      expect(result.id).toBe(5);
    });

    test('returns undefined for empty collection', () => {
      const state = {
        posts: {
          order: [],
          items: {}
        }
      };
      const selector = createFirstItemSelector('posts');

      const result = selector(state);

      expect(result).toBeUndefined();
    });

    describe('with namespace option', () => {
      test('can look up first item in namespace', () => {
        const state = {
          myNamespace: {
            posts: {
              order: [4, 5],
              items: {
                4: {id: 4, title: 'Minor news'},
                5: {id: 5, title: 'Big news'}
              }
            }
          }
        };
        const selector = createFirstItemSelector('posts', {namespace: 'myNamespace'});

        const result = selector(state);

        expect(result.id).toBe(4);
      });

      test('throws descriptive error if namespace is unknown', () => {
        const state = {
        };
        const selector = createFirstItemSelector('items', {namespace: 'ufos'});

        expect(() => {
          selector(state);
        }).toThrowError(/unknown namespace/);
      });
    });
  });
});
