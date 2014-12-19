module Pageflow
  class Plugin
    def configure(config)
    end

    def application_javascripts
      []
    end

    def editor_javascripts
      []
    end

    def application_stylesheets
      []
    end

    def editor_stylesheets
      []
    end
  end
end

# pageflow/plugins.js
# //= require_virtual 'pageflow/plugins'
#
# pageflow/plugins.css.scss
# @import "virtual/pageflow/plugins"
#
# pageflow/editor/plugins.css.scss
# @import "virtual/pageflow/plugins"
