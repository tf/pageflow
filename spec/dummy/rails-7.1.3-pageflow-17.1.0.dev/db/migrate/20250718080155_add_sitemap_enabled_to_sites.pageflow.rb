# This migration comes from pageflow (originally 20230323154323)
class AddSitemapEnabledToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_sites, :sitemap_enabled, :boolean
  end
end
