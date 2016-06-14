require 'spec_helper'

feature 'deleting own user' do
  scenario 'user is deleted per default configuration' do
    create(:user, :email => 'john@example.com', :password => '@qwert12345')

    Dom::Admin::Page.sign_in(:email => 'john@example.com', :password => '@qwert12345')
    visit('/admin/users/me')
    Dom::Admin::ProfileForm.first.delete_account_link.click
    Dom::Admin::DeleteAccountForm.first.submit_with(:current_password => '@qwert12345')

    expect(Dom::Admin::Page).not_to be_accessible_with(:email => 'john@example.com', :password => '@new12345')
  end

  scenario 'user cannot be deleted when authorize_user_deletion option is set accordingly' do
    create(:user, email: 'john@example.com', password: '@qwert12345')

    Dom::Admin::Page.sign_in(email: 'john@example.com', password: '@qwert12345')

    Pageflow.config.authorize_user_deletion =
      lambda do |user_to_delete|
        if user_to_delete.account.name == 'Account of deleteable users'
          true
        else
          'Deletion is only possible for members of a dedicated account'
        end
      end

    visit('/admin/users/me')

    expect(page).to have_content(Dom::Admin::ProfileForm.first.cannot_delete_comment.text)
  end
end
