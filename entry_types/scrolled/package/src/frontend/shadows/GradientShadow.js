import React from 'react';
import classNames from 'classnames';

import Fullscreen from '../Fullscreen';
import styles from './GradientShadow.module.css';

export default function GradientShadow(props) {
  const opacityFactor = props.motifAreaState.isIntersectingX ?
                        Math.min(1, props.motifAreaState.intersectionRatioY * 2) :
                        1;

  return (
    <div className={classNames(styles.root,
                   styles[`align-${props.align}`],
                   {[styles.intersecting]: props.motifAreaState.isIntersectingX})}>
      <div className={classNames(styles.shadow, props.inverted ? styles.shadowWhite : styles.shadowBlack)}
           style={{opacity: props.opacity * Math.round(opacityFactor * 10) / 10}}>
        <Fullscreen />
      </div>
      {props.children}
    </div>
  );
}

GradientShadow.defaultProps = {
  opacity: 0.7,
  align: 'left'
}
