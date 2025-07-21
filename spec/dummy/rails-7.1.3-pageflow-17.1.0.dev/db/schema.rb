# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 9999_00_00_000000) do
  create_table "active_admin_comments", charset: "utf8mb4", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "friendly_id_slugs", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at", precision: nil
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "pageflow_accounts", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "default_file_rights", default: "", null: false
    t.string "landing_page_name", default: "", null: false
    t.integer "default_site_id"
    t.text "features_configuration"
    t.integer "users_count", default: 0, null: false
    t.integer "entries_count", default: 0, null: false
    t.string "custom_field"
    t.index ["default_site_id"], name: "index_pageflow_accounts_on_default_site_id"
  end

  create_table "pageflow_audio_files", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "uploader_id"
    t.string "attachment_on_filesystem_file_name"
    t.string "attachment_on_filesystem_content_type"
    t.bigint "attachment_on_filesystem_file_size"
    t.datetime "attachment_on_filesystem_updated_at", precision: nil
    t.string "attachment_on_s3_file_name"
    t.string "attachment_on_s3_content_type"
    t.bigint "attachment_on_s3_file_size"
    t.datetime "attachment_on_s3_updated_at", precision: nil
    t.integer "job_id"
    t.string "state"
    t.decimal "encoding_progress", precision: 5, scale: 2
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "encoding_error_message"
    t.integer "duration_in_ms"
    t.string "format"
    t.string "rights", default: "", null: false
    t.integer "confirmed_by_id"
    t.integer "parent_file_id"
    t.string "parent_file_model_type"
    t.string "peak_data_file_name"
    t.index ["parent_file_id", "parent_file_model_type"], name: "index_audio_files_on_parent_id_and_parent_model_type"
  end

  create_table "pageflow_authentication_tokens", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "user_id"
    t.string "provider"
    t.text "auth_token"
    t.datetime "expiry_time", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["user_id"], name: "index_pageflow_authentication_tokens_on_user_id"
  end

  create_table "pageflow_chapters", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "position", default: 0, null: false
    t.string "title", default: "", null: false
    t.text "configuration"
    t.integer "storyline_id"
    t.index ["storyline_id"], name: "index_pageflow_chapters_on_storyline_id"
  end

  create_table "pageflow_edit_locks", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "user_id"
    t.integer "entry_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["entry_id"], name: "index_pageflow_edit_locks_on_entry_id"
    t.index ["user_id"], name: "index_pageflow_edit_locks_on_user_id"
  end

  create_table "pageflow_entries", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.string "title", default: "", null: false
    t.string "type_name", default: "paged"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "slug", null: false
    t.integer "account_id"
    t.integer "folder_id"
    t.integer "site_id"
    t.text "features_configuration"
    t.string "password_digest"
    t.datetime "first_published_at", precision: nil
    t.datetime "edited_at", precision: nil
    t.integer "users_count", default: 0, null: false
    t.bigint "permalink_id"
    t.bigint "translation_group_id"
    t.integer "perma_id_counter", default: 0, null: false
    t.string "custom_field"
    t.index ["account_id"], name: "index_pageflow_entries_on_account_id"
    t.index ["folder_id"], name: "index_pageflow_entries_on_folder_id"
    t.index ["permalink_id"], name: "index_pageflow_entries_on_permalink_id"
    t.index ["site_id"], name: "index_pageflow_entries_on_site_id"
    t.index ["slug"], name: "index_pageflow_entries_on_slug", unique: true
    t.index ["translation_group_id"], name: "index_pageflow_entries_on_translation_group_id"
  end

  create_table "pageflow_entry_templates", charset: "utf8mb4", force: :cascade do |t|
    t.string "entry_type_name", null: false
    t.string "theme_name", default: "default"
    t.string "default_author"
    t.string "default_publisher"
    t.string "default_keywords"
    t.string "default_locale", default: "de"
    t.text "default_share_providers"
    t.text "configuration"
    t.bigint "site_id"
    t.index ["site_id", "entry_type_name"], name: "index_pageflow_entry_templates_on_site_id_and_entry_type_name", unique: true
    t.index ["site_id"], name: "index_pageflow_entry_templates_on_site_id"
  end

  create_table "pageflow_entry_translation_groups", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "default_translation_id"
  end

  create_table "pageflow_file_imports", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "entry_id"
    t.integer "file_id"
    t.string "file_type"
    t.string "file_importer"
    t.text "download_options"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["entry_id"], name: "index_pageflow_file_imports_on_entry_id"
  end

  create_table "pageflow_file_usages", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "revision_id"
    t.integer "file_id"
    t.integer "file_perma_id"
    t.string "file_type"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.text "configuration"
    t.index ["file_id", "file_type"], name: "index_pageflow_file_usages_on_file_id_and_file_type"
    t.index ["revision_id", "file_type", "file_perma_id"], name: "index_pageflow_file_usages_on_revision_and_file"
    t.index ["revision_id"], name: "index_pageflow_file_usages_on_revision_id"
  end

  create_table "pageflow_folders", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.string "name"
    t.integer "account_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["account_id"], name: "index_pageflow_folders_on_account_id"
  end

  create_table "pageflow_image_files", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "uploader_id"
    t.string "unprocessed_attachment_file_name"
    t.string "unprocessed_attachment_content_type"
    t.bigint "unprocessed_attachment_file_size"
    t.datetime "unprocessed_attachment_updated_at", precision: nil
    t.string "attachment_on_s3_file_name"
    t.string "attachment_on_s3_content_type"
    t.bigint "attachment_on_s3_file_size"
    t.datetime "attachment_on_s3_updated_at", precision: nil
    t.string "state"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "width"
    t.integer "height"
    t.string "rights", default: "", null: false
    t.integer "parent_file_id"
    t.string "parent_file_model_type"
    t.text "output_presences"
    t.index ["parent_file_id", "parent_file_model_type"], name: "index_image_files_on_parent_id_and_parent_model_type"
  end

  create_table "pageflow_memberships", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "user_id"
    t.integer "entity_id"
    t.string "name"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "entity_type"
    t.string "role", default: "editor", null: false
    t.index ["entity_id"], name: "index_pageflow_memberships_on_entity_id"
    t.index ["user_id"], name: "index_pageflow_memberships_on_user_id"
  end

  create_table "pageflow_other_files", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "entry_id"
    t.bigint "uploader_id"
    t.bigint "parent_file_id"
    t.string "parent_file_model_type"
    t.string "state"
    t.string "rights"
    t.string "attachment_on_s3_file_name"
    t.string "attachment_on_s3_content_type"
    t.bigint "attachment_on_s3_file_size"
    t.datetime "attachment_on_s3_updated_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["entry_id"], name: "index_pageflow_other_files_on_entry_id"
    t.index ["parent_file_id", "parent_file_model_type"], name: "index_other_files_on_parent_id_and_parent_model_type"
    t.index ["uploader_id"], name: "index_pageflow_other_files_on_uploader_id"
  end

  create_table "pageflow_pages", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "chapter_id"
    t.string "template", default: "", null: false
    t.text "configuration"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "position", default: 0, null: false
    t.boolean "display_in_navigation", default: true
    t.integer "perma_id"
    t.index ["chapter_id"], name: "index_pageflow_pages_on_chapter_id"
    t.index ["perma_id"], name: "index_pageflow_pages_on_perma_id"
  end

  create_table "pageflow_permalink_directories", charset: "utf8mb4", force: :cascade do |t|
    t.string "path"
    t.bigint "site_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["site_id"], name: "index_pageflow_permalink_directories_on_site_id"
  end

  create_table "pageflow_permalink_redirects", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "entry_id"
    t.string "slug"
    t.bigint "directory_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["directory_id"], name: "index_pageflow_permalink_redirects_on_directory_id"
    t.index ["entry_id"], name: "index_pageflow_permalink_redirects_on_entry_id"
    t.index ["slug", "directory_id"], name: "index_pageflow_permalink_redirects_on_slug_and_dir", unique: true
  end

  create_table "pageflow_permalinks", charset: "utf8mb4", force: :cascade do |t|
    t.string "slug"
    t.bigint "directory_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["directory_id"], name: "index_pageflow_permalinks_on_directory_id"
    t.index ["slug", "directory_id"], name: "index_pageflow_peralinks_on_slug", unique: true
  end

  create_table "pageflow_revisions", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "creator_id"
    t.datetime "published_at", precision: nil
    t.datetime "published_until", precision: nil
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.text "credits"
    t.string "title", default: "", null: false
    t.text "summary"
    t.boolean "manual_start"
    t.integer "restored_from_id"
    t.datetime "frozen_at", precision: nil
    t.string "snapshot_type"
    t.string "home_url"
    t.boolean "home_button_enabled"
    t.boolean "emphasize_chapter_beginning"
    t.boolean "emphasize_new_pages"
    t.integer "share_image_id"
    t.integer "share_image_x"
    t.integer "share_image_y"
    t.string "locale"
    t.boolean "password_protected"
    t.string "author"
    t.string "publisher"
    t.string "keywords"
    t.text "share_providers"
    t.boolean "overview_button_enabled"
    t.string "share_url", default: "", null: false
    t.string "theme_name", default: "default", null: false
    t.text "configuration"
    t.boolean "noindex"
    t.index ["entry_id", "published_at", "published_until"], name: "index_pageflow_revisions_on_publication_timestamps"
    t.index ["restored_from_id"], name: "index_pageflow_revisions_on_restored_from_id"
  end

  create_table "pageflow_scrolled_chapters", charset: "utf8mb4", force: :cascade do |t|
    t.integer "perma_id"
    t.bigint "storyline_id"
    t.integer "position", default: 0, null: false
    t.text "configuration"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["storyline_id"], name: "index_pageflow_scrolled_chapters_on_storyline_id"
  end

  create_table "pageflow_scrolled_content_elements", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "section_id"
    t.integer "perma_id"
    t.integer "position", default: 0, null: false
    t.string "type_name"
    t.text "configuration"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["section_id"], name: "index_pageflow_scrolled_content_elements_on_section_id"
  end

  create_table "pageflow_scrolled_sections", charset: "utf8mb4", force: :cascade do |t|
    t.integer "perma_id"
    t.bigint "chapter_id"
    t.integer "position", default: 0, null: false
    t.text "configuration"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["chapter_id"], name: "index_pageflow_scrolled_sections_on_chapter_id"
  end

  create_table "pageflow_scrolled_storylines", charset: "utf8mb4", force: :cascade do |t|
    t.integer "perma_id"
    t.bigint "revision_id"
    t.integer "position", default: 0, null: false
    t.text "configuration"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["revision_id"], name: "index_pageflow_scrolled_storylines_on_revision_id"
  end

  create_table "pageflow_sites", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.string "imprint_link_url"
    t.string "imprint_link_label"
    t.string "copyright_link_url"
    t.string "copyright_link_label"
    t.integer "account_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "cname", default: "", null: false
    t.string "home_url", default: "", null: false
    t.string "additional_cnames"
    t.string "privacy_link_url"
    t.string "canonical_entry_url_prefix"
    t.boolean "trailing_slash_in_canonical_urls"
    t.string "name"
    t.boolean "feeds_enabled"
    t.boolean "sitemap_enabled"
    t.string "title"
    t.string "custom_feed_url"
    t.string "cutoff_mode_name"
    t.bigint "custom_404_entry_id"
    t.string "custom_field"
    t.index ["cname"], name: "index_pageflow_sites_on_cname"
    t.index ["custom_404_entry_id"], name: "index_pageflow_sites_on_custom_404_entry_id"
  end

  create_table "pageflow_storylines", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "perma_id"
    t.integer "revision_id"
    t.integer "position"
    t.text "configuration"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["revision_id"], name: "index_pageflow_storylines_on_revision_id"
  end

  create_table "pageflow_text_track_files", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "uploader_id"
    t.string "state"
    t.string "rights"
    t.string "attachment_on_filesystem_file_name"
    t.string "attachment_on_filesystem_content_type"
    t.bigint "attachment_on_filesystem_file_size"
    t.datetime "attachment_on_filesystem_updated_at", precision: nil
    t.string "attachment_on_s3_file_name"
    t.string "attachment_on_s3_content_type"
    t.bigint "attachment_on_s3_file_size"
    t.datetime "attachment_on_s3_updated_at", precision: nil
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "parent_file_id"
    t.string "parent_file_model_type"
    t.text "configuration"
    t.string "processed_attachment_file_name"
    t.string "processed_attachment_content_type"
    t.bigint "processed_attachment_file_size"
    t.datetime "processed_attachment_updated_at", precision: nil
    t.index ["entry_id"], name: "index_pageflow_text_track_files_on_entry_id"
    t.index ["parent_file_id", "parent_file_model_type"], name: "index_text_track_files_on_parent_id_and_parent_model_type"
    t.index ["uploader_id"], name: "index_pageflow_text_track_files_on_uploader_id"
  end

  create_table "pageflow_theme_customization_files", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "theme_customization_id"
    t.string "type_name"
    t.string "attachment_file_name"
    t.string "attachment_content_type"
    t.integer "attachment_file_size"
    t.datetime "attachment_updated_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["theme_customization_id"], name: "index_pageflow_theme_customization_files_on_customization"
  end

  create_table "pageflow_theme_customizations", charset: "utf8mb4", force: :cascade do |t|
    t.string "entry_type_name"
    t.text "overrides"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "selected_file_ids"
    t.bigint "site_id"
    t.index ["site_id"], name: "index_pageflow_theme_customizations_on_site_id"
  end

  create_table "pageflow_video_files", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "uploader_id"
    t.string "attachment_on_filesystem_file_name"
    t.string "attachment_on_filesystem_content_type"
    t.bigint "attachment_on_filesystem_file_size"
    t.datetime "attachment_on_filesystem_updated_at", precision: nil
    t.string "attachment_on_s3_file_name"
    t.string "attachment_on_s3_content_type"
    t.bigint "attachment_on_s3_file_size"
    t.datetime "attachment_on_s3_updated_at", precision: nil
    t.integer "job_id"
    t.string "state"
    t.decimal "encoding_progress", precision: 5, scale: 2
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "encoding_error_message"
    t.string "thumbnail_file_name"
    t.integer "width"
    t.integer "height"
    t.integer "duration_in_ms"
    t.string "format"
    t.string "poster_file_name"
    t.string "poster_content_type"
    t.string "thumbnail_content_type"
    t.string "rights", default: "", null: false
    t.integer "confirmed_by_id"
    t.text "output_presences"
    t.integer "parent_file_id"
    t.string "parent_file_model_type"
    t.index ["parent_file_id", "parent_file_model_type"], name: "index_video_files_on_parent_id_and_parent_model_type"
  end

  create_table "pageflow_widgets", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.string "subject_type"
    t.integer "subject_id"
    t.string "type_name"
    t.string "role"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.text "configuration"
  end

  create_table "test_deeply_nested_revision_components", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "parent_id"
    t.integer "perma_id"
    t.string "text"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "test_multi_attachment_files", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "uploader_id"
    t.integer "parent_file_id"
    t.string "parent_file_model_type"
    t.string "state"
    t.string "rights"
    t.string "first_attachment_file_name"
    t.string "first_attachment_content_type"
    t.bigint "first_attachment_file_size"
    t.datetime "first_attachment_updated_at", precision: nil
    t.string "second_attachment_file_name"
    t.string "second_attachment_content_type"
    t.bigint "second_attachment_file_size"
    t.datetime "second_attachment_updated_at", precision: nil
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["entry_id"], name: "index_test_multi_attachment_files_on_entry_id"
    t.index ["uploader_id"], name: "index_test_multi_attachment_files_on_uploader_id"
  end

  create_table "test_nested_revision_components", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "parent_id"
    t.integer "perma_id"
    t.string "text"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "test_revision_components", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "revision_id"
    t.integer "perma_id"
    t.string "text"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "test_uploadable_files", id: :integer, charset: "utf8mb4", force: :cascade do |t|
    t.integer "entry_id"
    t.integer "uploader_id"
    t.integer "parent_file_id"
    t.string "parent_file_model_type"
    t.string "state"
    t.string "rights"
    t.string "attachment_on_filesystem_file_name"
    t.string "attachment_on_filesystem_content_type"
    t.bigint "attachment_on_filesystem_file_size"
    t.datetime "attachment_on_filesystem_updated_at", precision: nil
    t.string "attachment_on_s3_file_name"
    t.string "attachment_on_s3_content_type"
    t.bigint "attachment_on_s3_file_size"
    t.datetime "attachment_on_s3_updated_at", precision: nil
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "custom"
    t.integer "related_image_file_id"
    t.index ["entry_id"], name: "index_test_uploadable_files_on_entry_id"
    t.index ["uploader_id"], name: "index_test_uploadable_files_on_uploader_id"
  end

  create_table "users", charset: "utf8mb4", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "failed_attempts", default: 0
    t.datetime "locked_at", precision: nil
    t.string "first_name"
    t.string "last_name"
    t.datetime "suspended_at", precision: nil
    t.string "locale"
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
