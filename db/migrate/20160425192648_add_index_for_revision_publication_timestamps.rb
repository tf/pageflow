class AddIndexForRevisionPublicationTimestamps < ActiveRecord::Migration
  def change
    add_index 'pageflow_revisions', ['entry_id', 'published_at', 'published_until'], name: 'index_pageflow_revisions_on_entry_id_and_published_at_and_published_until', using: :btree
  end
end
