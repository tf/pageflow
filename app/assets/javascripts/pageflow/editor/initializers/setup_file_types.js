pageflow.app.addInitializer(function(options) {
  pageflow.editor.fileTypes.register('image_files', {
    model: pageflow.ImageFile,
    metaDataAttributes: ['dimensions'],
    matchUpload: /^image/
  });

  pageflow.editor.fileTypes.register('video_files', {
    model: pageflow.VideoFile,
    metaDataAttributes: ['format', 'dimensions', 'duration'],
    matchUpload: /^video/,
    settingsDialogTabs: [
      {
        name: 'text_tracks',
        view: pageflow.TextTracksView
      }
    ],
    nestedFileTypes: ['text_track_files'],
    configurationEditorInputs: [
      {
        name: 'alt_text',
        inputView: pageflow.TextInputView
      }
    ]
  });

  pageflow.editor.fileTypes.register('audio_files', {
    model: pageflow.AudioFile,
    metaDataAttributes: ['format', 'duration'],
    matchUpload: /^audio/
  });

  pageflow.editor.fileTypes.register('text_track_files', {
    model: pageflow.TextTrackFile,
    matchUpload: /vtt$/,
    skipUploadConfirmation: true,
    configurationEditorInputs: [
      {
        name: 'label',
        inputView: pageflow.TextInputView
      },
      {
        name: 'kind',
        inputView: pageflow.SelectInputView,
        inputViewOptions: {
          values: pageflow.config.availableTextTrackKinds,
          texts: _.map(pageflow.config.availableTextTrackKinds, function(kind) {
            var translation = 'pageflow.config.text_track_kind.' + kind;
            return I18n.t(translation);
          })
        }
      },
      {
        name: 'srclang',
        inputView: pageflow.TextInputView
      }
    ],
    nestedFileTableColumns: [
      {
        name: 'label',
        cellView: pageflow.TextTableCellView,
        default: I18n.t('pageflow.editor.nested_files.text_track_files.label.missing')
      },
      {
        name: 'srclang',
        cellView: pageflow.PresenceTableCellView
      },
      {
        name: 'kind',
        cellView: pageflow.IconTableCellView,
        cellViewOptions: {
          iconClasses: pageflow.config.availableTextTrackKinds
        }
      },
    ]
  });

  pageflow.editor.fileTypes.setup(options.config.fileTypes);
});
