require 'spec_helper'

module Pageflow
  describe PollZencoderJob do
    let(:zencoder_options) do
      Pageflow.config.zencoder_options
    end

    it 'passes job id of file to zencoder api' do
      video_file = build(:video_file, :job_id => 43)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.pending)

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(ZencoderApi.instance).to have_received(:get_info).with(43)
    end

    it 'returns pending when zencoder has not finished' do
      video_file = build(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.pending)

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(result).to eq(:pending)
    end

    it 'assigns zencoder progress' do
      video_file = build(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.pending(:progress => 30))

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(video_file.encoding_progress).to eq(30)
    end

    it 'returns pending if zencoder api raises recoverable error' do
      video_file = build(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.recoverably_failing)

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(result).to eq(:pending)
    end

    it 'records error message if zencoder api raises recoverable error' do
      video_file = create(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.recoverably_failing)

      PollZencoderJob.perform_with_result(video_file, {})

      expect(video_file.reload.encoding_error_message).to be_present
    end

    it 'records error message if zencoder api raises unrecoverable error' do
      video_file = create(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.unrecoverably_failing)

      PollZencoderJob.perform_with_result(video_file, {}) rescue :ignore

      expect(video_file.reload.encoding_error_message).to be_present
    end

    it 'returns pending if thumbnail is not there yet' do
      video_file = build(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)
      stub_request(:get, /.*amazonaws\.com/).to_return(:status => 404)

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(result).to eq(:pending)
    end

    it 'returns ok if thumbnail is not there yet but skip_thumbnail option is set' do
      video_file = build(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)
      stub_request(:get, /.*amazonaws\.com/).to_return(:status => 404)

      result = PollZencoderJob.perform_with_result(video_file, {:skip_thumbnail => true})

      expect(result).to eq(:ok)
    end

    it 'returns ok if thumbnail can be downloaded' do
      video_file = build(:video_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)
      stub_request(:any, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(result).to eq(:ok)
    end

    it 'returns ok if encoding is finished and file does not respond to thumbnail' do
      audio_file = build(:audio_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)

      result = PollZencoderJob.perform_with_result(audio_file, {})

      expect(result).to eq(:ok)
    end

    it 'returns error if encoding is failed and file does not respond to thumbnail' do
      audio_file = build(:audio_file)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished_but_failed)

      result = PollZencoderJob.perform_with_result(audio_file, {})

      expect(result).to eq(:error)
    end

    it 'passes job id of file to get_details method of zencoder api' do
      video_file = build(:video_file, :job_id => 43)

      allow(ZencoderApi).to receive(:instance).and_return(ZencoderApiDouble.finished)
      stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(ZencoderApi.instance).to have_received(:get_details).with(43)
    end

    it 'assigns meta data' do
      video_file = build(:video_file, :job_id => 43)
      zencoder_api = ZencoderApiDouble.finished
      meta_data = {}

      allow(ZencoderApi).to receive(:instance).and_return(zencoder_api)
      allow(zencoder_api).to receive(:get_details).and_return(meta_data)
      stub_request(:get, /#{zencoder_options[:s3_host_alias]}/)
        .to_return(:status => 200, :body => File.read('spec/fixtures/image.jpg'))
      allow(video_file).to receive(:meta_data_attributes=)

      result = PollZencoderJob.perform_with_result(video_file, {})

      expect(video_file).to have_received(:meta_data_attributes=).with(meta_data)
    end
  end
end
