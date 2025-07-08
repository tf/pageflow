module Pageflow
  # @api private
  class Permalink < ApplicationRecord
    extend FriendlyId
    friendly_id :slug_candidates, use: :scoped, scope: :directory

    attr_accessor :allow_empty_slug

    before_validation :set_default_slug

    has_one :entry

    belongs_to :directory, class_name: 'PermalinkDirectory'

    validates(:slug,
              format: {with: /\A[0-9a-zA-Z_-]+\z/, allow_blank: true},
              uniqueness: {scope: :directory})
    validate :slug_present_unless_root_directory

    validate :belongs_to_same_site_as_entry

    before_update(:create_redirect,
                  if: -> { entry.first_published_at.present? && (slug_changed? || directory_changed?) })

    private

    def set_default_slug
      return unless slug == ''

      return if allow_empty_slug.present?
      return if entry && entry.persisted? && directory&.path.blank?

      self.slug = entry.default_permalink_slug
    end

    def slug_present_unless_root_directory
      return unless directory && directory.path.present?

      errors.add(:slug, :blank) if slug.blank?
    end

    def slug_candidates
      [entry.title, "#{entry.title}-#{entry.id}"]
    end

    def should_generate_new_friendly_id?
      slug.nil?
    end

    def belongs_to_same_site_as_entry
      return if !directory || !entry || entry.site_id == directory.site_id

      errors.add(:directory, :invalid)
    end

    def create_redirect
      directory.redirects.where(slug:).delete_all
      entry.permalink_redirects.create!(slug: slug_was,
                                        directory_id: directory_id_was)
    end
  end
end
