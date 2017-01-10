pageflow.ConfigurationEditorTabView.groups.define('background', function(options) {
  this.input('background_type', pageflow.SelectInputView, {
    values: ['image', 'video'],
    ensureValueDefined: true
  });
  this.input('background_image_id', pageflow.FileInputView, {
    collection: pageflow.imageFiles,
    visibleBinding: 'background_type',
    visibleBindingValue: 'image',
    fileSelectionHandlerOptions: options
  });
  this.input('video_file_id', pageflow.FileInputView, {
    collection: pageflow.videoFiles,
    visibleBinding: 'background_type',
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
  this.input('poster_image_id', pageflow.FileInputView, {
    collection: pageflow.imageFiles,
    visibleBinding: 'background_type',
    visibleBindingValue: 'video',
    fileSelectionHandlerOptions: options
  });
});