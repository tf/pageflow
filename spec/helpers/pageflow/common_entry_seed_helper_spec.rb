require 'spec_helper'

module Pageflow
  describe CommonEntrySeedHelper do
    describe '#common_entry_seed' do
      describe '["page_types"]' do
        let(:page_type) do
          Class.new(PageType) do
            name 'test_page_type'

            def thumbnail_candidates
              [
                {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
                {attribute: 'video_id', file_collection: 'video_files'}
              ]
            end
          end
        end

        it 'includes thumbnail candidates of page types registered for entry' do
          pageflow_configure do |config|
            config.page_types.register(page_type.new)
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

      describe '["file_url_templates"]' do
        it 'contains url template for large poster' do
          entry = PublishedEntry.new(create(:entry, :published))

          result = common_entry_seed(entry)
          template = result[:file_url_templates][:video_files][:poster]

          expect(template).to include('pageflow/video_files/posters/:id_partition/ultra/image.JPG')
        end

        it 'contains video file url templates' do
          entry = PublishedEntry.new(create(:entry, :published))

          result = common_entry_seed(entry)
          template = result[:file_url_templates][:video_files][:high]

          expect(template).to include('pageflow/video_files/:id_partition/high.mp4')
        end
      end
    end
  end
end
