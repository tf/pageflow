/**
 * Reusable Backbone views for the editor and admin interface.
 * @module pageflow.ui
 */
pageflow.ui = {
  /**
   * Basic input views for forms.
   * @module pageflow.ui.inputs
   */
  inputs: {
    CheckBoxInputView: pageflow.CheckBoxInputView,
    ProxyUrlInputView: pageflow.ProxyUrlInputView,
    SelectInputView: pageflow.SelectInputView,
    SliderInputView: pageflow.SliderInputView,
    TextAreaInputView: pageflow.TextAreaInputView,
    TextInputView: pageflow.TextInputView,
    UrlInputView: pageflow.UrlInputView,
  },

  inputView: pageflow.inputView,
  ConfigurationEditorView: pageflow.ConfigurationEditorView,
  CollectionView: pageflow.CollectionView,
  SortableCollectionView: pageflow.SortableCollectionView
};
