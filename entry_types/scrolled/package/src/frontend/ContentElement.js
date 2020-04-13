import React from 'react';
import classNames from 'classnames';

import {api} from './api';
import {useEditorSelection} from './EditorState';
import styles from './ContentElement.module.css';
import {SelectionRect} from './inlineEditing/SelectionRect';

export function ContentElement(props) {
  const {component: Component, customSelectionRect} =
    api.contentElementTypes.getOptions(props.type);
  const selection = useEditorSelection({id: props.id, type: 'contentElement'});

  if (selection.select) {
    return (
      <div className={classNames(styles.outer)}>
        {renderSelectionRect(customSelectionRect, selection, () =>
          <Component sectionProps={props.sectionProps}
                     configuration={props.itemProps}
                     contentElementId={props.id}/>
        )}
      </div>
    );
  }
  else {
    return (
      <Component sectionProps={props.sectionProps}
                 configuration={props.itemProps} />
    );
  }
}

function renderSelectionRect(customSelectionRect, {select, isSelected}, fn) {
  if (customSelectionRect) {
    return fn();
  }

  return (
    <SelectionRect selected={isSelected} onClick={() => select()}>
      {fn()}
    </SelectionRect>
  );
}
