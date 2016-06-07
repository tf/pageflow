require 'spec_helper'

feature 'account manager managing user roles' do
  scenario 'giving a user account permissions' do
    account = create(:account)
    user = create(:user)
    account_manager = Dom::Admin::Page.sign_in_as(:manager, on: account)
    create(:account, with_member: user, with_manager: account_manager)

    visit(admin_user_path(user))

    Dom::Admin::UserPage.first.add_account_link.click
    Dom::Admin::MembershipForm.first.submit_with(role: 'publisher',
                                                    entity: account)
    expect(Dom::Admin::UserPage.first).to have_role_flag('publisher')
  end

  scenario 'editing permissions of a user on an account' do
    user = create(:user)
    account = create(:account, with_member: user)
    Dom::Admin::Page.sign_in_as(:manager, on: account)

    visit(admin_user_path(user))

    Dom::Admin::UserPage.first.edit_account_link.click
    Dom::Admin::MembershipForm.first.submit_with(role: 'publisher')
    expect(Dom::Admin::UserPage.first).to have_role_flag('publisher')
  end

  scenario 'deleting permissions of a user on an account' do
    user = create(:user)
    account = create(:account, with_member: user)
    account_manager = Dom::Admin::Page.sign_in_as(:manager, on: account)
    create(:account, with_previewer: user, with_manager: account_manager)

    visit(admin_user_path(user))

    Dom::Admin::UserPage.first.delete_account_link('member').click
    expect(Dom::Admin::UserPage.first).not_to have_role_flag('member')
  end

  scenario 'deleting last permissions of a user on an account they have in common with the ' \
           'account manager' do
    user = create(:user)
    account = create(:account, with_member: user)
    Dom::Admin::Page.sign_in_as(:manager, on: account)

    visit(admin_user_path(user))

    Dom::Admin::UserPage.first.delete_account_link('member').click
    expect(Dom::Admin::UserPage.first).not_to have_role_flag('member')
  end
end

feature 'managing user roles' do
  context 'as entry manager via entry show page' do
    scenario 'giving a member on the account of entry permissions on that entry' do
      entry = create(:entry)
      create(:user, :member, on: entry.account)
      Dom::Admin::Page.sign_in_as(:manager, on: entry)

      visit(admin_entry_path(entry))

      Dom::Admin::EntryPage.first.add_member_link.click
      Dom::Admin::MembershipForm.first.submit_with(role: 'publisher',
                                                   entity: entry)
      expect(Dom::Admin::EntryPage.first).to have_role_flag('publisher')
    end

    scenario 'editing permissions of a user on an entry' do
      entry = create(:entry)
      create(:user, :previewer, on: entry)
      Dom::Admin::Page.sign_in_as(:manager, on: entry)

      visit(admin_entry_path(entry))

      Dom::Admin::EntryPage.first.edit_role_link('previewer').click
      Dom::Admin::MembershipForm.first.submit_with(role: 'publisher')
      expect(Dom::Admin::EntryPage.first).to have_role_flag('publisher')
    end

    scenario 'deleting permissions of a user on an entry' do
      entry = create(:entry)
      create(:user, :previewer, on: entry)
      Dom::Admin::Page.sign_in_as(:manager, on: entry)

      visit(admin_entry_path(entry))

      Dom::Admin::EntryPage.first.delete_member_link('previewer').click

      expect(Dom::Admin::EntryPage.first).not_to have_role_flag('previewer')
    end
  end

  context 'as account manager via user show page' do
    scenario 'giving a member on the account of entry permissions on that entry' do
      entry = create(:entry)
      user = create(:user, :member, on: entry.account)
      Dom::Admin::Page.sign_in_as(:manager, on: entry.account)

      visit(admin_user_path(user))

      Dom::Admin::UserPage.first.add_entry_membership_link.click
      Dom::Admin::MembershipForm.first.submit_with(role: 'publisher',
                                                   entity: entry)
      expect(Dom::Admin::UserPage.first).to have_role_flag('publisher')
    end

    scenario 'editing permissions of a user on an entry' do
      entry = create(:entry)
      user = create(:user, :previewer, on: entry)
      Dom::Admin::Page.sign_in_as(:manager, on: entry.account)

      visit(admin_user_path(user))

      Dom::Admin::UserPage.first.edit_entry_role_link('previewer').click
      Dom::Admin::MembershipForm.first.submit_with(role: 'publisher')
      expect(Dom::Admin::UserPage.first).to have_role_flag('publisher')
    end

    scenario 'deleting permissions of a user on an entry' do
      entry = create(:entry)
      user = create(:user, :previewer, on: entry)
      Dom::Admin::Page.sign_in_as(:manager, on: entry.account)

      visit(admin_user_path(user))

      Dom::Admin::UserPage.first.delete_member_on_entry_link('previewer').click

      expect(Dom::Admin::UserPage.first).not_to have_role_flag('previewer')
    end
  end
end
