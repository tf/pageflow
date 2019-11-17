describe('FileUploader', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.fileTypes = support.factories.fileTypes(function() {
      testContext.withImageFileType();
      testContext.withVideoFileType();
      testContext.withTextTrackFileType();
    });

    testContext.imageFileType = testContext.fileTypes.findByCollectionName('image_files');
    testContext.videoFileType = testContext.fileTypes.findByCollectionName('video_files');
    testContext.textTrackFileType = testContext.fileTypes.findByCollectionName('text_track_files');

    testContext.entry = support.factories.entry({}, {
      files: pageflow.FilesCollection.createForFileTypes([this.imageFileType,
                                                          this.videoFileType,
                                                          this.textTrackFileType], {}),
      fileTypes: testContext.fileTypes
    });
  });

  describe('#add', () => {
    describe('non-nested file', () => {
      test('adds file to files collection of file type', () => {
        var fileUploader = new pageflow.FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};

        fileUploader.add(upload);

        expect(testContext.entry.getFileCollection(testContext.imageFileType).length).toBe(1);
      });

      test(
        'returns promise that resolves to file when FileUploader#submit is called',
        () => {
          var fileUploader = new pageflow.FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var upload = {name: 'image.png', type: 'image/png'};
          var result;

          fileUploader.add(upload).then(function(file) {
            result = file;
          });
          fileUploader.submit();

          expect(result).toBeInstanceOf(pageflow.ImageFile);
        }
      );

      test(
        'returns promise that is rejected when FileUploader#abort is called',
        () => {
          var fileUploader = new pageflow.FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var upload = {name: 'image.png', type: 'image/png'};

          var promise = fileUploader.add(upload);
          fileUploader.abort();

          expect(promise.state()).toBe('rejected');
        }
      );

      test('emits new:batch event on first add', () => {
        var fileUploader = new pageflow.FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.add(upload);

        expect(handler).to.have.been.calledOnce;
      });

      test('emits new:batch event on first add after abort', () => {
        var fileUploader = new pageflow.FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.abort();
        fileUploader.add(upload);

        expect(handler).to.have.been.calledTwice;
      });

      test('emits new:batch event on first add after submit', () => {
        var fileUploader = new pageflow.FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.submit();
        fileUploader.add(upload);

        expect(handler).to.have.been.calledTwice;
      });

      test('throws exception if target set', () => {
        var fileUploader = new pageflow.FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
        fileUploader.add(targetFileUpload);
        fileUploader.submit();
        var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
        var nonNestedUpload = {name: 'nested_video.mp4', type: 'video/mp4'};
        var editor = new pageflow.EditorApi();
        editor.setUploadTargetFile(targetFile);

        expect(function() {
          fileUploader.add(nonNestedUpload, {editor: editor});
        }).toThrowError(pageflow.InvalidNestedTypeError);
      });
    });

    describe('nested file', () => {
      test(
        'adds file to nested files collection of file type on target file',
        () => {
          var fileUploader = new pageflow.FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
          fileUploader.add(targetFileUpload);
          fileUploader.submit();
          var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
          var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
          var editor = new pageflow.EditorApi();
          editor.setUploadTargetFile(targetFile);
          fileUploader.add(nestedFileUpload, {editor: editor});
          expect(editor.nextUploadTargetFile.nestedFiles(
            testContext.entry.getFileCollection(testContext.textTrackFileType)
          ).length).toBe(1);
        }
      );

      test(
        'resolves to file without the need to call any external function',
        () => {
          var fileUploader = new pageflow.FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
          fileUploader.add(targetFileUpload);
          fileUploader.submit();
          var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
          var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
          var editor = new pageflow.EditorApi();
          editor.setUploadTargetFile(targetFile);
          var result;
          fileUploader.add(nestedFileUpload, {editor: editor}).then(function(file) {
            result = file;
          });
          expect(result).toBeInstanceOf(pageflow.TextTrackFile);
        }
      );

      test('throws exception if target not set', () => {
        var fileUploader = new pageflow.FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
        var editor = new pageflow.EditorApi();

        expect(function() {
          fileUploader.add(nestedFileUpload, {editor: editor});
        }).toThrowError(pageflow.NestedTypeError);
      });

      test(
        'throws exception if target does not allow to nest type of file',
        () => {
          var fileUploader = new pageflow.FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
          fileUploader.add(targetFileUpload);
          fileUploader.submit();
          var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
          var nestedFileUpload = {name: 'cannot_nest_image.png', type: 'image/png'};
          var editor = new pageflow.EditorApi();
          editor.setUploadTargetFile(targetFile);

          expect(function() {
            fileUploader.add(nestedFileUpload, {editor: editor});
          }).toThrowError(pageflow.InvalidNestedTypeError);
        }
      );
    });
  });

  describe('#abort', () => {
    test('removes the files from the files collection', () => {
      var fileUploader = new pageflow.FileUploader({
        entry: testContext.entry,
        fileTypes: testContext.fileTypes
      });
      var upload = {name: 'image.png', type: 'image/png'};

      fileUploader.add(upload);
      fileUploader.abort();

      expect(testContext.entry.getFileCollection(testContext.imageFileType).length).toBe(0);
    });
  });
});
