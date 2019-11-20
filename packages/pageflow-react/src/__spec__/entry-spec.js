import entryModule from 'entry';
import {entryAttribute, isEntryReady} from 'entry/selectors';
import createStore from 'createStore';
import Backbone from 'backbone';


describe('entry', () => {
  function setup({entry} = {entry: {}}) {
    const events = {...Backbone.Events};
    const store = createStore([entryModule], {events, entry});

    return {
      events,

      select(selector) {
        return selector(store.getState());
      }
    };
  }

  test('provides selector to get slug', () => {
    const entry = {
      slug: 'my-entry'
    };
    const {select} = setup({entry});

    expect(select(entryAttribute('slug'))).toBe('my-entry');
  });

  test('provides selector to get title from seed', () => {
    const entry = {
      title: 'Some Title'
    };
    const {select} = setup({entry});

    expect(select(entryAttribute('title'))).toBe('Some Title');
  });

  test(
    'provides selector to get title from Backbone model configuration',
    () => {
      const entry = new Backbone.Model({
        entry_title: 'Title from Entry'
      });
      entry.configuration = new Backbone.Model({
        title: 'Title from Revision'
      });
      const {select} = setup({entry});

      expect(select(entryAttribute('title'))).toBe('Title from Revision');
    }
  );

  test(
    'Backbone model title selector falls back to entry_title attribute',
    () => {
      const entry = new Backbone.Model({
        entry_title: 'Some Title'
      });
      entry.configuration = new Backbone.Model();
      const {select} = setup({entry});

      expect(select(entryAttribute('title'))).toBe('Some Title');
    }
  );

  test('title selector gets correct value after configuration change', () => {
    const entry = new Backbone.Model();
    entry.configuration =  new Backbone.Model({
      title: 'Some Title'
    });
    const {select} = setup({entry});

    entry.configuration.set('title', 'New Title');

    expect(select(entryAttribute('title'))).toBe('New Title');
  });

  test('sets isEntryReady to false by default', () => {
    const {select} = setup();

    const result = select(isEntryReady);

    expect(result).toBe(false);
  });

  test('changes isEntryReady to true on ready event', () => {
    const {select, events} = setup();

    events.trigger('ready');
    const result = select(isEntryReady, events);

    expect(result).toBe(true);
  });
});
