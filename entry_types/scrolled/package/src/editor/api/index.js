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
    }
  }
}
