module Dom
  module Admin
    class AccountPage < Domino
      selector '.admin_accounts'

      attribute :name, '.attributes_table.pageflow_account .name td'
      attribute :cname, '.attributes_table.pageflow_theming .cname td'
      attribute :theme, '.attributes_table.pageflow_theming .theme td'

      def features_tab
        within(node) do
          find('.tabs > .features a')
        end
      end

      def edit_link
        within(node) do
          find_link(I18n.t('active_admin.edit_model',
                           model: I18n.t('activerecord.models.account.one')))
        end
      end

      def delete_link
        within(node) do
          find_link(I18n.t('active_admin.delete_model',
                           model: I18n.t('activerecord.models.account.one')))
        end
      end

      def create_entry_link
        within(node) do
          find('[data-rel=create_entry]')
        end
      end

      def add_account_membership_link
        within(node) do
          find('[data-rel=add_member]')
        end
      end

      def add_account_invitation_link
        within(node) do
          find('[data-rel=invite_member]')
        end
      end

      def edit_account_role_link(role)
        within(node) do
          find("[data-rel=edit_account_role_#{role}]")
        end
      end

      def edit_account_invitation_role_link(role)
        within(node) do
          find("[data-rel=edit_account_invitation_role_#{role}]")
        end
      end

      def delete_member_on_account_link(role)
        within(node) do
          find("[data-rel=delete_account_membership_#{role}]")
        end
      end

      def delete_invited_member_on_account_link(role)
        within(node) do
          find("[data-rel=delete_account_invitation_#{role}]")
        end
      end

      def has_role_flag_in_memberships?(role)
        within(node) do
          has_selector?(".memberships .#{role}")
        end
      end

      def has_role_flag_in_invitations?(role)
        within(node) do
          has_selector?(".invitations .#{role}")
        end
      end
    end
  end
end
