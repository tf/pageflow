module Pageflow
  module Admin
    module EntriesHelper
      def collection_for_entry_publication_states
        [
          'published_without_password_protection',
          'published_with_password_protection',
          'not_published'
        ].index_by do |state|
          I18n.t(state, scope: 'activerecord.values.pageflow/entry.publication_states')
        end
      end
    end
  end
end
