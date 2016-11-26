require 'spec_helper'

module Pageflow
  describe ImageFileUrlTemplates do
    it 'returns templates indexed by variant name' do
      result = ImageFileUrlTemplates.new.call

      expect(result[:large])
        .to include('pageflow/image_files/processed_attachments/:id_partition/large/:basename.JPG')
    end
  end
end
