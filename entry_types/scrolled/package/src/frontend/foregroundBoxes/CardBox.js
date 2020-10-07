import React from 'react';
import styles from './CardBox.module.css';

export default function CardBox(props) {
  return (
    <div style={{paddingTop: props.padding}}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
