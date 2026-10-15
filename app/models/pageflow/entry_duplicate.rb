module Pageflow
  EntryDuplicate = Struct.new(:original_entry) do
    def build
      entry = Entry.new(new_attributes)
      if original_entry.permalink.present?
        entry.build_permalink(directory: original_entry.permalink.directory)
      end
      entry
    end

    def create!(entry: nil, copy_memberships: true)
      ActiveRecord::Base.transaction do
        @new_entry = entry || Entry.new(new_attributes)
        new_entry.save!

        if entry.nil? && original_entry.permalink.present?
          new_entry.create_permalink!(directory: original_entry.permalink.directory)
        end
        copy_draft
        self.copy_memberships if copy_memberships
      end

      new_entry
    end

    def self.of(entry)
      new(entry)
    end

    private

    attr_reader :new_entry

    def copy_draft
      original_entry.draft.copy do |revision|
        revision.entry = new_entry
      end
    end

    def copy_memberships
      original_entry.memberships.each do |membership|
        Membership.create(user: membership.user, role: membership.role.to_sym, entity: new_entry)
      end
    end

    def new_attributes
      {
        type_name: original_entry.type_name,
        title: new_title,
        account: original_entry.account,
        site: original_entry.site,
        features_configuration: original_entry.features_configuration,
        perma_id_counter: original_entry.perma_id_counter,

        skip_draft_creation: true
      }
    end

    def new_title
      I18n.t('pageflow.entry.duplicated_title', title: original_entry.title)
    end
  end
end
