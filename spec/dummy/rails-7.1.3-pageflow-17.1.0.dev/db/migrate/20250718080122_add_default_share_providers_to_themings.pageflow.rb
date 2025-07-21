# This migration comes from pageflow (originally 20190408144136)
class AddDefaultShareProvidersToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :default_share_providers, :text, after: 'default_keywords'
  end
end
