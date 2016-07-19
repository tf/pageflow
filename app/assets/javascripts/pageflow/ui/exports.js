/**
 * Reusable Backbone views for the editor and admin interface.
 */
pageflow.ui = {
  /**
   * Basic input views for forms.
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
