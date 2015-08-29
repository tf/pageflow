pageflow.StorylinesCollection = Backbone.Collection.extend({
  autoConsolidatePositions: false,

  mixins: [pageflow.orderedCollection],

  model: pageflow.Storyline,

  url: function() {
    return '/entries/' + pageflow.entry.get('id') + '/storylines';
  },

  main: function() {
    return this.find(function(storyline) {
      return storyline.configuration.get('main');
    }) || this.first();
  },

  comparator: function(chapter) {
    return chapter.get('position');
  }
});