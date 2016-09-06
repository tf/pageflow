describe('FileCollection', function() {
  var Model = pageflow.UploadedFile.extend({});

  describe('.createForFileTypes', function() {

    it('creates file collections index by collection name', function() {
      var fileTypes = [new pageflow.FileType({collectionName: 'image_files', model: Model, matchUpload: /^image/})];
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var collections = pageflow.FilesCollection.createForFileTypes(fileTypes, files);

      expect(collections.image_files.name).to.eq('image_files');
      expect(collections.image_files.model).to.eq(Model);
    });

    it('allows passing options to collection constructors', function() {
      var fileTypes = [new pageflow.FileType({collectionName: 'image_files', model: Model, matchUpload: /^image/})];
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var entry = {};
      var collections = pageflow.FilesCollection.createForFileTypes(fileTypes, files, {entry: entry});

      expect(collections.image_files.entry).to.eq(entry);
    });
  });

  describe('.createForFileType', function() {
    it('passes fileType to files', function() {
      var fileType = new pageflow.FileType({collectionName: 'image_files', model: Model, matchUpload: /^image/});
      var files = [{file_name: 'image.png'}];
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileType(fileType, files, {entry: entry});

      expect(collection.first().fileType()).to.eq(fileType);
    });
  });
});
