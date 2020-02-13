import React, {useMemo, useCallback, useState} from 'react';
import {createEditor, Editor, Transforms, Text as SlateText} from 'slate';
import {Slate, Editable, withReact, useEditor, ReactEditor} from 'slate-react';
import debounce from 'debounce';

import {Text, InsertContentElementIndicator} from 'pageflow-scrolled/frontend';

import textBlockStyles from './TextBlock.module.css';
import styles from './EditableTextBlock.module.css';

export const EditableTextBlock = React.memo(function EditableTextBlock({id, configuration}) {
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState(configuration.value || [{
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph!' }],
  }]);

  const saveDebounced = useMemo(() => debounce(value => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'UPDATE_CONTENT_ELEMENT',
          payload: {
            id: id,
            attributes: {
              value
            }
          }
        },
        window.location.origin
      );
    }
  }, 2000), [id]);

  const update = useCallback(value => {
    saveDebounced(value)
    setValue(value);
  }, [saveDebounced]);

  return (
    <Text scaleCategory="body">
      <Slate editor={editor} value={value} onChange={value => { update(value) }}>
        <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={event => {
                if (!event.ctrlKey) {
                  return
                }
                switch (event.key) {
                case 'c': {
                  event.preventDefault()
                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === 'code',
                  })
                  Transforms.setNodes(
                    editor,
                    { type: match ? 'paragraph' : 'code' },
                    { match: n => Editor.isBlock(editor, n) }
                  )
                  break
                }
                case 'b': {
                  console.log('bold');
                  event.preventDefault()
                  Transforms.setNodes(
                    editor,
                    { bold: true },
                    // Apply it to text nodes, and split the text node up if the
                    // selection is overlapping only part of it.
                    { match: n => SlateText.isText(n), split: true }
                  )
                  break
                }
                default:
                }
              }} />
      </Slate>
    </Text>
  );
});

const CodeElement = props => {
  return (
    <div {...props.attributes}>
      <span contentEditable={false}>Code</span>
    <pre>
      <code>{props.children}</code>
    </pre>
    </div>
  )
}

const DefaultElement = props => {
  const editor = useEditor();
  const path = useMemo(() => ReactEditor.findPath(editor, props.element),
                       [editor, props.element]);

  return (
    <div {...props.attributes} className={styles.paragraph}>
      <span contentEditable={false} className={styles.insertIndicator} data-slate-editor>
        <InsertContentElementIndicator position={path} contentElementId={props.id} />
      </span>
      <p className={textBlockStyles.TextBlock}>{props.children}</p>
    </div>
  );
}

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

function renderElement(props) {
  switch (props.element.type) {
  case 'code':
    return <CodeElement {...props} />
  default:
    return <DefaultElement {...props} />
  }
}

function renderLeaf(props) {
  return <Leaf {...props} />
}
