support.factories = {
  entry: function entry(attributes, options) {
    var fileTypes = new pageflow.FileTypes();
    fileTypes.setup([]);

    return new pageflow.Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection(),
      files: {},
      fileTypes: fileTypes
    }, options));
  },

  fileTypesWithImageFileType: function(options) {
    options = options || {};
    var fileTypes = new pageflow.FileTypes();
    var fileTypesSetupArray = [
      {
        collectionName: 'image_files',
        typeName: 'Pageflow::ImageFile'
      }
    ];

    fileTypes.register('image_files', _.extend({
      model: pageflow.ImageFile,
      matchUpload: /^image/
    }, options));

    if (options.addVideoAndTextTrackFileTypes) {
      fileTypes.register('video_files', _.extend({
        model: pageflow.VideoFile,
        matchUpload: /^video/,
        nestedFileTypes: ['text_track_files']
      }, options));

      fileTypes.register('text_track_files', _.extend({
        model: pageflow.TextTrackFile,
        matchUpload: /vtt$/
      }, options));

      fileTypesSetupArray = fileTypesSetupArray.concat([
        {
          collectionName: 'video_files',
          typeName: 'Pageflow::VideoFile'
        },
        {
          collectionName: 'text_track_files',
          typeName: 'Pageflow::TextTrackFile'
        }
      ]);
    }
    fileTypes.setup(fileTypesSetupArray);

    return fileTypes;
  },

  fileTypesWithoutAudioFileType: function(options) {
    var fileTypes = new pageflow.FileTypes();

    fileTypes.register('image_files', _.extend({
      model: pageflow.ImageFile,
      matchUpload: /^image/
    }, options));

    fileTypes.register('video_files', _.extend({
      model: pageflow.VideoFile,
      matchUpload: /^video/,
      nestedFileTypes: ['text_track_files']
    }, options));

    fileTypes.register('text_track_files', _.extend({
      model: pageflow.TextTrackFile,
      matchUpload: /vtt$/
    }, options));

    fileTypes.setup([
      {
        collectionName: 'image_files',
        typeName: 'Pageflow::ImageFile'
      },
      {
        collectionName: 'video_files',
        typeName: 'Pageflow::VideoFile'
      },
      {
        collectionName: 'text_track_files',
        typeName: 'Pageflow::TextTrackFile'
      }
    ]);

    return fileTypes;
  },

  imageFileType: function(options) {
    return support.factories.fileTypesWithImageFileType(options).first();
  },

  fileType: function(options) {
    return support.factories.imageFileType(options);
  },

  filesCollection: function(options) {
    return pageflow.FilesCollection.createForFileType(options.fileType,
                                                      [{}, {}]);
  },

  file: function(attributes, options) {
    return new pageflow.ImageFile(attributes, options);
  }
};
