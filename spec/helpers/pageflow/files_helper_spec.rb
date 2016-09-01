require 'spec_helper'

module Pageflow
  describe FilesHelper do
    describe '#files_json_seeds' do
      it 'has keys of all file types' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))

        expect(files_seed).to have_key('image_files')
        expect(files_seed).to have_key('video_files')
        expect(files_seed).to have_key('audio_files')
      end

      it 'seeds required data for an image file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        image_file = create(:image_file)
        create(:file_usage, revision: revision, file: image_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        image_file_seed = files_seed['image_files'].first

        expect(image_file_seed).to have_key('id')
        expect(image_file_seed).to have_key('state')
        expect(image_file_seed).to have_key('rights')
        expect(image_file_seed).to have_key('usage_id')
        expect(image_file_seed).to have_key('retryable')
        expect(image_file_seed).to have_key('file_name')
        expect(image_file_seed).to have_key('width')
        expect(image_file_seed).to have_key('height')
        expect(image_file_seed).to have_key('panorama_url')
        expect(image_file_seed).to have_key('dimensions')
        expect(image_file_seed).to have_key('thumbnail_url')
        expect(image_file_seed).to have_key('link_thumbnail_url')
      end

      it 'seeds required data for a video file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        video_file = create(:video_file)
        create(:file_usage, revision: revision, file: video_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        video_file_seed = files_seed['video_files'].first

        expect(video_file_seed).to have_key('id')
        expect(video_file_seed).to have_key('dimensions')
        expect(video_file_seed).to have_key('duration')
        expect(video_file_seed).to have_key('encoding_progress')
        expect(video_file_seed).to have_key('file_name')
        expect(video_file_seed).to have_key('format')
        expect(video_file_seed).to have_key('height')
        expect(video_file_seed).to have_key('link_thumbnail_url')
        expect(video_file_seed).to have_key('original_url')
        expect(video_file_seed).to have_key('retryable')
        expect(video_file_seed).to have_key('rights')
        expect(video_file_seed).to have_key('sources')
        expect(video_file_seed).to have_key('state')
        expect(video_file_seed).to have_key('thumbnail_url')
        expect(video_file_seed).to have_key('url')
        expect(video_file_seed).to have_key('usage_id')
        expect(video_file_seed).to have_key('width')
      end

      it 'seeds required data for an audio file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        audio_file = create(:audio_file)
        create(:file_usage, revision: revision, file: audio_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        audio_file_seed = files_seed['audio_files'].first

        expect(audio_file_seed).to have_key('id')
        expect(audio_file_seed).to have_key('duration')
        expect(audio_file_seed).to have_key('encoding_progress')
        expect(audio_file_seed).to have_key('file_name')
        expect(audio_file_seed).to have_key('format')
        expect(audio_file_seed).to have_key('original_url')
        expect(audio_file_seed).to have_key('retryable')
        expect(audio_file_seed).to have_key('rights')
        expect(audio_file_seed).to have_key('state')
        expect(audio_file_seed).to have_key('url')
        expect(audio_file_seed).to have_key('usage_id')
      end
    end
  end
end
