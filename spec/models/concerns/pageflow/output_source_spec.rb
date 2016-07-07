require 'spec_helper'

module Pageflow
  describe OutputSource do
    describe '#outputs_present' do
      it 'returns labels of outputs that are present' do
        source = build(:video_file, outputs_definition: {avi: true, gif: false})

        result = source.outputs_present

        expect(result).to eq([:avi])
      end
    end

    describe '#outputs_presences=' do
      it 'does not change unmentioned output presence information' do
        source = build(:video_file, outputs_definition: {imax: true, threesixty: false})

        source.outputs_presences = {avi: true, gif: false}

        expect(source.output_present?(:imax)).to eq(true)
        expect(source.output_present?(:threesixty)).to eq(false)
        expect(source.output_present?(:avi)).to eq(true)
        expect(source.output_present?(:gif)).to eq(false)
      end

      it 'supports "finished" and "skipped" values for output presences' do
        source = build(:video_file)

        source.outputs_presences = {avi: 'finished', gif: 'skipped'}

        expect(source.output_present?(:avi)).to eq(true)
        expect(source.output_present?(:gif)).to eq(false)
      end

      it 'removes keys for outputs with presence set to blank' do
        source = build(:video_file, outputs_definition: {imax: true, threesixty: false})

        source.outputs_presences = {imax: nil, threesixty: ''}

        expect(source.output_present?(:imax)).to eq(nil)
        expect(source.output_present?(:threesixty)).to eq(nil)
      end
    end
  end
end
