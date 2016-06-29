require 'spec_helper'

describe Admin::InvitationsController do
  describe '#create' do
    describe 'as admin' do
      it 'allows to invite user to account' do
        user = create(:user)
        account = create(:account)

        sign_in(create(:user, :admin))

        expect do
          post :create, account_id: account, invitation: {user_id: user, role: :manager}
        end.to change { account.invited_users.count }
      end

      it 'allows to add invited account to user' do
        user = create(:user)
        account = create(:account)

        sign_in(create(:user, :admin))

        expect do
          post :create, user_id: user, invitation: {entity_id: account.id,
                                                    entity_type: 'Pageflow::Account',
                                                    role: :manager}
        end.to change { user.invited_accounts.count }
      end

      it 'does not allow to invite user to account with invitation workflows turned off' do
        Pageflow.config.invitation_workflows = false
        user = create(:user)
        account = create(:account)

        sign_in(create(:user, :admin))

        expect do
          post :create, account_id: account, invitation: {user_id: user, role: :manager}
        end.not_to change { account.invited_users.count }
      end

      it 'does not allow to add invited account to user with invitation workflows turned off' do
        Pageflow.config.invitation_workflows = false
        user = create(:user)
        account = create(:account)

        sign_in(create(:user, :admin))

        expect do
          post :create, user_id: user, invitation: {entity_id: account.id,
                                                    entity_type: 'Pageflow::Account',
                                                    role: :manager}
        end.not_to change { user.invited_accounts.count }
      end
    end

    describe 'as account admin' do
      it 'allows to invite user to correct account' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)

        sign_in(account_admin)

        expect do
          post :create, account_id: account, invitation: {user_id: user, role: :manager}
        end.to change { account.invited_users.count }
      end

      it 'allows to add correct invited account to user' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)

        sign_in(account_admin)

        expect do
          post :create, user_id: user, invitation: {entity_id: account.id,
                                                    entity_type: 'Pageflow::Account',
                                                    role: :manager}
        end.to change { user.invited_accounts.count }
      end

      it 'does not allow to invite user to off-limits account' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)

        sign_in(account_admin)

        expect do
          post :create, account_id: off_limits_account.id, invitation: {user_id: user,
                                                                        role: :manager}
        end.not_to change { off_limits_account.invited_users.count }
      end

      it 'does not allow to add off-limits invited account to user' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)

        sign_in(account_admin)

        expect do
          post :create,
               user_id: user,
               invitation: {entity_id: off_limits_account.id,
                            entity_type: 'Pageflow::Account',
                            role: :manager}
        end.not_to change { user.invited_accounts.count }
      end
    end

    describe 'as account publisher' do
      it 'does not allow to invite user to account' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)

        sign_in(account_publisher)

        expect do
          post :create, account_id: account, invitation: {user_id: user, role: :manager}
        end.not_to change { account.invited_users.count }
      end

      it 'does not allow to add invited account to user' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)

        sign_in(account_publisher)

        expect do
          post :create, user_id: user, invitation: {account_id: account.id,
                                                    account_type: 'Pageflow::Account',
                                                    role: :manager}
        end.not_to change { user.invited_accounts.count }
      end
    end
  end

  describe '#edit' do
    describe 'as admin' do
      it 'allows to edit invited user role on account' do
        user = create(:user)
        account = create(:account)
        invitation = create(:invitation, entity: account, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          patch(:update, account_id: account, id: invitation, invitation: {role: :publisher})
        end.to change { invitation.reload.role }
      end

      it 'allows to edit account role on invited user' do
        user = create(:user)
        account = create(:account)
        invitation = create(:invitation, entity: account, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          patch(:update, user_id: user, id: invitation, invitation: {role: :publisher})
        end.to change { invitation.reload.role }
      end

      it 'allows to edit entry role via invited user' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :publisher}
        end.to change { invitation.reload.role }
      end

      it 'allows to edit invited entry role via entry' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          patch :update, entry_id: entry, id: invitation, invitation: {role: :publisher}
        end.to change { invitation.reload.role }
      end
    end

    describe 'as account admin' do
      it 'allows to edit invited user role on own account' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_admin)

        expect do
          patch :update, account_id: account, id: invitation, invitation: {role: :publisher}
        end.to change { invitation.reload.role }
      end

      it 'allows to edit role relating to own account on invited user' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_admin)

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :publisher}
        end.to change { invitation.reload.role }
      end

      it 'does not allow to edit invited user role on off-limits account' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: off_limits_account, role: :manager)

        sign_in(account_admin)

        expect do
          patch :update,
                account_id: off_limits_account,
                id: invitation,
                invitation: {role: :previewer}
        end.not_to change { invitation.reload.role }
      end

      it 'does not allow to edit off-limits account role on invited user' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: off_limits_account, role: :manager)

        sign_in(account_admin)

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :previewer}
        end.not_to change { invitation.reload.role }
      end
    end

    describe 'as account publisher' do
      it 'does not allow to edit invited user role on own account' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_publisher)

        expect do
          patch :update, account_id: account, id: invitation, invitation: {role: :previewer}
        end.not_to change { invitation.reload.role }
      end

      it 'does not allow to edit account role relating to own account on invited user' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_publisher)

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :previewer}
        end.not_to change { invitation.reload.role }
      end
    end

    describe 'as entry admin' do
      it 'does not allow to edit invited user role on entry in other account' do
        user = create(:user)
        entry_manager = create(:user)
        create(:account, with_member: user, with_manager: entry_manager)
        create(:entry, with_manager: entry_manager)
        invitation = create(:invitation, entity: create(:entry), user: user, role: :previewer)

        sign_in(entry_manager)

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :editor}
        end.not_to change { invitation.reload.role }
      end

      it 'does not allow to edit entry role on invited user in other account' do
        user = create(:user)
        entry_manager = create(:user)
        create(:account, with_member: user, with_manager: entry_manager)
        entry = create(:entry)
        invitation = create(:invitation, entity: entry, user: user, role: :previewer)

        sign_in(entry_manager)

        expect do
          patch :update, entry_id: entry, id: invitation, invitation: {role: :editor}
        end.not_to change { invitation.reload.role }
      end

      it 'allows to edit role of invited member of account on entry' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry_manager = create(:user)
        entry = create(:entry, account: account, with_manager: entry_manager)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(entry_manager)

        expect do
          patch :update, entry_id: entry, id: invitation, invitation: {role: :publisher}
        end.to change { invitation.reload.role }
      end

      it 'allows to edit role relating to entry of invited user account on user' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry_manager = create(:user)
        entry = create(:entry, account: account, with_manager: entry_manager)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(entry_manager)

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :publisher}
        end.to change { invitation.reload.role }
      end
    end

    describe 'as entry publisher' do
      it 'does not allow to edit role of invited member of entry account on entry' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry_publisher = create(:user)
        entry = create(:entry, account: account, with_publisher: entry_publisher)
        invitation = create(:invitation, entity: entry, user: user, role: :previewer)

        sign_in(entry_publisher)

        expect do
          patch :update, entry_id: entry, id: invitation, invitation: {role: :editor}
        end.not_to change { invitation.reload.role }
      end

      it 'does not allow to edit role relating to entry of invited user account on user' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry_publisher = create(:user)
        entry = create(:entry, account: account, with_publisher: entry_publisher)
        invitation = create(:invitation, entity: entry, user: user, role: :previewer)

        sign_in(entry_publisher)

        expect do
          patch :update, user_id: user, id: invitation, invitation: {role: :editor}
        end.not_to change { invitation.reload.role }
      end
    end
  end

  describe '#destroy' do
    describe 'as admin' do
      it 'allows to delete invited user from account' do
        user = create(:user)
        account = create(:account)
        invitation = create(:invitation, entity: account, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          delete(:destroy, account_id: account, id: invitation)
        end.to change { account.invited_users.count }
      end

      it 'allows to delete account from invited user' do
        user = create(:user)
        account = create(:account)
        invitation = create(:invitation, entity: account, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.to change { user.invited_accounts.count }
      end

      it 'allows to delete invited user from entry' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry = create(:entry, account: account)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          delete(:destroy, entry_id: entry, id: invitation)
        end.to change { entry.invited_users.count }
      end

      it 'allows to delete entry from invited user' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry = create(:entry, account: account)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(create(:user, :admin))

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.to change { user.invited_entries.count }
      end
    end

    describe 'as account admin' do
      it 'allows to delete invited user from own account' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_admin)

        expect do
          delete(:destroy, account_id: account, id: invitation)
        end.to change { account.invited_users.count }
      end

      it 'allows to delete own account from invited user' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_admin)

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.to change { user.invited_accounts.count }
      end

      it 'deletes entry invitation from invited user along with account invitation' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        entry = create(:entry, account: account)
        user = create(:user)
        account_invitation = create(:invitation, user: user, entity: account, role: :manager)
        create(:invitation, user: user, entity: entry, role: :previewer)

        sign_in(account_admin)

        expect do
          delete(:destroy, user_id: user, id: account_invitation)
        end.to change { user.invited_entries.count }
      end

      it 'does not delete entry invitation from other invited user along with account invitation' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        entry = create(:entry, account: account)
        user = create(:user)
        other_user = create(:user)
        account_invitation = create(:invitation, user: user, entity: account, role: :manager)
        create(:invitation, user: other_user, entity: entry, role: :previewer)

        sign_in(account_admin)

        expect do
          delete(:destroy, user_id: user, id: account_invitation)
        end.not_to change { user.invited_entries.count }
      end

      it 'does not delete entry invitation of other account along with account invitation' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        entry = create(:entry)
        user = create(:user)
        account_invitation = create(:invitation, user: user, entity: account, role: :manager)
        create(:invitation, user: user, entity: entry, role: :previewer)

        sign_in(account_admin)

        expect do
          delete(:destroy, user_id: user, id: account_invitation)
        end.not_to change { user.invited_entries.count }
      end

      it 'does not delete account invitation along with other account invitation' do
        account_admin = create(:user)
        other_account = create(:account)
        account = create(:account, with_manager: account_admin)
        user = create(:user)
        create(:invitation, user: user, entity: other_account)
        account_invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_admin)

        expect do
          delete(:destroy, user_id: user, id: account_invitation)
        end.not_to change { other_account.invited_users.count }
      end

      it 'does not allow to delete invited user from off-limits account' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: off_limits_account, role: :manager)

        sign_in(account_admin)

        expect do
          delete(:destroy, account_id: off_limits_account, id: invitation)
        end.not_to change { off_limits_account.invited_users.count }
      end

      it 'does not allow to delete off-limits account from invited user' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: off_limits_account, role: :manager)

        sign_in(account_admin)

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.not_to change { user.invited_accounts.count }
      end
    end

    describe 'as account publisher' do
      it 'does not allow to delete invited user from own account' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_publisher)

        expect do
          delete(:destroy, account_id: account, id: invitation)
        end.not_to change { account.invited_users.count }
      end

      it 'does not allow to delete own account from invited user' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)
        invitation = create(:invitation, user: user, entity: account, role: :manager)

        sign_in(account_publisher)

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.not_to change { user.invited_accounts.count }
      end
    end

    describe 'as entry admin' do
      it 'does not allow to delete invited user from entry in other account' do
        user = create(:user)
        entry_manager = create(:user)
        create(:account, with_member: user, with_manager: entry_manager)
        create(:entry, with_manager: entry_manager)
        invitation = create(:invitation, entity: create(:entry), user: user, role: :previewer)

        sign_in(entry_manager)

        expect {
          delete(:destroy, user_id: user, id: invitation)
        }.not_to change { user.invited_entries.count }
      end

      it 'does not allow to delete entry from invited user in other account' do
        user = create(:user)
        entry_manager = create(:user)
        create(:account, with_member: user, with_manager: entry_manager)
        entry = create(:entry)
        invitation = create(:invitation, entity: entry, user: user, role: :previewer)

        sign_in(entry_manager)

        expect do
          delete(:destroy, entry_id: entry, id: invitation)
        end.not_to change { entry.invited_users.count }
      end

      it 'allows to delete invited member of entry account from entry' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry_manager = create(:user)
        entry = create(:entry, account: account, with_manager: entry_manager)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(entry_manager)

        expect do
          delete(:destroy, entry_id: entry, id: invitation)
        end.to change { entry.invited_users.count }
      end

      it 'allows to delete entry of invited user account from user' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry_manager = create(:user)
        entry = create(:entry, account: account, with_manager: entry_manager)
        invitation = create(:invitation, entity: entry, user: user, role: :manager)

        sign_in(entry_manager)

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.to change { user.invited_entries.count }
      end
    end

    describe 'as entry publisher' do
      it 'does not allow to delete invited member of entry account from entry' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry_publisher = create(:user)
        entry = create(:entry, account: account, with_publisher: entry_publisher)
        invitation = create(:invitation, entity: entry, user: user, role: :previewer)

        sign_in(entry_publisher)

        expect do
          delete(:destroy, entry_id: entry, id: invitation)
        end.not_to change { entry.invited_users.count }
      end

      it 'does not allow to delete entry of invited user account from invited user' do
        user = create(:user)
        account = create(:account, with_member: user)
        entry_publisher = create(:user)
        entry = create(:entry, account: account, with_publisher: entry_publisher)
        invitation = create(:invitation, entity: entry, user: user, role: :previewer)

        sign_in(entry_publisher)

        expect do
          delete(:destroy, user_id: user, id: invitation)
        end.not_to change { user.invited_entries.count }
      end
    end
  end
end
