
import {editor} from '../../editor/api';
import {TextAreaInputView} from 'pageflow/ui';

editor.scrolledContentElements.register('textBlock', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('children', TextAreaInputView);
    });
  }
});
