# -*- coding: utf-8 -*-
require 'spec_helper'

module Pageflow
  describe PotentialMemberships do
    describe '#accounts_for_user' do
      it 'includes managed accounts the user is not yet member of' do
        account = create(:account)
        user = create(:user)
        current_user = create(:user, :manager, on: account)

        result = PotentialMemberships.new(current_user).accounts_for_user(user)

        expect(result).to include(account)
      end

      it 'does not include accounts the user is already member of' do
        account = create(:account)
        user = create(:user, :member, on: account)
        current_user = create(:user, :manager, on: account)

        result = PotentialMemberships.new(current_user).accounts_for_user(user)

        expect(result).not_to include(account)
      end

      it 'does not include accounts the current user is not manager of' do
        account = create(:account)
        user = create(:user)
        current_user = create(:user, :publisher, on: account)

        result = PotentialMemberships.new(current_user).accounts_for_user(user)

        expect(result).not_to include(account)
      end
    end

    describe '#entries_for_user' do
      it 'includes entries in user`s accounts managed by current user' do
        account = create(:account)
        user = create(:user, :member, on: account)
        current_user = create(:user, :manager, on: account)
        entry = create(:entry, account: account)

        result = PotentialMemberships.new(current_user).entries_for_user(user)

        expect(result).to include(entry)
      end

      it 'includes entries managed by current_user in user`s accounts' do
        account = create(:account)
        user = create(:user, :member, on: account)
        current_user = create(:user, :member, on: account)
        entry = create(:entry, account: account, with_manager: current_user)

        result = PotentialMemberships.new(current_user).entries_for_user(user)

        expect(result).to include(entry)
      end

      it 'does not include entries in managed accounts that the user is not member of' do
        account = create(:account)
        user = create(:user, :member, on: account)
        current_user = create(:user, :manager, on: account)
        other_account = create(:account, with_manager: current_user)
        entry = create(:entry, account: other_account)

        result = PotentialMemberships.new(current_user).entries_for_user(user)

        expect(result).not_to include(entry)
      end

      it 'does not include entries in user`s accounts not managed by current user' do
        account = create(:account)
        user = create(:user, :member, on: account)
        current_user = create(:user, :member, on: account)
        entry = create(:entry, account: account)

        result = PotentialMemberships.new(current_user).entries_for_user(user)

        expect(result).not_to include(entry)
      end

      it 'does not include entries the user is already member of' do
        account = create(:account)
        user = create(:user, :member, on: account)
        current_user = create(:user, :manager, on: account)
        entry = create(:entry, account: account, with_editor: user)

        result = PotentialMemberships.new(current_user).entries_for_user(user)

        expect(result).not_to include(entry)
      end
    end

    describe '#users_for_account' do
      it 'includes users of managed accounts that are not yet member of the account' do
        managed_account = create(:account)
        current_user = create(:user, :manager, on: managed_account)
        user = create(:user, :member, on: managed_account)
        account = create(:account)

        result = PotentialMemberships.new(current_user).users_for_account(account)

        expect(result).to include(user)
      end

      it 'does not include users that are already members of the account' do
        managed_account = create(:account)
        current_user = create(:user, :manager, on: managed_account)

        user = create(:user, :member, on: managed_account)
        account = create(:account, with_member: user)

        result = PotentialMemberships.new(current_user).users_for_account(account)

        expect(result).not_to include(user)
      end

      it 'does not include users that are not member in a managed account' do
        managed_account = create(:account)
        current_user = create(:user, :manager, on: managed_account)

        user = create(:user)
        account = create(:account)

        result = PotentialMemberships.new(current_user).users_for_account(account)

        expect(result).not_to include(user)
      end
    end

    describe '#users_for_entry' do
      it 'includes users of entry´s account that are not yet member of the entry' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)
        current_user = create(:user, :manager, on: entry)

        result = PotentialMemberships.new(current_user).users_for_entry(entry)

        expect(result).to include(user)
      end

      it 'does not include users that are already member of the entry' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account, with_publisher: user)
        current_user = create(:user, :manager, on: entry)

        result = PotentialMemberships.new(current_user).users_for_entry(entry)

        expect(result).not_to include(user)
      end

      it 'does not include users that are not member of the entry´s account' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry)
        current_user = create(:user, :manager, on: entry)

        result = PotentialMemberships.new(current_user).users_for_entry(entry)

        expect(result).not_to include(user)
      end
    end
  end
end
