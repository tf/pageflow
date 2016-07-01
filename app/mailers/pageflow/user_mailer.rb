module Pageflow
  class UserMailer < ActionMailer::Base
    include Resque::Mailer

    def welcome_mail(options)
      @user = User.find(options['user_id'])
      @password_token = options['password_token']
      mail_with_user_locale
    end

    def invitation(options)
      @user = User.find(options['user_id'])
      @account_id = options['account_id']
      mail_with_user_locale
    end

    private

    def mail_with_user_locale
      I18n.with_locale(@user.locale) do
        headers('X-Language' => I18n.locale)
        mail(to: @user.email, subject: t('.subject'), from: Pageflow.config.mailer_sender)
      end
    end
  end
end
