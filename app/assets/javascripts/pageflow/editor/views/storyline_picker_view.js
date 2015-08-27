pageflow.StorylinePickerView = Backbone.Marionette.Layout.extend({
  template: 'templates/storyline_picker',
  className: 'storyline_picker',

  regions: {
    selectRegion: '.storyline_picker_select_region',
    mainRegion: '.storyline_picker_main_region'
  },

  initialize: function() {
    this.model = new Backbone.Model({
      storyline_id: pageflow.storylines.first().id
    });

    this.listenTo(this.model, 'change', this.load);
  },

  onRender: function() {
    this.selectRegion.show(new pageflow.SelectInputView({
      model: this.model,
      label: 'Erzählstränge',
      propertyName: 'storyline_id',
      values: pageflow.storylines.pluck('id'),
      texts: pageflow.storylines.map(function(storyline) {
        return storyline.title();
      })
    }));

    this.load();
  },

  load: function() {
    var storyline = pageflow.storylines.get(this.model.get('storyline_id'));

    this.mainRegion.show(new pageflow.StorylineOutlineView({
      model: storyline
    }));
  }
});