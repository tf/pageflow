class AddAltTextToAudioFiles < ActiveRecord::Migration
  def change
    add_column :pageflow_audio_files, :alt_text, :string, default: '', null: false
  end
end
