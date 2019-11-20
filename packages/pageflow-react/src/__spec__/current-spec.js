import currentModule from 'current';
import storylinesModule from 'storylines';
import chaptersModule from 'chapters';
import pagesModule from 'pages';

import {currentParentPageAttributes,
        currentParentChapterAttributes} from 'current/selectors';

import {pageChange} from 'current/actions';

import createStore from 'createStore';


describe('current', () => {
  function createStoreFromSeed(collections) {
    const events = {on() {}};

    return createStore([
      currentModule,
      storylinesModule,
      chaptersModule,
      pagesModule
    ], {...collections, events});
  }

  describe('currentParentPageAttributes', () => {
    test('returns attributes of current parent page', () => {
      const store = createStoreFromSeed({
        storylines: [
          {id: 100},
          {id: 200, configuration: {parent_page_perma_id: 1}}
        ],
        chapters: [
          {id: 10, storyline_id: 100},
          {id: 20, storyline_id: 200}
        ],
        pages: [
          {perma_id: 1, chapter_id: 10},
          {perma_id: 2, chapter_id: 20}
        ]
      });

      store.dispatch(pageChange({id: 2}));

      const result = currentParentPageAttributes()(store.getState());

      expect(result.permaId).toBe(1);
    });

    test('returns null if current storyline does not have parent page', () => {
      const store = createStoreFromSeed({
        storylines: [
          {id: 100}
        ],
        chapters: [
          {id: 10, storyline_id: 100}
        ],
        pages: [
          {perma_id: 1, chapter_id: 10}
        ]
      });

      store.dispatch(pageChange({id: 1}));

      const result = currentParentPageAttributes()(store.getState());

      expect(result).toBeNull();
    });
  });

  describe('currentParentChapterAttributes', () => {
    test('returns attributes of current parent chapter', () => {
      const store = createStoreFromSeed({
        storylines: [
          {id: 100},
          {id: 200, configuration: {parent_page_perma_id: 1}}
        ],
        chapters: [
          {id: 10, storyline_id: 100, title: 'Overview'},
          {id: 20, storyline_id: 200}
        ],
        pages: [
          {perma_id: 1, chapter_id: 10},
          {perma_id: 2, chapter_id: 20}
        ]
      });

      store.dispatch(pageChange({id: 2}));

      const result = currentParentChapterAttributes()(store.getState());

      expect(result.title).toBe('Overview');
    });

    test('returns null if current storyline does not have parent page', () => {
      const store = createStoreFromSeed({
        storylines: [
          {id: 100}
        ],
        chapters: [
          {id: 10, storyline_id: 100}
        ],
        pages: [
          {perma_id: 1, chapter_id: 10}
        ]
      });

      store.dispatch(pageChange({id: 1}));

      const result = currentParentChapterAttributes()(store.getState());

      expect(result).toBeNull();
    });
  });
});
