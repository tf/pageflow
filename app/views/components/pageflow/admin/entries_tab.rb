module Pageflow
  module Admin
    class EntriesTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table(account.entries,
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_members')) do
          table_for_collection(sortable: true, class: 'entries', i18n: Pageflow::Entry) do
            column :title, sortable: :title do |entry|
              link_to(entry.title, admin_entry_path(entry))
            end
            column :created_at
            column :updated_at
          end
        end
        para do
          button_label = I18n.t('pageflow.admin.entries.new')
          path = new_admin_entry_path(account_id: theming.account.id)
          rel = 'create_entry'
          link_to(button_label, path, class: 'button create_entry', data: {rel: rel})
        end
      end
    end
  end
end
