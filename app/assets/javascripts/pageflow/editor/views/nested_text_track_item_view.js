pageflow.NestedTextTrackItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'tr',
  template: 'templates/nested_text_track_item',

  ui: {
    label: 'td.label',
    language: 'td.srclang',
    kind: 'td.kind'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.label.text(this.model.get('label'));
    this.ui.language.text(this.model.get('srclang'));
    this.ui.kind.text(this.model.get('kind'));
  }
});
