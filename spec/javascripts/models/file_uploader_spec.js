describe('Entry', function() {
  beforeEach(function() {
    pageflow.editor = new pageflow.EditorApi();

    pageflow.editor.fileTypes.register('image_files', {
      model: pageflow.ImageFile,
      matchUpload: /^image/
    });

    pageflow.editor.fileTypes.setup([{
      collectionName: 'image_files',
      typeName: 'Pageflow::ImageFile'
    }]);
    this.imageFileType = pageflow.editor.fileTypes.first();
  });

  describe('#addFileUpload', function() {
    it('adds file to files collection of file type', function() {
      var entry = buildEntry({}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var file_uploader = new pageflow.FileUploader();
      var upload = {name: 'image.png', type: 'image/png'};

      var file = file_uploader.addFileUpload(upload, entry);

      expect(entry.getFileCollection(this.imageFileType).length).to.eq(1);
    });
  });

  function buildEntry(attributes, options) {
    return new pageflow.Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection()
    }, options));
  }
});
