module Pageflow
  module BackgroundImageHelper
    def background_image_div(configuration, property_base_name, options = {})
      Div.new(self, configuration, property_base_name, options).render
    end

    def background_image_div_with_size(configuration, property_base_name, options = {})
      DivWithSizeAttributes.new(self, configuration, property_base_name, options).render
    end

    def background_image_tag(image_id, options = {})
      if image = ImageFile.find_by_id(image_id)
        options = options.merge(:'data-src' => image.attachment.url(:medium))
        options = options.merge(:'data-printsrc' => image.attachment.url(:print))
        image_tag('', options)
      end
    end

    class Div
      FILE_TYPE_CSS_CLASS_PREFIXES = {
        'image_file' => 'image',
        'video_file' => 'video_poster',
      }

      attr_reader :configuration, :property_base_name, :options

      delegate :content_tag, :to => :@template

      def initialize(template, configuration, property_base_name, options)
        @template = template
        @configuration = configuration
        @property_base_name = property_base_name
        @options = options
      end

      def render
        content_tag(:div, '', :class => css_class, :style => inline_style, :data => data_attributes)
      end

      protected

      def data_attributes
        options.slice(:style_group)
      end

      def file_id
        configuration["#{property_base_name}_id"]
      end

      def inline_style
        "background-position: #{background_position('x')} #{background_position('y')};"
      end

      private

      def css_class
        ["background background_image #{image_css_class}", options[:class]].compact.join(' ')
      end

      def image_css_class
        [image_css_class_prefix, options[:style_group], file_id || 'none'].compact.join('_')
      end

      def image_css_class_prefix
        FILE_TYPE_CSS_CLASS_PREFIXES.fetch(options.fetch(:file_type, 'image_file'))
      end

      def background_position(coord)
        property_name = "#{property_base_name}_#{coord}"
        configuration.key?(property_name) ? "#{configuration[property_name]}%" : "50%"
      end
    end

    class DivWithSizeAttributes < Div
      def data_attributes
        if file
          super.merge(:width => file.width, :height => file.height)
        else
          super
        end
      end

      def inline_style
        if options[:spanning]
          "padding-top: #{padding_top}%; width: 100%; background-position: 0 0" # fix me (yet disables background_position option)
        else
          super
        end
      end

      private

      def padding_top
        if file
          file.height / file.width.to_f * 100
        else
          0
        end
      end

      def file
        @file ||= (find_file || :none)
        @file == :none ? nil : @file
      end

      def find_file
        file_type.model.find_by_id(file_id)
      end

      def file_type
        Pageflow.config.file_types.find_by_collection_name!(options.fetch(:file_type, 'image_file').pluralize)
      end
    end
  end
end
