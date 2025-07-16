module Pageflow
  module Admin
    # @api private
    class EntryTemplatesTab < ViewComponent
      def build(site)
        table_subjects = site.existing_and_potential_entry_templates

        table_for(table_subjects, i18n: Pageflow::EntryTemplate) do
          column do |entry_template|
            if entry_template.id
              render('admin/accounts/entry_template_details', entry_template:)
            else
              h5(entry_template.translated_entry_type_name)
            end
          end
          column do |entry_template|
            if entry_template.id
              edit_link(entry_template, site)
            else
              new_link(entry_template, site)
            end
          end
        end
      end

      def new_link(entry_template, site)
        link_to(
          I18n.t('active_admin.new'),
          new_admin_site_entry_template_path(
            site,
            entry_template,
            entry_type_name: entry_template.entry_type_name
          )
        )
      end

      def edit_link(entry_template, site)
        link_to(
          I18n.t('active_admin.edit'),
          edit_admin_site_entry_template_path(
            site,
            entry_template
          )
        )
      end
    end
  end
end
