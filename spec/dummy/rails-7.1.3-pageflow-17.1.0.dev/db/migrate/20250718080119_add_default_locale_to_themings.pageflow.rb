# This migration comes from pageflow (originally 20190109085744)
class AddDefaultLocaleToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :default_locale, :string,
               after: 'default_publisher', default: 'de'
  end
end
