module Pageflow
  class Membership < ActiveRecord::Base
    belongs_to :user
    belongs_to :entity, polymorphic: true

    validates :user, :entity, :role, presence: true
    validates :user_id, uniqueness: { scope: [:entity_type, :entity_id] }
    if :entity_type == 'Pageflow::Entry'
      validates_with AccountMembershipExistenceValidator
    end

    class AccountMembershipExistenceValidator < ActiveModel::Validator
      def validate(record)
        unless record.user.accounts.include?(record.entity.account)
          record.errors[:base] << 'Entry Membership misses presupposed Membership on account of entry'
        end
      end
    end

    scope :on_entries, -> { where(entity_type: 'Pageflow::Entry') }
    scope :on_accounts, -> { where(entity_type: 'Pageflow::Account') }
  end
end
