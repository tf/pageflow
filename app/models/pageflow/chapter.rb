module Pageflow
  class Chapter < ActiveRecord::Base
    belongs_to :revision, :touch => true
    belongs_to :storyline
    has_many :pages, -> { order('position ASC') }

    delegate :entry, :to => :revision

    serialize :configuration, JSON

    def configuration
      super || {}
    end

    def copy_to(revision, storyline)
      chapter = dup
      chapter.revision = revision
      storyline.chapters << chapter

      pages.each do |page|
        page.copy_to(chapter)
      end
    end
  end
end
