# This migration comes from pageflow (originally 20230331103823)
class AddTitleToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_sites, :title, :string
  end
end
