import React from 'react';
import classNames from 'classnames';

import {useEditorSelection} from './EditorState';
import templates from './foregroundItemTemplates';
import styles from './ForegroundItem.module.css';

export default function ForegroundItem(props) {
  const template = templates[props.type]
  const Component = template.component;

  const {isSelected, select} = useEditorSelection(props.id);
  const componentProps = {...template.props, ...props.itemProps}

  if (select) {
    return (
      <div className={classNames(styles.selectable, {[styles.selected]: isSelected})}
           onClick={e => { e.stopPropagation(); select(); }}>
        <Component {...componentProps} />
      </div>
    );
  }
  else {
    return (
      <Component {...componentProps} />
    );
  }
}
