module Pageflow
  class RevisionComponents # rubocop:todo Style/Documentation
    include Enumerable

    def initialize
      @revision_components = []
      @create_defaults_hooks = []
    end

    def register(revision_component, create_defaults: false)
      return if @revision_components.include?(revision_component)

      @revision_components << revision_component

      return unless create_defaults

      @create_defaults_hooks << ->(revision) { revision_component.create_defaults(revision) }
    end

    def each(&)
      @revision_components.each(&)
    end

    def create_defaults(revision)
      @create_defaults_hooks.each { |hook| hook.call(revision) }
    end
  end
end
