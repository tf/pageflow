require 'spec_helper'

module Pageflow
  describe InvitedUser do
    it 'is valid without password' do
      user = InvitedUser.new(attributes_for(:valid_user,
                                            password: nil,
                                            password_confirmation: nil))

      expect(user).to be_valid
    end

    describe '#send_welcome_mail!' do
      it 'delivers welcome email' do
        user = create(:invited_user)

        expect(UserMailer).to receive(:welcome_mail)
          .with('user_id' => user.id, 'password_token' => kind_of(String))
          .and_return(double(deliver: true))

        user.send_welcome_mail!
      end

      it 'generates password reset token' do
        user = build(:invited_user)

        user.send_welcome_mail!

        expect(user.reset_password_token).to be_present
      end
    end

    describe '#save' do
      it 'sends welcome email on creation' do
        user = build(:invited_user, password: nil)

        expect(UserMailer).to receive(:welcome_mail)
          .with('user_id' => kind_of(Numeric),
                'password_token' => kind_of(String))
          .and_return(double(deliver: true))

        user.save
      end

      it 'generates password reset token' do
        user = build(:invited_user, password: nil)

        user.save

        expect(user.reset_password_token).to be_present
      end

      it 'does not send welcome email on update' do
        user = create(:invited_user, password: nil)

        expect(UserMailer).not_to receive(:welcome_mail)
        user.update_attributes(first_name: 'new name')
      end
    end
  end
end
