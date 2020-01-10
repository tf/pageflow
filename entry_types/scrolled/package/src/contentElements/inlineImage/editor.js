
import {editor} from '../../editor/api';
import {TextInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

['inlineImage', 'stickyImage'].forEach(typeName =>
  editor.scrolledContentElements.register(typeName, {
    configurationEditor() {
      this.tab('general', function() {
        this.input('id', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'contentElementConfiguration'
        });
        this.input('caption', TextInputView);
      });
    }
  })
);
