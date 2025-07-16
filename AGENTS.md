# Contributor Guide

## Development

- Run specs via `bin/rspec <path-to-spec>`
- After adding a migration, do not run `bin/rails db:migrate`. Instead
  delete the directory `spec/dummy/*`. Invoking `bin/rspec` will
  re-generate the dummy up including the new migration and re-create
  the test database.
- When done, run `bundle exec rubocop` to ensure changes do not
  introduce new offenses. NEVER fix rubocop offenses via
  rubocop:disable comment.
