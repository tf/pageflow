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
        return this.indentation(storyline) + storyline.title();
      }, this),
      groups: pageflow.storylines.reduce(function(result, storyline) {
        if (storyline.isMain() || storyline.parentPage()) {
           result.push(_.last(result));
        }
        else {
           result.push('Ohne übergeordnete Seite');
        }
        return result;
      }, [])
    }));

    this.load();
  },

  load: function() {
    var storyline = pageflow.storylines.get(this.model.get('storyline_id'));

    this.mainRegion.show(new pageflow.StorylineOutlineView({
      model: storyline
    }));
  },

  indentation: function(storyline) {
    return _(storyline.get('level')).times(function() {
      return '\u00A0\u00A0\u00A0';
    }).join('');
  }
});