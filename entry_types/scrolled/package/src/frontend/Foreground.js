import React from 'react';
import classNames from 'classnames';

import {useEditorSelection} from './EditorState';

import styles from './Foreground.module.css';
import foregroundItemStyles from './ContentElement.module.css';

export default function Foreground(props) {
  const {resetSelection} = useEditorSelection();

  function resetSelectionIfOutsideForegroundItem(event) {
    if (resetSelection && !event.target.closest(`.${foregroundItemStyles.outer}`)) {
      resetSelection();
    }
  }

  return (
    <div className={className(props)} onClick={resetSelectionIfOutsideForegroundItem}>
      {props.children}
    </div>
  );
}



function className(props) {
  return classNames(
    styles.Foreground,
    props.transitionStyles.foreground,
    props.transitionStyles[`foreground-${props.state}`],
    styles[`${props.heightMode}Height`],
    {
      [styles.hidden]: props.hidden,
      [styles.enlarge]: props.hidden && !props.disableEnlarge
    }
  )
}
