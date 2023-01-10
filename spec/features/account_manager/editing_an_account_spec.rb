require 'spec_helper'

feature 'as account manager, editing an account' do
  scenario 'changing name' do
    account = create(:account, name: 'Codevise')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(name: 'Codevise Solutions')

    expect(Dom::Admin::AccountPage.first.name).to eq('Codevise Solutions')
  end
end
