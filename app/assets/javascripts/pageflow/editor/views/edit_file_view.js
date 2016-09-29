pageflow.EditFileView = Backbone.Marionette.ItemView.extend({
  template: 'templates/edit_file',
  className: 'edit_file',

  onRender: function() {
    var fileType = this.model.fileType();

    var tab = new pageflow.ConfigurationEditorTabView({
      model: this.model,
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.files.attributes.' + fileType.collectionName,
        'pageflow.editor.files.common_attributes'
      ]
    });

    tab.input('file_name', pageflow.TextInputView, {
      model: this.model,
      disabled: true
    });

    tab.input('rights', pageflow.TextInputView, {
      model: this.model,
      placeholder: pageflow.entry.get('default_file_rights')
    });

    this.appendSubview(tab);
  }
});
