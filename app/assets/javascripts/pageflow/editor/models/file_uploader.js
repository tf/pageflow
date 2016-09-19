pageflow.FileUploader = pageflow.Object.extend({
  initialize: function() {},

  addFileUpload: function(upload, entry) {
    var fileType = pageflow.editor.fileTypes.findByUpload(upload);
    var file = new fileType.model({
      state: 'uploading',
      file_name: upload.name
    });

    entry.getFileCollection(fileType).add(file);

    return file;
  }
});
