import Backbone from 'backbone';
import I18n from 'i18n-js'

const contentElementTypes = {};

export const editor = {
  scrolledContentElements: {
    register(typeName, options) {
      contentElementTypes[typeName] = options;
    },

    setupConfigurationEditor(name, configurationEditorView, options) {
      if (!contentElementTypes[name]) {
        throw new Error(`Unknown content element type ${name}`);
      }

      return contentElementTypes[name].configurationEditor.call(configurationEditorView, options);
    },

    toCollection() {
      return new Backbone.Collection(Object.keys(contentElementTypes).map(name => {
        return {
          typeName: name,
          displayName: I18n.t(`pageflow_scrolled.editor.content_elements.${name}.name`)
        }
      }));
    }
  }
}
