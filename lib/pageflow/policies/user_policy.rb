module Pageflow
  module Policies
    class UserPolicy
      class Scope
        attr_reader :user, :scope

        def initialize(user, scope)
          @user = user
          @scope = scope
        end

        def resolve
          if user.admin?
            scope.all
          else
            manager_accounts_ids = Pageflow::Policies::AccountPolicy::Scope
                                   .new(@user, Account).member_addable.map(&:id)

            scope.joins(:memberships)
              .where('pageflow_memberships.entity_type = "Pageflow::Account"')
              .where(membership_in_managed_account(manager_accounts_ids)).distinct
          end
        end

        private

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end

        def membership_in_managed_account(accounts_ids)
          sanitize_sql_array(['pageflow_memberships.entity_id IN (:accounts_ids)',
                              accounts_ids: accounts_ids])
        end
      end

      def initialize(user, managed_user)
        @user = user
        @managed_user = managed_user
      end

      def create?
        index?
      end

      def index?
        @user.memberships.on_accounts.where(role: 'manager').any?
      end

      def read?
        manager_accounts = Pageflow::Policies::AccountPolicy::Scope
                           .new(@user, Account).member_addable
        managed_user_accounts = Pageflow::Policies::AccountPolicy::Scope
                                .new(@managed_user, Account).resolve
        (manager_accounts & managed_user_accounts).any?
      end

      def redirect_to_user?
        read?
      end
    end
  end
end
