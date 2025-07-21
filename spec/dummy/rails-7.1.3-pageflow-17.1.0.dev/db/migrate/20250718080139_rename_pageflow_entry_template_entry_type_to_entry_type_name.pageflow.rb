# This migration comes from pageflow (originally 20200807135200)
class RenamePageflowEntryTemplateEntryTypeToEntryTypeName < ActiveRecord::Migration[5.2]
  def change
    rename_column :pageflow_entry_templates,
                  :entry_type,
                  :entry_type_name
  end
end
