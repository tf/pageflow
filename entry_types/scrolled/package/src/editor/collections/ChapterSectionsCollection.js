import {SubsetCollection, orderedCollection} from 'pageflow/editor';

export const ChapterSectionsCollection = SubsetCollection.extend({
  mixins: [orderedCollection],

  constructor: function(options) {
    var chapter = options.chapter;

    SubsetCollection.prototype.constructor.call(this, {
      parent: options.sections,
      parentModel: chapter,

      filter: function(item) {
        return !chapter.isNew() && item.get('chapterId') === chapter.id;
      },

      comparator: function(item) {
        return item.get('position');
      }
    });

    this.listenTo(this, 'add', function(model) {
      model.set('chapterId', chapter.id);
    });

    this.listenTo(chapter, 'destroy', function() {
      this.clear();
    });
  }
});
