# This migration comes from pageflow (originally 20221025074049)
class AddPermalinkAttributesToEntries < ActiveRecord::Migration[5.2]
  def change
    add_reference :pageflow_entries, :permalink, index: true
  end
end
