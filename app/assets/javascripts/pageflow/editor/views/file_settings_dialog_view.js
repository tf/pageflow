pageflow.FileSettingsDialogView = Backbone.Marionette.ItemView.extend({
  template: 'templates/file_settings_dialog',
  className: 'file_settings dialog',

  mixins: [pageflow.dialogView],

  onRender: function() {
    that = this;
    this.tabsView = new pageflow.TabsView({
      model: this.model,
      i18n: 'pageflow.editor.file_settings_dialog.tabs',
      defaultTab: this.options.tabName,
      className: 'tabs_view box'
    });

    _.each(this.model.fileType().settingsDialogTabConstructors,
           function(settingsDialogTabConstructor) {
             var newTab = new settingsDialogTabConstructor({model: that.model});
      that.tab(newTab);
    });

    this.$el.append(this.subview(this.tabsView).el);
  },

  tab: function(settingsDialogTab) {
    this.tabsView.tab(settingsDialogTab.name, _.bind(function() {
      return this.subview(settingsDialogTab);
    }, this));
  }
});

pageflow.FileSettingsDialogView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.FileSettingsDialogView(options).render());
};
