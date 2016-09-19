pageflow.VideoSettingsTabView = Backbone.Marionette.ItemView.extend({
  template: 'templates/video_settings_tab',
  name: 'video_settings_tab',

  ui: {
    fileName: '.file_name',

    rights: 'input.rights',
    altText: 'input.alt_text',
    metaData: 'tbody.attributes',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },

  events: {
    'change': 'save'
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.update();

    _.each(this.metaDataViews(), function(view) {
      this.ui.metaData.append(this.subview(view).el);
    }, this);
  },

  update: function() {
    this.ui.fileName.text(this.model.get('file_name') || '(Unbekannt)');

    this.ui.rights.val(this.model.get('rights'));
    this.ui.rights.attr('placeholder', pageflow.entry.get('default_file_rights'));

    this.ui.altText.val(this.model.get('alt_text'));

    this.ui.downloadLink.attr('href', this.model.get('original_url'));
    this.ui.downloads.toggle(this.model.isUploaded());
  },

  save: function() {
    this.model.save({
      rights: this.ui.rights.val(),
      alt_text: this.ui.altText.val()
    });
  },

  metaDataViews: function() {
    var model = this.model;

    return _.map(this.metaDataAttributes(), function(attribute) {
      return new pageflow.FileMetaDataItemView({
        model: model,
        attribute: attribute
      });
    });
  },

  metaDataAttributes: function() {
    return this.model.fileType().metaDataAttributes;
  }
});
