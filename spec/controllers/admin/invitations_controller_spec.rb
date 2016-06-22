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
end
