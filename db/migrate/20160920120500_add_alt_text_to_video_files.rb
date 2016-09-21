class AddAltTextToVideoFiles < ActiveRecord::Migration
  def change
    add_column :pageflow_video_files, :alt_text, :string, default: '', null: false
  end
end
