import React, {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import {createEditor, Editor, Transforms, Text as SlateText, Range, Path} from 'slate';
import {Slate, Editable, withReact, useEditor, ReactEditor, useSlate} from 'slate-react';
import debounce from 'debounce';

import {Text, SelectionRect, Toolbar} from 'pageflow-scrolled/frontend';

import styles from './EditableTextBlock.module.css';

import TextIcon from './images/align-justify.svg';
import HeadingIcon from './images/heading.svg';
import OlIcon from './images/list-ol.svg';
import UlIcon from './images/list-ul.svg';
import QuoteIcon from './images/quote-right.svg';

import BoldIcon from './images/bold.svg';
import UnderlineIcon from './images/underline.svg';
import ItalicIcon from './images/italic.svg';
import StrikethroughIcon from './images/strikethrough.svg';

export const EditableTextBlock = React.memo(function EditableTextBlock({contentElementId, configuration}) {
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
            id: contentElementId,
            attributes: {
              value
            }
          }
        },
        window.location.origin
      );
    }
  }, 2000), [contentElementId]);

  const update = useCallback(value => {
    saveDebounced(value)
    setValue(value);
  }, [saveDebounced]);

  function renderElementWithSelection(props) {
    if (props.element.type === 'list-item') {
      return renderElement(props);
    }
    else {
      return (
        <Selection element={props.element}>
          {renderElement(props)}
        </Selection>
      )
    }
  }

  function renderElement({attributes, children, element}) {
    switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'heading':
      return <h2 {...attributes}>{children}</h2>;
    default:
      return <p {...attributes}>{children}</p>;
    }
  }

  return (
    <Text scaleCategory="body">
      <Slate editor={editor} value={value} onChange={value => { update(value) }}>
        <HoveringToolbar />
        <Editable
          renderElement={renderElementWithSelection}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }
            switch (event.key) {
            case 'c': {
              event.preventDefault()
              debugger;
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

const toolbarButtons = [
  {
    name: 'paragraph',
    text: 'Paragraph',
    icon: TextIcon
  },
  {
    name: 'heading',
    text: 'Heading',
    icon: HeadingIcon
  },
  {
    name: 'numbered-list',
    text: 'Ordered List',
    icon: OlIcon
  },
  {
    name: 'bulleted-list',
    text: 'Bullet Points',
    icon: UlIcon
  },
  {
    name: 'block-quote',
    text: 'Block quit',
    icon: QuoteIcon
  }
];

function Selection(props) {
  const editor = useEditor();
  const path = ReactEditor.findPath(editor, props.element);
  const selection = editor.selection;
  const isSelected = selection && Range.includes(selection, path);
  const isStart = selection && Path.isAncestor(path, Range.start(selection).path);
  const isEnd = selection && Path.isAncestor(path, Range.end(selection).path);

  return (
    <SelectionRect selected={isSelected}
                   start={isStart}
                   end={isEnd}
                   toolbarButtons={toolbarButtons.map(button => ({...button, active: isBlockActive(editor, button.name)}))}
                   onToolbarButtonClick={name => toggleBlock(editor, name)}>
      {props.children}
    </SelectionRect>
  );
}

const Leaf = ({attributes, children, leaf}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }

  return <span {...attributes}>{children}</span>
}

function renderLeaf(props) {
  return <Leaf {...props} />
}

const listTypes = ['numbered-list', 'bulleted-list'];

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format)
  const isList = listTypes.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => listTypes.includes(n.type),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

function HoveringToolbar() {
  const ref = useRef()
  const outerRef = useRef()
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const {selection} = editor

    if (!el || !outerRef.current) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    const outerRect = outerRef.current.getBoundingClientRect()
    el.style.opacity = 1
    el.style.top = `${rect.bottom - outerRect.top + 10}px`
    el.style.left = `${rect.left -
                       outerRect.left}px`
  })

  const buttons = [
    {
      name: 'bold',
      text: 'Bold',
      icon: BoldIcon
    },
    {
      name: 'italic',
      text: 'Italic',
      icon: ItalicIcon
    },
    {
      name: 'underline',
      text: 'Underline',
      icon: UnderlineIcon
    },
    {
      name: 'strikethrough',
      text: 'Strikethrough',
      icon: StrikethroughIcon
    },
  ].map(button => ({...button, active: isMarkActive(editor, button.name)}));

  return (
    <div ref={outerRef}>
      <div ref={ref}
           className={styles.hoveringToolbar}
           style={{

           }}>
        <Toolbar buttons={buttons}
                 onButtonClick={name => toggleMark(editor, name)}/>
      </div>
    </div>
  );
}
