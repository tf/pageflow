import React from 'react';
import MutedContext from './MutedContext';
import classNames from 'classnames';

import styles from './SoundDisclaimer.module.css';

export default function UnmuteButton() {
  return (
        <div className={classNames(styles.soundDisclaimer)}>
          <p>
            Dieser Artikel wirkt am besten mit eingeschaltetem Ton.<br/>
            Klicken Sie einmal in dieses Feld, um den Ton für die gesamte Geschichte zu aktivieren.
          </p>
        </div>
  );
}
