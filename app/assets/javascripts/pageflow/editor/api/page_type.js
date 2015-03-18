pageflow.PageType = pageflow.Object.extend({
  initialize: function(name, options, seed) {
    this.name = name;
    this.options = options;
    this.seed = seed;
  },

  translationKey: function() {
    return this.seed.translation_key;
  },

  thumbnailCandidates: function() {
    return this.seed.thumbnail_candidates;
  },

  defaultConfiguration: function() {
    return this.seed.default_configuration;
  },

  pageLinks: function(configuration) {
    if ('pageLinks' in this.options) {
      return this.options.pageLinks(configuration);
    }
  },

  configurationEditorView: function() {
    return this.options.configurationEditorView ||
      pageflow.ConfigurationEditorView.repository[this.name];
  },

  embeddedViews: function() {
    return this.options.embeddedViews;
  },

  createConfigurationEditorView: function(options) {
    var constructor = this.configurationEditorView();
    options.pageType = this.seed;

    return new constructor(options);
  }
});
