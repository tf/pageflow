# Contributor Guide

## Development

- Make sure all changes you made are covered by tests.

### Ruby

- Run specs via `bin/rspec <path-to-spec>`
- After adding a migration, do not run `bin/rails db:migrate`. Instead
  delete the directory `spec/dummy/*`. Invoking `bin/rspec` will
  re-generate the dummy up including the new migration and re-create
  the test database.
- Run specs from `entry_types/*` by changing to directory
  `entry_types/scrolled` or `entry_types/paged` and invoking
  `bin/rspec` from there.
- When done, run `bundle exec rubocop` to ensure changes do not
  introduce new offenses. NEVER fix rubocop offenses via
  rubocop:disable comment.

### JS

- Run Jest specs via `yarn test` from `package/` or
  `entry_types/scrolled/package`.
- When testing components that use I18n, use
  `support.useFakeTranslations()` to provide test translations

### Marionette View Guidelines

- Use testing-library/dom instead of jQuery methods like `view.$` in
  specs
- Example: Use `const getByRole = within(view.render().el);
  getByRole('button', {name: /text/i})` instead of `view.$('.button')`
- Always use named selectors via the `ui` object instead of `this.$`
  in views
- Example: Define `ui: { button: '.my-button' }` then use
  `this.ui.button` instead of `this.$('.my-button')`
- This provides better maintainability and clearer intent
