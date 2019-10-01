module Pageflow
  class CredentialsController < Pageflow::ApplicationController
    def create
      @hash = request.env['omniauth.auth'].to_json
      render 'callback', layout: false
    end
  end
end
