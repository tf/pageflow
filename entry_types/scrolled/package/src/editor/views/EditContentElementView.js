import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {failureIndicatingView} from 'pageflow/editor';
import {ConfigurationEditorView} from 'pageflow/ui';

export const EditContentElementView = Marionette.Layout.extend({
  template: () => `
    <a class="back">${I18n.t('pageflow.editor.templates.edit_page.outline')}</a>
    <a class="destroy">${I18n.t('pageflow.editor.templates.edit_page.destroy')}</a>

    <div class="failure">
      <p>${I18n.t('pageflow.editor.templates.edit_page.save_error')}</p>
      <p class="message"></p>
      <a class="retry" href="">${I18n.t('pageflow.editor.templates.edit_page.retry')}</a>
    </div>

    <div class="configuration_container"></div>
  `,

  mixins: [failureIndicatingView],

  regions: {
    configurationContainer: '.configuration_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  onRender: function() {
    this.configurationEditor = new ConfigurationEditorView({
      tabTranslationKeyPrefix: `pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}.tabs`,
      attributeTranslationKeyPrefixes: [`pageflow_scrolled.editor.content_elements.${this.model.get('typeName')}.attributes`],
      model: this.model.configuration
    });

    this.options.scrolledApi.scrolledContentElements
        .setupConfigurationEditor(this.model.get('typeName'),
                                  this.configurationEditor);

    this.configurationContainer.show(this.configurationEditor);
  },

  onShow: function() {
    this.configurationEditor.refreshScroller();
  },

  destroy: function() {
    if (window.confirm(I18n.t('pageflow.editor.views.edit_page_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    this.options.api.navigate('/', {trigger: true});
  }
});
