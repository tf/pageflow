# This migration comes from pageflow (originally 20240612110434)
class AddCutoffModeNameToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_sites, :cutoff_mode_name, :string
  end
end
