import React, {useState} from 'react';
import classNames from 'classnames';

import {Toolbar} from './Toolbar';

import styles from './SelectionRect.module.css';

import PlusIcon from './images/plus.svg';

export function SelectionRect(props) {
  const [insertHovered, setInsertHovered] = useState(false);

  return (
    <div className={classNames(styles.main,
                               {[styles.selected]: props.selected,
                                [styles.insertHovered]: insertHovered,
                                [styles.start]: props.selected && props.start,
                                [styles.end]: props.selected && props.end})}
         onClick={props.onClick}>
      {renderToolbar(props)}
      {props.children}

      <div className={styles.insertAfter} contentEditable={false}>
        <button className={styles.insertAfterButton}
                title="Element einfügen"
                onMouseEnter={() => setInsertHovered(true)}
                onMouseLeave={() => setInsertHovered(false)}>
          <PlusIcon width={15} height={15} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

function renderToolbar({toolbarButtons, onToolbarButtonClick, start}) {
  if (toolbarButtons && start) {
    return (
      <div className={styles.toolbar}>
        <Toolbar buttons={toolbarButtons}
                 onButtonClick={onToolbarButtonClick} />
      </div>
    );
  }
}

SelectionRect.defaultProps = {
  start: true,
  end: true
}
