module Pageflow
  class ZencoderVideoOutputDefinition < ZencoderOutputDefinition
    cattr_accessor :skip_hls, :skip_smil

    attr_reader :video_file

    def initialize(video_file, options = {})
      super(options)
      @video_file = video_file
    end

    def input_s3_url
      @video_file.attachment_s3_url
    end

    def outputs
      [
        transferable(webm_high_definition),
        transferable(webm_medium_definition),

        mp4_highdef_definitions,
        transferable(mp4_high_definition),
        transferable(mp4_medium_definition),
        transferable(mp4_low_definition),

        dash_definitions,
        hls_definitions,
        smil_definition,

        thumbnails_definitions
      ].flatten
    end

    private

    def webm_high_definition
      {
        label: 'webm_high',
        format: 'webm',
        path: video_file.webm_high.path,
        size: '1280x720',
        quality: 4,
        max_video_bitrate: 3500,
        public: 1,
        sharpen: true
      }
    end

    def webm_medium_definition
      {
        label: 'webm_medium',
        format: 'webm',
        path: video_file.webm_medium.path,
        size: '1280x720',
        quality: 3,
        max_video_bitrate: 2000,
        public: 1,
        sharpen: true
      }
    end

    def mp4_highdef_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')
      [transferable(mp4_4k_definition), transferable(mp4_fullhd_definition)]
    end

    def mp4_4k_definition
      {
        label: '4k',
        prepare_for_segmenting: ['hls', 'dash'],
        format: 'mp4',
        path: video_file.mp4_4k.path,
        video_bitrate: 40000,
        decoder_bitrate_cap: 44400,
        decoder_buffer_size: 66600,
        audio_bitrate: 192,
        h264_profile: 'main',
        size: '3840x2160',
        skip: {
          min_size: '1921x1080'
        },
        public: 1,
        tuning: 'film',
        sharpen: true
      }
    end

    def mp4_fullhd_definition
      {
        label: 'fullhd',
        prepare_for_segmenting: ['hls', 'dash'],
        format: 'mp4',
        path: video_file.mp4_fullhd.path,
        video_bitrate: 10000,
        decoder_bitrate_cap: 11100,
        decoder_buffer_size: 16650,
        audio_bitrate: 192,
        h264_profile: 'main',
        size: '1920x1080',
        skip: {
          min_size: '1281x720'
        },
        public: 1,
        tuning: 'film',
        sharpen: true
      }
    end

    def mp4_high_definition
      {
        label: 'high',
        prepare_for_segmenting: ['hls', 'dash'],
        format: 'mp4',
        path: video_file.mp4_high.path,
        h264_level: 3.1,
        max_frame_rate: 30,
        video_bitrate: 4400,
        decoder_bitrate_cap: 4884,
        decoder_buffer_size: 7326,
        audio_bitrate: 192,
        h264_profile: 'main',
        size: '1280x720',
        public: 1,
        tuning: 'film',
        sharpen: true
      }
    end

    def mp4_medium_definition
      {
        label: 'medium',
        prepare_for_segmenting: ['hls', 'dash'],
        format: 'mp4',
        path: video_file.mp4_medium.path,
        h264_level: 3.1,
        max_frame_rate: 30,
        video_bitrate: 2000,
        decoder_bitrate_cap: 2220,
        decoder_buffer_size: 3330,
        audio_bitrate: 128,
        h264_profile: 'main',
        size: '848x480',
        public: 1,
        sharpen: true
      }
    end

    def mp4_low_definition
      {
        label: 'low',
        prepare_for_segmenting: ['hls', 'dash'],
        format: 'mp4',
        path: video_file.mp4_low.path,
        device_profile: 'mobile/legacy',
        audio_bitrate: 56,
        public: 1,
        sharpen: true
      }
    end

    def dash_definitions
      dash_highdef_definitions +
        [
          non_transferable(dash_high_definition),
          non_transferable(dash_medium_definition),
          non_transferable(dash_low_definition),
          non_transferable(dash_playlist_definition)
        ]
    end

    def dash_highdef_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')

      [
        non_transferable(dash_fullhd_definition),
        non_transferable(dash_4k_definition)
      ]
    end

    def hls_definitions
      return [] if skip_hls

      [
        non_transferable(hls_high_definition),
        non_transferable(hls_medium_definition),
        non_transferable(hls_low_definition),
        non_transferable(hls_playlist_definition)
      ]
    end

    def dash_low_definition
      {
        label: 'dash-low',
        source: 'low',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        path: video_file.dash_low.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_medium_definition
      {
        label: 'dash-medium',
        source: 'medium',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        path: video_file.dash_medium.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_high_definition
      {
        label: 'dash-high',
        source: 'high',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        path: video_file.dash_high.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_fullhd_definition
      {
        label: 'dash-fullhd',
        source: 'fullhd',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        path: video_file.dash_fullhd.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_4k_definition
      {
        label: 'dash-4k',
        source: '4k',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        path: video_file.dash_4k.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_playlist_definition
      {
        label: 'dash-playlist',
        streams: dash_stream_definitions,
        type: 'playlist',
        streaming_delivery_format: 'dash',
        path: video_file.dash_playlist.path,
        public: 1,
        allow_skipped_sources: true
      }
    end

    def dash_stream_definitions
      [
        {
          source: 'dash-low',
          path: video_file.dash_low.url
        },
        {
          source: 'dash-medium',
          path: video_file.dash_medium.url
        },
        {
          source: 'dash-high',
          path: video_file.dash_high.url
        }
      ] + dash_highdef_stream_definitions
    end

    def dash_highdef_stream_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')
      [
        {
          source: 'dash-fullhd',
          path: video_file.dash_fullhd.url
        },
        {
          source: 'dash-4k',
          path: video_file.dash_4k.url
        }
      ]
    end

    def hls_low_definition
      {
        label: 'hls-low',
        format: 'ts',
        source: 'low',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_low.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_medium_definition
      {
        label: 'hls-medium',
        format: 'ts',
        source: 'medium',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_medium.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_high_definition
      {
        label: 'hls-high',
        format: 'ts',
        source: 'high',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_high.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_playlist_definition
      {
        label: 'hls-playlist',
        streams: hls_stream_definitions,
        type: 'playlist',
        path: video_file.hls_playlist.path,
        public: 1
      }
    end

    def hls_stream_definitions
      [
        {
          path: video_file.hls_medium.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 2250
        },
        {
          path: video_file.hls_low.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 256
        },
        {
          path: video_file.hls_high.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 3750
        }
      ]
    end

    def smil_definition
      return [] if skip_smil
      non_transferable(
        streams: smil_stream_definitions,
        type: 'playlist',
        format: 'highwinds',
        path: video_file.smil.path,
        public: true
      )
    end

    def smil_stream_definitions
      [
        {
          path: video_file.mp4_medium.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 2250
        },
        {
          path: video_file.mp4_low.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 256
        },
        {
          path: video_file.mp4_high.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 3750
        }
      ]
    end

    def thumbnails_definitions
      if akamai_configured?
        result = [thumbnails_definition(method(:akamai_url))]
      else
        result = [thumbnails_definition(method(:s3_url))]
        result << thumbnails_definition(method(:sftp_url)) if sftp_configured?
      end
      result
    end

    def thumbnails_definition(url_helper)
      {
        thumbnails: [
          with_credentials(label: 'poster',
                           format: video_file.zencoder_poster.format,
                           number: 1,
                           start_at_first_frame: true,
                           filename: video_file.zencoder_poster.base_name_pattern,
                           base_url: url_helper.call(video_file.zencoder_poster.dir_name),
                           public: 1),
          with_credentials(label: 'thumbnail',
                           format: video_file.zencoder_thumbnail.format,
                           number: 1,
                           filename: video_file.zencoder_thumbnail.base_name_pattern,
                           base_url: url_helper.call(video_file.zencoder_thumbnail.dir_name),
                           public: 1)
        ]
      }
    end
  end
end
