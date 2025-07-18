require 'spec_helper'

module Pageflow
  describe AutoGeneratedPermaId do
    let(:model) do
      Class.new(ActiveRecord::Base) do
        self.table_name = 'pageflow_pages'

        include AutoGeneratedPermaId
      end
    end

    describe '#perma_id' do
      it 'is set on creation' do
        instance = model.create

        expect(instance.perma_id).to be_present
      end

      it 'differs for separate instances of the same model' do
        instance1 = model.create
        instance2 = model.create

        expect(instance1.perma_id).not_to eq(instance2.perma_id)
      end

      it 'remains the same on subsequent saves' do
        instance = model.create

        expect {
          instance.save!
        }.not_to(change { instance.perma_id })
      end
    end
  end
end
