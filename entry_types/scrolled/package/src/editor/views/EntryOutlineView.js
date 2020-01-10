import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';

import {ChapterItemView} from './ChapterItemView';

import styles from './EntryOutlineView.module.css';

export const EntryOutlineView = Marionette.Layout.extend({
  className: styles.root,

  template: () => `
    <h2>${I18n.t('pageflow_scrolled.editor.entry_outline.header')}</h2>
    <ul class="${styles.chaptersRegion}"></ul>

    <a class="add_chapter" href="">${I18n.t('pageflow.editor.templates.storyline_outline.new_chapter')}</a>
  `,

  regions: cssModulesUtils.ui(styles, 'chaptersRegion'),

  onRender() {
    this.chaptersRegion.show(new SortableCollectionView({
      collection: this.options.entry.chapters,
      itemViewConstructor: ChapterItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    }));
  }
});
