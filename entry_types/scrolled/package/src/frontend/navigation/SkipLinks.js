import React, {useEffect, useState} from 'react';

import I18n from 'i18n-js';
import classNames from 'classnames';

import styles from './SkipLinks.module.css';

export function SkipLinks() {
  return (
    <div className={styles.skipLinks}>
      <a href="#goToContent" className={styles.link}>
        {I18n.t('pageflow_scrolled.public.navigation_skip_links.content')}
      </a>
    </div>
  );
}
