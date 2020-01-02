import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';

import {SectionItemView} from './SectionItemView';

import styles from './EntryOutlineView.module.css';

export const EntryOutlineView = Marionette.Layout.extend({
  className: styles.root,

  template: () => `
    <h2>${I18n.t('pageflow_scrolled.editor.entry_outline.header')}</h2>
    <ul class="${styles.sectionsRegion}"></ul>
  `,

  regions: cssModulesUtils.ui(styles, 'sectionsRegion'),

  onRender() {
    this.sectionsRegion.show(new SortableCollectionView({
      collection: this.options.entry.sections,
      itemViewConstructor: SectionItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    }));
  }
});
