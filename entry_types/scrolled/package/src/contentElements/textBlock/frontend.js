import {frontend} from 'pageflow-scrolled/frontend';
import {TextBlock} from './TextBlock';
import {EditableTextBlock} from './EditableTextBlock';

frontend.contentElementTypes.register('textBlock', {
  component: TextBlock
});

frontend.contentElementTypes.register('editableTextBlock', {
  component: EditableTextBlock
});
