import React from 'react';
import classNames from 'classnames';

import {useEditorSelection} from './EditorState';
import {InsertContentElementIndicator} from './inlineEditing/InsertContentElementIndicator';

import templates from './foregroundItemTemplates';
import styles from './ForegroundItem.module.css';

export default function ForegroundItem(props) {
  const template = templates[props.type]
  const Component = template.component;

  const {isSelected, isSelectable, select, resetSelection} = useEditorSelection({id: props.id, type: 'contentElement'});
  const componentProps = {...template.props, ...props.itemProps}

  if (select) {
    return (
      <div className={classNames(styles.outer)}>
        {props.first && <InsertContentElementIndicator position="before" contentElementId={props.id} />}
        <div className={classNames({[styles.selected]: isSelected, [styles.selectable]: isSelectable})}
             onClick={e => { e.stopPropagation(); isSelectable ? select() : resetSelection(); }}>
          <Component {...componentProps} />
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
      <Component {...componentProps} />
    );
  }
}
