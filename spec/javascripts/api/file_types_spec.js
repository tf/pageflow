describe('FileTypes', function() {
  describe('#register/#setup', function() {
    it('creates file types for given server side configs from registered client side configs', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {model: pageflow.ImageFile, matchUpload: /^image/});
      fileTypes.setup([{collectionName: 'image_files'}]);

      expect(fileTypes.first().collectionName).to.eq('image_files');
      expect(fileTypes.first().model).to.eq(pageflow.ImageFile);
    });

    it('creates nested file types for given server side configs from registered client side configs', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('video_files', {model: pageflow.VideoFile, matchUpload: /^video/});
      fileTypes.register('text_track_files',
                         {model: pageflow.TextTrackFile, matchUpload: /^text_track/});
      fileTypes.setup([{collectionName: 'video_files', nestedFileTypes: ['text_track_files']},
                       {collectionName: 'text_track_files'}]);

      var nestedFileType = fileTypes.findByCollectionName('video_files').nestedFileTypes.first();
      expect(nestedFileType.collectionName).to.eq('text_track_files');
      expect(nestedFileType.model).to.eq(pageflow.TextTrackFile);
    });

    it('throws exception if client side config is missing', function() {
      var fileTypes = new pageflow.FileTypes();

      expect(function() {
        fileTypes.setup([{collectionName: 'image_files'}]);
      }).to.throw(/Missing client side config/);
    });
  });
});
