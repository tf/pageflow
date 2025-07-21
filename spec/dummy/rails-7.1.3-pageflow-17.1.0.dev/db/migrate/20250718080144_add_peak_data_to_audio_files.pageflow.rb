# This migration comes from pageflow (originally 20220503150010)
class AddPeakDataToAudioFiles < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_audio_files, :peak_data_file_name, :string
  end
end
