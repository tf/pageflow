require 'spec_helper'

module Pageflow
  describe CommonEntrySeedHelper do
    describe '#common_entry_seed' do
      let(:page_type) do
        Class.new(PageType) do
          name 'test_page_type'

          attr_reader :file_types, :thumbnail_candidates

          def initialize(options = {})
            @file_types = options.fetch(:file_types, [])
            @thumbnail_candidates = options.fetch(:thumbnail_candidates, [])
          end
        end
      end

      describe '["page_types"]' do
        it 'includes thumbnail candidates of page types registered for entry' do
          thumbnail_candidates =
            [
            {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
            {attribute: 'video_id', file_collection: 'video_files'}
          ]

          pageflow_configure do |config|
            config.page_types.register(page_type.new(thumbnail_candidates: thumbnail_candidates))
          end

          revision = create(:revision, :published)
          entry = create(:entry, published_revision: revision)
          published_entry = PublishedEntry.new(entry)

          result = common_entry_seed(published_entry)
          candidates = result[:page_types][:test_page_type][:thumbnail_candidates]

          expect(candidates).to eq([
            {
              attribute: 'thumbnail_image_id',
              collection_name: 'image_files',
              css_class_prefix: 'pageflow_image_file'
            },
            {
              attribute: 'video_id',
              collection_name: 'video_files',
              css_class_prefix: 'pageflow_video_file'
            }
          ])
        end
      end

      describe '["locale"]' do
        it 'equals entry locale' do
          entry = PublishedEntry.new(create(:entry,
                                            :published,
                                            published_revision_attributes: {locale: 'fr'}))

          result = common_entry_seed(entry)

          expect(result[:locale]).to eq('fr')
        end
      end

      describe '["file_model_types"]' do
        it 'contains mapping of file type collection name to model type name' do
          file_type = FileType.new(model: 'Pageflow::VideoFile',
                                   collection_name: 'test_files')

          pageflow_configure do |config|
            config.page_types.clear
            config.page_types.register(page_type.new(file_types: [file_type]))
          end

          entry = PublishedEntry.new(create(:entry, :published))

          result = common_entry_seed(entry)

          expect(result[:file_model_types]['test_files']).to eq('Pageflow::VideoFile')
        end
      end
    end
  end
end
