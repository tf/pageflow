module Pageflow
  module Admin
    class UserAccountsTab < ViewComponent
      def build(user)
        embedded_index_table(user.memberships.on_accounts.includes(:account)
                              .accessible_by(Ability.new(current_user), :index),
                             blank_slate_text: t('pageflow.admin.users.no_accounts')) do
          table_for_collection class: 'memberships', sortable: true, i18n: Pageflow::Membership do
            column :account, sortable: 'pageflow_accounts.name' do |membership|
              if authorized?(:read, membership.entity)
                link_to(membership.entity.name, admin_account_path(membership.entity))
              else
                membership.entity.name
              end
            end
            column :role, sortable: 'pageflow_memberships.role' do |membership|
              span t(membership.role, scope: 'activerecord.values.pageflow/membership.role'),
                   class: "membership_role #{membership.role} tooltip_clue" do
                div t(membership.role, scope: 'pageflow.admin.users.roles.accounts.tooltip'),
                    class: 'tooltip_bubble'
              end
            end
            column :created_at, sortable: 'pageflow_memberships.created_at'
            column do |membership|
              if authorized?(:update, membership)
                link_to(t('pageflow.admin.users.edit_role'),
                        edit_admin_user_membership_path(user, membership, entity_type: :account),
                        data: {
                          rel: "edit_account_role_#{membership.role}"
                        })
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(t('pageflow.admin.users.delete'),
                        admin_user_membership_path(user, membership),
                        method: :delete,
                        data: {
                          confirm: t('pageflow.admin.users.delete_account_membership_confirmation'),
                          rel: "delete_account_membership_#{membership.role}"
                        })
              end
            end
          end
          unless user == current_user ||
                 authorized?(:see_all_instances_of_class_of, user.accounts.first)
            para text_node I18n.t('pageflow.admin.users.user_account_tab_hint')
          end
          add_membership_button_if_needed(user, 'account')
        end
      end
    end
  end
end
