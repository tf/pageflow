require 'spec_helper'

module Pageflow
  describe InvitationPolicy do
    describe 'create?' do
      it 'does not permit creation of entry invitations when invitation workflows are turned '\
         'off' do
        Pageflow.config.invitation_workflows = false
        admin = create(:user, :admin)
        user = create(:user)
        account = create(:account, with_manager: user)
        entry = create(:entry, account: account)
        expect(InvitationPolicy.new(admin, create(:invitation,
                                                  entity: entry,
                                                  user: user,
                                                  role: :previewer))).not_to permit_action(:create)
      end

      it 'does not permit creation of account invitations when invitation workflows are turned '\
         'off' do
        Pageflow.config.invitation_workflows = false
        admin = create(:user, :admin)
        account = create(:account)
        expect(InvitationPolicy.new(admin, create(:invitation,
                                                  entity: account,
                                                  user: create(:user),
                                                  role: :member))).not_to permit_action(:create)
      end
    end
  end
end
