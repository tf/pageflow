import React from 'react';
import classNames from 'classnames';

import {api} from './api';
import {useEditorSelection} from './EditorState';
import styles from './ContentElement.module.css';
import {InsertContentElementIndicator} from './inlineEditing/InsertContentElementIndicator';
import {ContentElementErrorBoundary} from './ContentElementErrorBoundary';

export function ContentElement(props) {
  const Component = getComponent(props.type);
  const {isSelected, isSelectable, select, resetSelection} = useEditorSelection({id: props.id, type: 'contentElement'});

  if (select) {
    return (
      <div className={classNames(styles.outer)}>
        {props.first && <InsertContentElementIndicator position="before" contentElementId={props.id} />}
        <div className={classNames({[styles.selected]: isSelected, [styles.selectable]: isSelectable})}
             onClick={e => { e.stopPropagation(); isSelectable ? select() : resetSelection(); }}>
          <ContentElementErrorBoundary>
            <Component sectionProps={props.sectionProps}
                       configuration={props.itemProps}
                       contentElementId={props.id}/>
          </ContentElementErrorBoundary>
          <div className={styles.tl} />
          <div className={styles.bl} />
          <div className={styles.tr} />
          <div className={styles.br} />
        </div>
        <InsertContentElementIndicator position="after" contentElementId={props.id} />
      </div>
    );
  }
  else {
    return (
      <ContentElementErrorBoundary>
        <Component sectionProps={props.sectionProps}
                   configuration={props.itemProps} />
      </ContentElementErrorBoundary>
    );
  }
}

function getComponent(type) {
  try {
    return api.contentElementTypes.getComponent(type);
  }
  catch(e) {
    return UnknownTypePlaceholder
  }
}

function UnknownTypePlaceholder() {
  return (
    <div>Unknown content element type</div>
  );
}
