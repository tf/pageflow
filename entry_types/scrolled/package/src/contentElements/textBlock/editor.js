import {editor} from 'pageflow-scrolled/editor';
import {TextAreaInputView} from 'pageflow/ui';

editor.contentElementTypes.register('textBlock', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('children', TextAreaInputView);
    });
  }
});

editor.contentElementTypes.register('editableTextBlock', {
  configurationEditor() {
    this.tab('general', function() {
    });
  }
});
