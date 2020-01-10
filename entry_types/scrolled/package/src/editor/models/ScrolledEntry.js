import {Entry} from 'pageflow/editor';

import {ChaptersCollection, SectionsCollection, ContentElementsCollection} from '../collections';

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
    this.sections = new SectionsCollection(seed.collections.sections,);
    this.chapters = new ChaptersCollection(seed.collections.chapters,
                                           {sections: this.sections});

    this.scrolledSeed = seed;
  },

  supportsPhoneEmulation() {
    return true;
  }
});
