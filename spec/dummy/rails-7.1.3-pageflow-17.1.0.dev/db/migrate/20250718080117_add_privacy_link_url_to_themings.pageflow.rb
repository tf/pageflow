# This migration comes from pageflow (originally 20180528144334)
class AddPrivacyLinkUrlToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :privacy_link_url, :string
  end
end
