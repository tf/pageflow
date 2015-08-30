pageflow.StorylineOutlineView = Backbone.Marionette.Layout.extend({
  template: 'templates/storyline_outline',
  className: 'storyline_outline',

  ui: {
    chapters: 'ul.storyline_outline_chapters'
  },

  events: {
    'click a.add_chapter': function() {
      this.model.addChapter();
    }
  },

  onRender: function() {
    new pageflow.SortableCollectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: pageflow.NavigatableChapterItemView,
      itemViewOptions: {
        sortable: true,
        pageItemViewOptions: {
          displayInNavigationHint: true
        }
      }
    }).render();
  }
});