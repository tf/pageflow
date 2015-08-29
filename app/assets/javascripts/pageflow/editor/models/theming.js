pageflow.Theming = Backbone.Model.extend({
  modelName: 'theming',
  i18nKey: 'pageflow/theming',
  collectionName: 'themings',

  mixins: [pageflow.widgetSubject],

  hasHomeButton: function() {
    return this.get('home_button');
  },

  supportsEmphasizedPages: function() {
    return this.get('emphasized_pages');
  },

  supportsScrollIndicatorModes: function() {
    return this.get('scroll_indicator_modes');
  },

  hasConfigurableParentPageButton: function() {
    return this.get('configurable_parent_page_button');
  },

  supportsNavigationBarModes: function() {
    return this.get('navigation_bar_modes');
  }
});
