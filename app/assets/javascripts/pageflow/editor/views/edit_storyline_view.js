pageflow.EditStorylineView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_storyline',
  className: 'edit_storyline',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    formContainer: '.form_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model.configuration
    });

    this.configure(configurationEditor);
    this.formContainer.show(configurationEditor);
  },

  configure: function(configurationEditor) {
    var view = this;

    configurationEditor.tab('general', function() {
      this.input('title', pageflow.TextInputView);

      if (pageflow.features.isEnabled('chapter_hierachy')) {
        this.input('parent_page_perma_id', pageflow.PageLinkInputView);
        this.input('display_parent_page_button', pageflow.CheckBoxInputView);
        this.input('navigation_bar_mode', pageflow.SelectInputView, {
          values: pageflow.ChapterFilter.strategies
        });
      }
    });
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.editor.views.edit_storyline_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});