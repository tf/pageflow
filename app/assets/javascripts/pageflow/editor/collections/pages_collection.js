pageflow.PagesCollection = Backbone.Collection.extend({
  model: pageflow.Page,

  url: '/pages',

  comparator: function(pageA, pageB) {
    if (pageA.storylinePosition() > pageB.storylinePosition()) {
      return 1;
    }
    else if (pageA.storylinePosition() < pageB.storylinePosition()) {
      return -1;
    }
    else if (pageA.chapterPosition() > pageB.chapterPosition()) {
      return 1;
    }
    else if (pageA.chapterPosition() < pageB.chapterPosition()) {
      return -1;
    }
    else if (pageA.get('position') > pageB.get('position')) {
      return 1;
    }
    else if (pageA.get('position') < pageB.get('position')) {
      return -1;
    }
    else {
      return 0;
    }
  },

  getByPermaId: function(permaId) {
    return this.findWhere({perma_id: parseInt(permaId, 10)});
  },

  persisted: function() {
    if (!this._persisted) {
      this._persisted = new pageflow.SubsetCollection({
        parent: this,

        filter: function(page) {
          return !page.isNew();
        },
      });

      this.listenTo(this, 'change:id', function(model) {
        console.log('page got id',  model.get('id'), model.get('perma_id'));

        setTimeout(_.bind(function() {
          console.log('addes persisted page',  model.get('perma_id'));
          this._persisted.add(model);
        }, this), 0);
      });
    }

    return this._persisted;
  },
});
