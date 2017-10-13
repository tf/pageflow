module Pageflow
  # Query users for their role on accounts based on role
  class AccountRoleQuery < ApplicationQuery
    class Scope < Scope
      attr_reader :user, :scope

      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def with_role_at_least(role)
        scope.joins(with_membership_for_account(role))
      end

      private

      def with_membership_for_account(role)
        sanitize_sql(<<-SQL, user_id: user.id, roles: Roles.at_least(role))
          INNER JOIN pageflow_memberships ON
          pageflow_memberships.user_id = :user_id AND
          pageflow_memberships.entity_id = pageflow_accounts.id AND
          pageflow_memberships.entity_type = "Pageflow::Account" AND
          pageflow_memberships.role IN (:roles)
        SQL
      end
    end

    # Create query that can be used for role comparisons
    #
    # @param [User] user
    #   Required. Membership user to check.
    # @param [Pageflow::Account] account
    #   Required. Membership entity to check.
    def initialize(user, account)
      @user = user
      @account = account
    end

    # Return true if there is a membership with at least role for
    # user/account
    #
    # @param [String] role
    #   Required. Minimum role that we compare against.
    # @return [Boolean]
    def has_at_least_role?(role)
      @user
        .memberships
        .where(role: Roles.at_least(role))
        .where('(entity_id = :account_id AND '\
               "entity_type = 'Pageflow::Account')",
               account_id: @account.id)
        .any?
    end
  end
end
