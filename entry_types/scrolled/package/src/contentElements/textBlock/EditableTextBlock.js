import React, {useMemo, useCallback, useState} from 'react';
import {createEditor, Editor, Transforms, Text as SlateText, Range, Path} from 'slate';
import {Slate, Editable, withReact, useEditor, ReactEditor, useSlate} from 'slate-react';
import debounce from 'debounce';

import {Text, SelectionRect} from 'pageflow-scrolled/frontend';

import textBlockStyles from './TextBlock.module.css';
import styles from './EditableTextBlock.module.css';

const SelectionRangeContext = React.createContext(null);

function useSelectionRange() {
  return React.useContext(SelectionRangeContext);
}

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

  function renderElement(props) {
    switch (props.element.type) {
    case 'code':
      return <CodeElement {...props} />
    default:
      return <DefaultElement {...props} />
    }
  }

  const [selectionRange, setSelectionRange] = useState(null);

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

const SelectionContext = React.createContext();

function SelectionProvider({children}) {
  const [selection, setSelection] = useState(null);
  const editor = useSlate();

  React.useEffect(() => {
    const paths = editor.selection && {
      start: Range.start(editor.selection).path,
      end: Range.end(editor.selection).path
    };

    if ((selection && !paths) ||
        (!selection && paths) ||
        (selection && paths && (
          !Path.equal(paths.start, selection.start) ||
          !Path.equal(paths.end, selection.end)))) {
      setSelection(paths);
    }
  }, [editor.selection, selection]);
  
  return (
    <SelectionContext.Provider value={selectionRange}>
      {children}
    </SelectionContext.Provider>
  );
}

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
  const path = ReactEditor.findPath(editor, props.element);
  const selection = editor.selection;
  const isSelected = selection && Range.includes(selection, path);
  const isStart = selection && Path.isAncestor(path, Range.start(selection).path);
  const isEnd = selection && Path.isAncestor(path, Range.end(selection).path);

  console.log(path, JSON.stringify(selection),
              isSelected, isStart, isEnd);

  return (
    <div {...props.attributes} className={styles.paragraph}>
      <SelectionRect selected={isSelected} start={isStart} end={isEnd}>
        <p className={textBlockStyles.TextBlock} style={{color: isSelected ? 'green' : 'red'}}>{props.children}</p>
      </SelectionRect>
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

function renderLeaf(props) {
  return <Leaf {...props} />
}
