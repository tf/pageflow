pageflow.TextTrackTabView = Backbone.Marionette.ItemView.extend({
  template: 'templates/text_track_tab',
  name: 'text_track_tab',

  ui: {
    fileName: '.file_name',
    textTracks: 'tbody'
  },

  onRender: function() {
    this.update();

    var textTracks = this.model.nestedFiles('text_track_files');

    this.subview(new pageflow.CollectionView({
      el: this.ui.textTracks,
      collection: textTracks,
      itemViewConstructor: pageflow.NestedTextTrackItemView
    }));
  },

  update: function() {
    this.ui.fileName.text(this.model.get('file_name') || 'Unbekannt');
  }
});
