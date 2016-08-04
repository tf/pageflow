module Pageflow
  module BuiltInFileType
    # Factory methods to decouple Pageflow initializers from concrete
    # file type classes, making more transparent which file types are
    # available as built-ins.
    def self.image
      FileType.new(model: 'Pageflow::ImageFile',
                   editor_partial: 'pageflow/editor/image_files/image_file',
                   collection_name: 'image_files',
                   url_templates: ImageFileUrlTemplates.new,
                   top_level_type: true)
    end

    def self.video
      FileType.new(model: 'Pageflow::VideoFile',
                   partial: 'pageflow/video_files/video_file',
                   editor_partial: 'pageflow/editor/video_files/video_file',
                   collection_name: 'video_files',
                   url_templates: VideoFileUrlTemplates.new,
                   top_level_type: true,
                   nested_file_types: [BuiltInFileType.text_track])
    end

    def self.audio
      FileType.new(model: 'Pageflow::AudioFile',
                   editor_partial: 'pageflow/editor/audio_files/audio_file',
                   collection_name: 'audio_files',
                   url_templates: AudioFileUrlTemplates.new,
                   top_level_type: true,
                   nested_file_types: [BuiltInFileType.text_track])
    end

    def self.text_track
      FileType.new(model: 'Pageflow::TextTrackFile',
                   collection_name: 'text_track_files',
                   url_templates: OriginalHostedFileUrlTemplates.new)
    end
  end
end
