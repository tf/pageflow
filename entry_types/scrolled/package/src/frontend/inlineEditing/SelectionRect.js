import React, {useState} from 'react';
import classNames from 'classnames';

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

function renderToolbar({toolbarButtons, onToolbarButtonClick}) {
  if (toolbarButtons) {
    return (
      <div className={styles.toolbar} contentEditable={false}>
        {toolbarButtons.map(button => {
          const Icon = button.icon

          return (
            <button title={button.text}
                    className={classNames(styles.toolbarButton, {[styles.activeToolbarButton]: button.active})}
                    onClick={() => onToolbarButtonClick(button.name)}>
              <Icon width={15} height={15} />
            </button>
          );
        })}
      </div>
    );
  }
}

SelectionRect.defaultProps = {
  start: true,
  end: true
}
