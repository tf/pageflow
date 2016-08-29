require 'spec_helper'

module Pageflow
  describe FileType do
    describe '#model' do
      it 'is set if model is passed' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.model).to eq(ImageFile)
      end

      it 'is set if model name is passed' do
        file_type = FileType.new(model: 'Pageflow::ImageFile')

        expect(file_type.model).to eq(ImageFile)
      end
    end

    describe '#collection_name' do
      it 'defaults to plural model name' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.collection_name).to eq('pageflow_image_files')
      end

      it 'can be overridden' do
        file_type = FileType.new(model: ImageFile,
                                 collection_name: 'image_files')

        expect(file_type.collection_name).to eq('image_files')
      end
    end

    describe '#param_key' do
      it 'returns symbolized base class name' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.param_key).to eq(:image_file)
      end
    end

    describe '#short_name' do
      it 'returns symbolized base class name' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.param_key).to eq(:image_file)
      end
    end

    describe '#type_name' do
      it 'returns fully qualified name of ruby model' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.type_name).to eq('Pageflow::ImageFile')
      end
    end

    describe '#i18n_key' do
      it 'returns fully qualified underscored name of ruby model' do
        file_type = FileType.new(model: ImageFile)

        expect(file_type.i18n_key).to eq(:'pageflow/image_file')
      end
    end

    describe '#editor_partial' do
      it 'returns passed editor_partial' do
        file_type = FileType.new(model: ImageFile,
                                 editor_partial: 'pageflow/editor/image_files/image_file')

        expect(file_type.editor_partial).to eq('pageflow/editor/image_files/image_file')
      end
    end

    describe '#nested_file_types' do
      it 'returns array of passed file types' do
        nested_image_type = FileType.new(model: ImageFile)
        nested_video_type = FileType.new(model: VideoFile)
        parent_type = FileType.new(model: AudioFile,
                                   nested_file_types: [nested_image_type, nested_video_type])
        expect(parent_type.supports_nested_file_type?(ImageFile)).to be(true)
        expect(parent_type.supports_nested_file_type?(VideoFile)).to be(true)
        expect(parent_type.supports_nested_file_type?(AudioFile)).to be(false)
      end
    end
  end
end
