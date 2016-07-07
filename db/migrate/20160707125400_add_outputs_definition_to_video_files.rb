class AddOutputsDefinitionToVideoFiles < ActiveRecord::Migration
  def change
    add_column :pageflow_video_files, :outputs_definition, :text
  end
end
