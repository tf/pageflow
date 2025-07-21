# This migration comes from pageflow (originally 20191113124400)
class AddTypeNameToEntries < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_entries, :type_name, :string, after: 'title', default: 'paged'
  end
end
