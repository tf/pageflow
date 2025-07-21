# This migration comes from pageflow (originally 20231024062501)
class AddOutputPresencesToImageFiles < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_image_files, :output_presences, :text
  end
end
