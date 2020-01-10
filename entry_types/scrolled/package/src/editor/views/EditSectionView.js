import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {failureIndicatingView, FileInputView, ColorInputView} from 'pageflow/editor';
import {ConfigurationEditorView, SelectInputView, CheckBoxInputView} from 'pageflow/ui';

export const EditSectionView = Marionette.Layout.extend({
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
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.edit_section.tabs',
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.edit_section.attributes'],
      model: this.model.configuration
    });

    this.configurationEditor.tab('section', function() {
      this.input('backdropType', SelectInputView, {
        values: ['image', 'color'],
        texts: ['Bild', 'Farbe']
      });
      this.input('backdropImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image'
      });
      this.input('backdropImage', ColorInputView, {
        visibleBinding: 'backdropType',
        visibleBindingValue: 'color'
      });
      this.input('invert', CheckBoxInputView);
    });

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
