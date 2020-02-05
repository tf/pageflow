# Creating ContentElements

A content element

```
inlineImage/
  frontend.js
  editor.js
  stories.js
```

```javascript
// frontend.js

import {frontend} from 'pageflow-scrolled/frontend';
import {InlineImage} from '../InlineImage';

frontend.contentElements.register('inlineImage', {
  component: InlineImage
});
```

```javascript
// editor.js

import {editor} from 'pageflow-scrolled/editor';
import {TextInputView} from 'pageflow/ui';

editor.contentElements.register('inlineImage', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('caption', TextInputView);
    });
  }
})
```

```javascript
// InlineImage.js

import React from 'react';

import {Text} from 'pageflow-scrolled/frontend';

export function InlineImage(props) {
  return (
    <div>
      <div className={styles.caption}>
        <Text text={props.caption} />
      </div>
    </div>
  );
}
```

```javascript
// stories.js

import {contentElementStories, filePermaId} from 'pageflow-scrolled/testHelpers'

contentElementStories(module, {
  typeName: 'inlineImage',
  exampleConfigurations: {
    withoutCaption: {
      imageId: filePermaId('imageFiles', 'beach')
    }
  }
});

```



```javascript
// app/javascript/packs/pageflow-scrolled-editor.js

import 'pageflow-scrolled/contentElements/inlineImage/editor.js';
import 'third-party-pageflow-scrolled-foo/editor.js';
```

```javascript
// app/javascript/packs/pageflow-scrolled-frontend-inlineImage.js

import 'pageflow-scrolled/contentElements/inlineImage/frontend.js';
import 'third-party-pageflow-scrolled-foo/frontend.js';
```


```ruby
config.for_entry_type(PageflowScrolled.entry_type) do |c|
  c.content_element_pack_mapping = [
    [, 'pageflow-scrolled-frontend-heavy'],
    [/.*/, 'pageflow-scrolled-frontend-default']
  ]
end
```
