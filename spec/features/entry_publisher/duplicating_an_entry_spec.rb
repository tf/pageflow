require 'spec_helper'

feature 'as entry publisher, duplicating an entry' do
  scenario 'entry is duplicated' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(admin_entry_path(entry))
    expect {
      Dom::Admin::EntryPage.first.duplicate_button.click
    }.not_to(change { Pageflow::Entry.count })
    expect(page).to have_checked_field(I18n.t('pageflow.admin.entries.copy_memberships'))
    expect(page).not_to have_selector('#entry_type_name')
    Dom::Admin::EntryForm.first.submit_with(title: 'My Copy of Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('My Copy of Test Title')
  end

  scenario 'title updates the permalink suggestion before creating a copy', js: true do
    entry = create(:entry, title: 'Test Entry', permalink_attributes: {slug: 'original'})
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(duplicate_admin_entry_path(entry))
    fill_in('entry_title', with: 'Chosen Title')
    expect(page).to have_selector('#entry_permalink_attributes_slug[placeholder="chosen-title"]')
    fill_in('entry_permalink_attributes_slug', with: 'chosen-slug')
    choose(I18n.t('pageflow.admin.entries.without_memberships'))
    click_button(I18n.t('pageflow.admin.entries.duplicate'))

    expect(page).to have_current_path(admin_entries_path)
    copy = Pageflow::Entry.order(:id).last
    expect(copy.title).to eq('Chosen Title')
    expect(copy.permalink.slug).to eq('chosen-slug')
    expect(copy.memberships).to be_empty
  end
end
