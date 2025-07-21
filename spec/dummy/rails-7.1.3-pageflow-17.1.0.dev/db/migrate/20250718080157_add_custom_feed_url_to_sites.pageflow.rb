# This migration comes from pageflow (originally 20230405103612)
class AddCustomFeedUrlToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_sites, :custom_feed_url, :string
  end
end
