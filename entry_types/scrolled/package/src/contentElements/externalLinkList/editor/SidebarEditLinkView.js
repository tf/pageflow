import {ConfigurationEditorView, TextInputView, CheckBoxInputView} from 'pageflow/ui';
import {editor, FileInputView} from 'pageflow/editor';
import {InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

const previewAspectRatios = {
  wide: 16 / 9,
  narrow: 4 / 3,
  square: 1,
  portrait: 3 / 4
};

export const SidebarEditLinkView = Marionette.Layout.extend({
  template: (data) => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.back')}</a>
    <a class="destroy">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.destroy')}</a>

    <div class='form_container'></div>
  `,
  className: 'edit_external_link',
  regions: {
    formContainer: '.form_container',
  },
  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },
  initialize: function(options) {},
  onRender: function () {
    var configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.externalLinkList.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.externalLinkList.tabs'
    });
    var self = this;
    var thumbnailAspectRatio = this.options.contentElement.configuration.get('thumbnailAspectRatio');

    configurationEditor.tab('edit_link', function () {
      this.input('url', TextInputView);
      this.input('open_in_new_tab', CheckBoxInputView);
      this.input('thumbnail', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElement.externalLinks.link',
        fileSelectionHandlerOptions: {
          contentElementId: self.options.contentElement.get('id')
        },
        positioning: !!previewAspectRatios[thumbnailAspectRatio],
        positioningOptions: {
          preview: previewAspectRatios[thumbnailAspectRatio]
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('title', TextInputView, {
        required: true
      });
      this.input('description', TextInputView, {
        maxLength: 10000
      });
    });
    this.formContainer.show(configurationEditor);
  },
  goBack: function() {
    editor.navigate(`/scrolled/content_elements/${this.options.contentElement.get('id')}`, {trigger: true});
  },
  destroyLink: function () {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_link'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  },
});
