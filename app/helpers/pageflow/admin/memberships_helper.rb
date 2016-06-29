module Pageflow
  module Admin
    module MembershipsHelper
      def membership_entries_collection(parent, resource)
        if resource.new_record?
          if parent.is_a?(User)
            accounts = AccountPolicy::Scope.new(current_user, Pageflow::Account)
                       .member_addable
            MembershipFormCollection.new(parent,
                                         resource: resource,
                                         collection_method: :entries,
                                         display_method: :title,
                                         order: 'title ASC',
                                         managed_accounts: accounts).collection_for_entries
          else
            MembershipFormCollection.new(parent,
                                         resource: resource,
                                         collection_method: :entries,
                                         display_method: :title,
                                         order: 'title ASC').pairs
          end
        else
          [[resource.entity.title, resource.entity_id]]
        end
      end

      def membership_accounts_collection(parent, resource)
        if resource.new_record?
          if parent.is_a?(User)
            accounts = AccountPolicy::Scope
                       .new(current_user, Account).member_addable.load
            if Pageflow.config.invitation_workflows
              collection_method = :accounts_and_invited_accounts
            else
              collection_method = :accounts
            end
            MembershipFormCollection.new(parent,
                                         collection_method: collection_method,
                                         display_method: :name,
                                         order: 'name ASC',
                                         managed_accounts: accounts).pairs
          else
            [[parent.name, parent.id]]
          end
        else
          [[resource.entity.name, resource.entity_id]]
        end
      end

      def membership_users_collection(parent, resource)
        if resource.new_record?
          accounts = AccountPolicy::Scope
                     .new(current_user, Pageflow::Account).member_addable.load
          MembershipFormCollection.new(parent,
                                       collection_method: :users,
                                       display_method: :formal_name,
                                       order: 'last_name ASC, first_name ASC',
                                       managed_accounts: accounts).pairs
        else
          [[resource.user.formal_name, resource.user.id]]
        end
      end

      def membership_roles_collection(entity_type)
        default_options = [[I18n.t('pageflow.admin.users.roles.previewer'), :previewer],
                           [I18n.t('pageflow.admin.users.roles.editor'), :editor],
                           [I18n.t('pageflow.admin.users.roles.publisher'), :publisher],
                           [I18n.t('pageflow.admin.users.roles.manager'), :manager]]
        if entity_type == 'Pageflow::Account'
          [[I18n.t('pageflow.admin.users.roles.member'), :member]] + default_options
        else
          default_options
        end
      end

      class MembershipFormCollection
        include ActionView::Helpers::FormOptionsHelper
        attr_reader :parent, :options

        def initialize(parent, options)
          @parent = parent
          @options = options
        end

        def pairs
          items.each_with_object([]) do |item, result|
            result << [display(item), item.id]
          end
        end

        def collection_for_entries
          accounts_ids_sql = accounts_ids_in_parent_accounts_ids_or_invited_accounts_ids
          if accounts_ids_sql
            accounts = options[:managed_accounts]
                       .where(accounts_ids_in_parent_accounts_ids_or_invited_accounts_ids)
                       .includes(:entries).where('pageflow_entries.id IS NOT NULL')
                       .where(entries_ids_not_in_parent_entries_ids_or_invited_entries_ids)
                       .order(:name, 'pageflow_entries.title')
            option_groups_from_collection_for_select(accounts, :entries, :name, :id, :title)
          else
            []
          end
        end

        private

        def items
          if parent.is_a?(User)
            if options[:collection_method] == :users
              [parent]
            else
              options[:managed_accounts] - items_in_parent
            end
          elsif parent.is_a?(Entry)
            items_in_account - items_in_parent
          else
            Set.new(options[:managed_accounts].map(&:users).flatten) - items_in_parent
          end
        end

        def display(item)
          item.send(options[:display_method])
        end

        def items_in_account
          if options[:collection_method] == :users
            if Pageflow.config.invitation_workflows
              users_related_to_account = parent.account.users_and_invited_users
            else
              users_related_to_account = parent.account.users
            end
            User.where(id: users_related_to_account.map(&:id)).order(options[:order])
          elsif parent.is_a?(User)
            options[:resource].entity.send(options[:collection_method]).order(options[:order])
          else
            parent.account.send(options[:collection_method]).order(options[:order])
          end
        end

        def items_in_parent
          if parent.respond_to?(options[:collection_method])
            if Pageflow.config.invitation_workflows &&
               options[:collection_method] == :users &&
               (parent.is_a?(Entry) || parent.is_a?(Account))
              parent.send(:users_and_invited_users)
            else
              parent.send(options[:collection_method])
            end
          else
            []
          end
        end

        def accounts_ids_in_parent_accounts_ids_or_invited_accounts_ids
          parent_accounts_and_invited_ids = parent.accounts.map(&:id)
          if Pageflow.config.invitation_workflows
            parent_accounts_and_invited_ids += @parent.invited_accounts.map(&:id)
          end
          if parent_accounts_and_invited_ids.any?
            sanitize_sql_array(['pageflow_accounts.id IN (:parent_accounts_and_invited_ids)',
                                parent_accounts_and_invited_ids: parent_accounts_and_invited_ids])
          else
            false
          end
        end

        def entries_ids_not_in_parent_entries_ids_or_invited_entries_ids
          parent_entries_and_invited_ids = items_in_parent.map(&:id)
          if Pageflow.config.invitation_workflows
            parent_entries_and_invited_ids += @parent.invited_entries.map(&:id)
          end
          if parent_entries_and_invited_ids.any?
            sanitize_sql_array(['pageflow_entries.id NOT IN (:parent_entries_and_invited_ids)',
                                parent_entries_and_invited_ids: parent_entries_and_invited_ids])
          else
            true
          end
        end

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end
      end
    end
  end
end
