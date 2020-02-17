import React from 'react';
import classNames from 'classnames';

import styles from './SelectionRect.module.css';

export function SelectionRect(props) {
  return (
    <div className={classNames(styles.main,
                               {[styles.selected]: props.selected,
                                [styles.start]: props.start,
                                [styles.end]: props.end,})}>
      {props.children}
      <div className={styles.tl} contentEditable={false} />
      <div className={styles.bl} contentEditable={false} />
      <div className={styles.tr} contentEditable={false} />
      <div className={styles.br} contentEditable={false} />
    </div>
  );
}
