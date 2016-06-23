module Pageflow
  # Specialized User class containing invitation logic used by in the
  # users admin.
  class InvitedUser < User
    attr_accessor :initial_account, :initial_role

    before_create :prepare_welcome_mail
    after_create :send_welcome_mail

    def send_welcome_mail!
      prepare_welcome_mail
      save(validate: false)
      send_welcome_mail
    end

    private

    def prepare_welcome_mail
      @token = generate_reset_password_token
    end

    def generate_reset_password_token
      raw, enc = Devise.token_generator.generate(self.class, :reset_password_token)

      self.reset_password_token = enc
      self.reset_password_sent_at = Time.now.utc

      raw
    end

    def password_required?
      false
    end

    def send_welcome_mail
      UserMailer.welcome_mail('user_id' => id, 'password_token' => @token).deliver
    end
  end
end
