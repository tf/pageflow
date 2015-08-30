require 'spec_helper'

module Pageflow
  describe EntryDuplicate do
    describe '#create!' do
      it 'creates an entry with a title containing the original title' do
        entry = create(:entry, title: 'Some Title')

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate).to be_persisted
        expect(duplicate.title).to include('Some Title')
      end

      it 'creates entry with same account and theming' do
        entry = create(:entry)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.account).to eq(entry.account)
        expect(duplicate.theming).to eq(entry.theming)
      end

      it 'copies draft' do
        entry = create(:entry, title: 'Some Title')
        create(:chapter,
               in_main_storyline_of: entry.draft,
               title: 'Original Chapter')

        duplicate = EntryDuplicate.of(entry).create!
        chapter_titles = duplicate.draft.chapters.map(&:title)

        expect(chapter_titles).to eq(['Original Chapter'])
      end

      it 'copies memberships' do
        user = create(:user)
        entry = create(:entry, with_member: user)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.users.first).to eq(user)
      end
    end
  end
end
