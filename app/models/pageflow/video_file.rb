module Pageflow
  class VideoFile < ActiveRecord::Base
    include HostedFile
    include EncodedFileStateMachine

    belongs_to :confirmed_by, :class_name => 'User'

    POSTER_STYLES = Pageflow.config.thumbnail_styles
      .merge(print: ['300x300>', :JPG],
             medium: ['1024x1024>', :JPG],
             large: ['1920x1920>', :JPG],
             panorama_medium: ['1024x1024^', :JPG],
             panorama_large: ['1920x1080^', :JPG])

    POSTER_CONVERT_OPTIONS = {
      print: "-quality 10 -interlace Plane",
      medium: "-quality 90 -interlace Plane",
      large: "-quality 90 -interlace Plane",
      panorama_medium: '-quality 70 -interlace Plane',
      panorama_large: '-quality 70 -interlace Plane'
    }

    has_attached_file(:poster, Pageflow.config.paperclip_s3_default_options
                        .merge(:default_url => ':pageflow_placeholder',
                               :styles => POSTER_STYLES,
                               :convert_options => POSTER_CONVERT_OPTIONS))

    has_attached_file(:thumbnail, Pageflow.config.paperclip_s3_default_options
                        .merge(:default_url => ':pageflow_placeholder',
                               :default_style => :thumbnail,
                               :styles => Pageflow.config.thumbnail_styles
                                 .merge(:medium => ['1920x1920>', :JPG],
                                        :large => ['1024x1024>', :JPG]),
                               :convert_options => {
                                 :medium => "-quality 60 -interlace Plane",
                                 :large => "-quality 60 -interlace Plane"
                               }))

    def thumbnail_url(*args)
      poster.url(*args)
    end

    def attachment_s3_url
      "s3://#{File.join(attachment_on_s3.bucket_name, attachment_on_s3.path)}"
    end


    def webm_high
      ZencoderAttachment.new(self, "high.webm")
    end

    def webm_medium
      ZencoderAttachment.new(self, "medium.webm")
    end


    def mp4_high
      ZencoderAttachment.new(self, "high.mp4")
    end

    def mp4_medium
      ZencoderAttachment.new(self, "medium.mp4")
    end

    def mp4_low
      ZencoderAttachment.new(self, "low.mp4")
    end


    def hls_low
      ZencoderAttachment.new(self, "hls-low.m3u8")
    end

    def hls_medium
      ZencoderAttachment.new(self, "hls-medium.m3u8")
    end

    def hls_high
      ZencoderAttachment.new(self, "hls-high.m3u8")
    end



    def hls_playlist
      if Pageflow.config.zencoder_options[:hls_smil_suffix].present?
        ZencoderAttachment.new(self, "hls-playlist.smil", :host => :hls, :url_suffix => Pageflow.config.zencoder_options[:hls_smil_suffix])
      else
        ZencoderAttachment.new(self, "hls-playlist.m3u8", :host => :hls)
      end
    end

    def smil
      ZencoderAttachment.new(self, "hls-playlist.smil")
    end

    def zencoder_thumbnail
      ZencoderAttachment.new(self, "thumbnail-{{number}}", :format => 'jpg')
    end

    def zencoder_poster
      ZencoderAttachment.new(self, "poster-{{number}}", :format => 'jpg')
    end

    def output_definition
      ZencoderVideoOutputDefinition.new(self)
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:format, :duration_in_ms, :width, :height)
    end
  end
end
