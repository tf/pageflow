# This migration comes from pageflow (originally 20210531102228)
class AddSelectedFileIdsToThemeCustomizations < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_theme_customizations, :selected_file_ids, :text
  end
end
