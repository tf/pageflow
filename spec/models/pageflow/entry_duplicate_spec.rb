require 'spec_helper'

module Pageflow
  describe EntryDuplicate do
    describe '#build' do
      it 'prepares an unsaved copy without creating records' do
        entry = create(:entry, permalink_attributes: {slug: 'original'})

        expect {
          copy = EntryDuplicate.of(entry).build
          expect(copy).to be_new_record
          expect(copy.permalink).to be_new_record
          expect(copy.permalink.directory).to eq(entry.permalink.directory)
        }.not_to(change { [Entry.count, Revision.count, Permalink.count, Membership.count] })
      end
    end

    describe '#create!' do
      it 'creates an entry with a title containing the original title' do
        entry = create(:entry, title: 'Some Title')

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate).to be_persisted
        expect(duplicate.title).to include('Some Title')
      end

      it 'creates entry with same type, account and site' do
        entry = create(:entry)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.type_name).to eq(entry.type_name)
        expect(duplicate.account).to eq(entry.account)
        expect(duplicate.site).to eq(entry.site)
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
        entry = create(:entry, with_previewer: user)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.users.first).to eq(user)
        expect(duplicate.memberships.first.role).to eq('previewer')
      end

      it 'can omit memberships without adding the creator' do
        entry = create(:entry, with_publisher: create(:user))

        duplicate = EntryDuplicate.of(entry).create!(copy_memberships: false)

        expect(duplicate.memberships).to be_empty
      end

      it 'uses the title and permalink selected before creation' do
        entry = create(:entry, permalink_attributes: {slug: 'original'})
        duplication = EntryDuplicate.of(entry)
        copy = duplication.build
        copy.assign_attributes(title: 'Chosen title', permalink_attributes: {slug: 'chosen-slug'})

        duplicate = duplication.create!(entry: copy)

        expect(duplicate.reload.title).to eq('Chosen title')
        expect(duplicate.permalink.slug).to eq('chosen-slug')
        expect(entry.reload.permalink.slug).to eq('original')
      end

      it 'copies enabled features' do
        entry = create(:entry, features_configuration: {fancy_page_type: true})

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.feature_state('fancy_page_type')).to eq(true)
      end

      it 'copies perma id counter' do
        entry = create(:entry, perma_id_counter: 20)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.perma_id_counter).to eq(entry.perma_id_counter)
      end

      it 'creates a permalink in same directory if original has one' do
        entry = create(
          :entry,
          title: 'My entry',
          permalink_attributes: {
            slug: 'slug',
            directory_path: 'en/'
          }
        )

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: 'copy-of-my-entry',
                              directory: entry.permalink.directory)
      end

      it 'makes permalink slugs unique in directory' do
        account = create(:account)
        permalink_directory = create(
          :permalink_directory,
          site: account.default_site
        )
        create(
          :entry,
          account:,
          permalink_attributes: {
            slug: 'copy-of-my-entry',
            directory: permalink_directory
          }
        )
        entry = create(
          :entry,
          account:,
          title: 'My entry',
          permalink_attributes: {
            slug: 'slug',
            directory: permalink_directory
          }
        )

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: "copy-of-my-entry-#{duplicate.id}",
                              directory: permalink_directory)
      end

      it 'only keeps permalink unique in directory' do
        create(
          :entry,
          permalink_attributes: {
            slug: 'copy-of-my-entry'
          }
        )
        entry = create(
          :entry,
          title: 'My entry',
          permalink_attributes: {
            slug: 'slug',
            directory_path: 'en/'
          }
        )

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: 'copy-of-my-entry',
                              directory: entry.permalink.directory)
      end
    end
  end
end
