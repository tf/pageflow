import React from 'react';
import classNames from 'classnames';

import styles from './Scroller.module.css';

export const Scroller = React.forwardRef(function Scroller({areas, setStepRef}, ref) {
  return (
    <div ref={ref}
         className={classNames(styles.scroller, styles.overview)}>
      {Array.from({length: areas.length + 2}, (_, index) =>
        <div key={index}
             ref={setStepRef(index)}
             className={styles.step} />
      )}
    </div>
  );
});
