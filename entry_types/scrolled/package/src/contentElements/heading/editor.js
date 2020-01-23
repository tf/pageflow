import {editor} from '../../editor/api';
import {TextInputView} from 'pageflow/ui';

editor.scrolledContentElements.register('heading', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('children', TextInputView);
    });
  }
});
