module Pageflow
  # Seed data that is used for published entires as well as editor
  # display.
  #
  # @api private
  module CommonEntrySeedHelper
    def common_entry_seed(entry)
      {
        locale: entry.locale,
        page_types: PageTypesSeed.new(entry, Pageflow.config_for(entry)).as_json,
        file_url_templates: FileUrlTemplatesSeed.as_json
      }
    end

    module FileUrlTemplatesSeed
      extend self

      def as_json
        {
          video_files: video_file_url_templates
        }
      end

      private

      def video_file_url_templates
        {
          high: video_file_url_template(:mp4_high),
          fullhd: video_file_url_template(:mp4_fullhd),
          :'4k' => video_file_url_template(:mp4_4k)
        }
      end

      def video_file_url_template(variant)
        file_url_template(video_file.send(variant).url)
      end

      def file_url_template(url)
        url.gsub(%r'(\d{3}/)+', ':id_partition/')
      end

      def video_file
        @video_file ||= VideoFile.new(id: 0)
      end
    end

    class PageTypesSeed
      attr_reader :entry, :config

      def initialize(entry, config)
        @entry = entry
        @config = config
      end

      def as_json
        config.page_types.each_with_object({}) do |page_type, result|
          result[page_type.name.to_sym] = page_type_seed(page_type)
        end
      end

      private

      def page_type_seed(page_type)
        {
          thumbnail_candidates: thumbnail_candidates(page_type)
        }
      end

      def thumbnail_candidates(page_type)
        page_type.thumbnail_candidates.map do |candidate|
          {
            attribute: candidate[:attribute],
            collection_name: candidate[:file_collection],
            css_class_prefix: thumbnail_candidate_css_class_prefix(candidate)
          }
        end
      end

      def thumbnail_candidate_css_class_prefix(candidate)
        file_type = config.file_types.find_by_collection_name!(candidate[:file_collection])
        file_type.model.model_name.singular
      end
    end
  end
end
