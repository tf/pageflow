require 'spec_helper'

module Pageflow
  describe Entry do
    context 'on create' do
      before do
        pageflow_configure do |config|
          TestEntryType.register(config, name: 'test')
        end
      end

      it 'creates a draft' do
        entry = create(:entry)

        expect(entry.draft).to be_present
      end

      it 'can skip draft creation' do
        entry = create(:entry, skip_draft_creation: true)

        expect(entry.draft).to be_blank
      end

      it 'sets draft config to config of available entry template' do
        entry_template = create(:entry_template,
                                configuration: {color_scheme: 'purple'},
                                entry_type_name: 'test')
        entry = create(:entry,
                       site: entry_template.site,
                       type_name: entry_template.entry_type_name)

        expect(entry.draft.configuration['color_scheme'])
          .to eq(entry_template.configuration['color_scheme'])
      end

      it 'copies widgets from entry template to draft' do
        entry_template = create(:entry_template, entry_type_name: 'test')
        create(:widget,
               subject: entry_template,
               role: 'header',
               type_name: 'site_header')
        entry = create(:entry,
                       site: entry_template.site,
                       type_name: entry_template.entry_type_name)

        expect(entry.draft.widgets).to include_record_with(role: 'header', type_name: 'site_header')
      end

      it 'creates initial revision components in draft' do
        revision_component = Class.new(TestRevisionComponent) do
          def self.create_defaults(draft)
            create!(revision: draft, text: 'Default')
          end
        end

        pageflow_configure do |config|
          config.revision_components.register(revision_component, create_defaults: true)
        end

        entry = create(:entry)
        default_component = TestRevisionComponent.all_for_revision(entry.draft).first

        expect(default_component).to have_attributes(text: 'Default')
      end

      it 'does not create initial components if create_defaults option is not set' do
        revision_component = Class.new(TestRevisionComponent) do
          def self.create_defaults(draft)
            create!(revision: draft, text: 'Default')
          end
        end

        pageflow_configure do |config|
          config.revision_components.register(revision_component)
        end

        entry = create(:entry)

        expect(TestRevisionComponent.all_for_revision(entry.draft)).to be_empty
      end

      it 'supports entry type specific initial revision components' do
        revision_component = Class.new(TestRevisionComponent) do
          def self.create_defaults(draft)
            create!(revision: draft, text: 'Default')
          end
        end

        pageflow_configure do |config|
          rainbow_entry_type = TestEntryType.register(config, name: 'rainbow')

          config.for_entry_type(rainbow_entry_type) do |c|
            c.revision_components.register(revision_component, create_defaults: true)
          end
        end

        rainbow_entry = create(:entry, type_name: 'rainbow')
        other_entry = create(:entry)

        expect(TestRevisionComponent.all_for_revision(rainbow_entry.draft)).not_to be_empty
        expect(TestRevisionComponent.all_for_revision(other_entry.draft)).to be_empty
      end

      it 'copies meta defaults from entry template' do
        entry_template = create(:entry_template,
                                default_author: 'Codevise',
                                default_publisher: 'Codevise Solutions',
                                default_keywords: 'codevise, story',
                                entry_type_name: 'test')
        entry = create(:entry,
                       type_name: entry_template.entry_type_name,
                       site: entry_template.site)

        expect(entry.draft.author).to eq('Codevise')
        expect(entry.draft.publisher).to eq('Codevise Solutions')
        expect(entry.draft.keywords).to eq('codevise, story')
      end

      it 'copies meta defaults from the configuration' do
        pageflow_configure do |config|
          config.default_author_meta_tag = 'Prof. Dr. Sahra Isak'
          config.default_publisher_meta_tag = 'Kempe-Heuck'
          config.default_keywords_meta_tag = 'story, environment'
        end

        entry = create(:entry)

        expect(entry.draft.author).to eq('Prof. Dr. Sahra Isak')
        expect(entry.draft.publisher).to eq('Kempe-Heuck')
        expect(entry.draft.keywords).to eq('story, environment')
      end
    end

    describe '#draft' do
      it 'sets inverse of association' do
        entry = create(:entry)

        expect(entry.draft.entry).to be(entry)
      end
    end

    describe '#published_revision' do
      it 'sets inverse of association' do
        entry = create(:entry, :published)

        expect(entry.published_revision.entry).to be(entry)
      end
    end

    describe '#entry_type' do
      it 'returns entry type' do
        pageflow_configure do |config|
          TestEntryType.register(config, name: 'test')
        end

        entry = create(:entry, type_name: 'test')

        expect(entry.entry_type.name).to eq('test')
      end
    end

    context 'validation' do
      it 'ensures folder belongs to same account' do
        folder = build(:folder, account: build_stubbed(:account))
        entry = build(:entry, account: build_stubbed(:account))

        entry.folder = folder

        expect(entry).to have(1).error_on(:folder)
      end

      it 'ensures entry type is available for account' do
        account = create(:account, features_configuration: {'paged_entry_type' => false})
        entry = build(
          :entry,
          type_name: 'paged',
          account:
        )

        expect(entry).to have(1).error_on(:type_name)
      end
    end

    describe '#publish' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)

        expect {
          entry.publish(creator:)
        }.to(change { entry.revisions.count })
      end

      it 'publishes the entry' do
        creator = create(:user)
        entry = create(:entry)

        entry.publish(creator:)

        expect(entry).to be_published
      end

      it 'resets cached published_revision' do
        creator = create(:user)
        entry = create(:entry, :published)

        revision = entry.published_revision
        entry.publish(creator:)

        expect(entry.published_revision).not_to eq(revision)
      end

      it 'depublishes eariler revisions' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry:, published_at: 1.week.ago)

        entry.publish(creator:)

        expect(earlier_revision.reload).not_to be_published
      end

      it 'saves creator' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.publish(creator:)

        expect(revision.creator).to be(creator)
      end

      it 'freezes created revision' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.publish(creator:)

        expect(revision).to be_frozen
      end

      it 'sets first_published_at on first publication' do
        creator = create(:user)
        entry = create(:entry)

        entry.publish(creator:)

        expect(entry.first_published_at).to be_present
      end

      it 'does not set first_published_at if it is already present' do
        creator = create(:user)
        entry = create(:entry, first_published_at: 1.day.ago)

        entry.publish(creator:)

        expect(entry.first_published_at).to eq(1.day.ago)
      end

      it 'does not set noindex flag' do
        creator = create(:user)
        entry = create(:entry)

        entry.publish(creator:)

        expect(entry.published_revision.noindex).not_to eq(true)
      end

      context 'with :published_until option' do
        it 'publishes entry directly' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(published_until: 1.month.from_now, creator:)

          expect(entry).to be_published
        end

        it 'schedules depublication' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(published_until: 1.month.from_now, creator:)

          Timecop.freeze(1.month.from_now) do
            expect(entry).not_to be_published
          end
        end
      end

      context 'with :password and :password_protected option' do
        it 'publishes entry with password protection' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:,
                        password_protected: true,
                        password: 'abc123abc')

          expect(entry).to be_published_with_password('abc123abc')
        end
      end

      context 'with :password options but with :password_protected option false' do
        it 'publishes entry without password protection' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:,
                        password_protected: false,
                        password: 'abc123abc')

          expect(entry).to be_published_without_password
        end

        it 'does not store password' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:,
                        password_protected: false,
                        password: 'abc123abc')

          expect {
            entry.publish(creator:,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end

        it 'forgets password' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:,
                        password_protected: true,
                        password: 'abc123abc')
          entry.publish(creator:,
                        password_protected: false)

          expect {
            entry.publish(creator:,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end
      end

      context 'with :password_protected but without :password option' do
        it 'publishes entry with same password previously published with' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:,
                        password_protected: true,
                        password: 'abc123abc')
          entry.publish(creator:,
                        password_protected: true)

          expect(entry).to be_published_with_password('abc123abc')
        end

        it 'fails if entry has not been published yet' do
          creator = create(:user)
          entry = create(:entry)

          expect {
            entry.publish(creator:,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end

        it 'fails if entry was previously published without password protection' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:)

          expect {
            entry.publish(creator:,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end
      end

      describe 'with :noindex options' do
        it 'sets noindex flag on created revision' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator:,
                        noindex: true)

          expect(entry.published_revision.noindex).to eq(true)
        end
      end
    end

    describe '#restore' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry:)

        expect {
          entry.restore(revision: earlier_revision, creator:)
        }.to(change { entry.revisions.count })
      end

      it 'freezes previous draft' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry:)

        draft_before_restore = entry.draft
        entry.restore(revision: earlier_revision, creator:)

        expect(draft_before_restore.reload).to be_frozen
      end

      it 'turns previous draft into snapshot of type before_restore' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry:)

        draft_before_restore = entry.draft
        entry.restore(revision: earlier_revision, creator:)

        expect(draft_before_restore.reload.snapshot_type).to eq('before_restore')
      end

      context 'for published revision' do
        it 'turns copy of passed revision into new draft' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :published, title: 'the way it was', entry:)

          entry.restore(revision: earlier_revision, creator:)

          expect(entry.reload_draft.title).to eq('the way it was')
        end

        it 'resets password_protected flag' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision,
                                    :published,
                                    title: 'the way it was',
                                    entry:,
                                    password_protected: true)

          entry.restore(revision: earlier_revision, creator:)

          expect(entry.reload_draft).not_to be_password_protected
        end

        it 'resets noindex flag' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision,
                                    :published,
                                    title: 'the way it was',
                                    entry:,
                                    noindex: true)

          entry.restore(revision: earlier_revision, creator:)

          expect(entry.reload_draft.noindex).to be_nil
        end
      end

      context 'for snapshot revision' do
        it 'turns copy of passed revision into new draft' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :auto_snapshot, title: 'the way it was',
                                                               entry:)

          entry.restore(revision: earlier_revision, creator:)

          expect(entry.reload_draft.title).to eq('the way it was')
        end

        it 'resets snapshot type' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :auto_snapshot, title: 'the way it was',
                                                               entry:)

          entry.restore(revision: earlier_revision, creator:)

          expect(Revision.auto_snapshots).not_to include(entry.reload_draft)
        end
      end

      it 'saves creator in previous draft' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry:)

        draft_before_restore = entry.draft
        entry.restore(revision: earlier_revision, creator:)

        expect(draft_before_restore.reload.creator).to eq(creator)
      end

      it 'saves which revision was restored from' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry:)

        entry.restore(revision: earlier_revision, creator:)

        expect(entry.reload_draft.restored_from).to eq(earlier_revision)
      end
    end

    describe '#snaphot' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)

        expect {
          entry.snapshot(creator:)
        }.to(change { entry.revisions.count })
      end

      it 'saves creator' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator:)

        expect(revision.creator).to be(creator)
      end

      it 'freezes created revision' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator:)

        expect(revision).to be_frozen
      end

      it 'sets snapshot type to auto' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator:)

        expect(revision.snapshot_type).to eq('auto')
      end

      it 'allows to set snapshot type to user' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator:, type: 'user')

        expect(revision.snapshot_type).to eq('user')
      end
    end
  end

  describe '#duplicate' do
    it 'creates a new entry' do
      entry = create(:entry)

      expect { entry.duplicate }.to(change { Entry.count })
    end
  end

  describe '.include_account_name' do
    it 'sets virtual attribute on records' do
      account = create(:account, name: 'Some account')
      create(:entry, account:)

      entry = Entry.include_account_name.first

      expect(entry.account_name).to eq('Some account')
    end
  end

  describe 'serialization' do
    it 'does not include password_digest' do
      entry = build(:entry, password_digest: 'secret')

      expect(entry.to_json).not_to include('secret')
    end

    it 'does not include features configuration' do
      entry = build(:entry, features_configuration: {some_feature: true})

      expect(entry.to_json).not_to include('some_feature')
    end
  end
end
