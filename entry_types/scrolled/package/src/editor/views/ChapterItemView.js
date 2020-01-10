import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';

import {SectionItemView} from './SectionItemView';

import styles from './ChapterItemView.module.css';

export const ChapterItemView = Marionette.Layout.extend({
  tagName: 'li',
  className: styles.root,

  template: () => `
     <a class="${styles.link}" href="">
       <span class="${styles.number}"></span>
       <span class="${styles.title}"></span>
     </a>

     <ul class="${styles.sectionsRegion}"></ul>

     <a href="" class="add_page">${I18n.t('pageflow_scrolled.editor.chapter_item.add_section')}</a>
  `,

  ui: cssModulesUtils.ui(styles, 'title', 'number'),

  regions: cssModulesUtils.ui(styles, 'sectionsRegion'),

  events: {
    [`click a.${styles.addSections}`]: function() {
      this.model.addSection();
    },

    [`click a.${styles.link}`]: function() {
      editor.navigate('/scrolled/chapters/' + this.model.get('id'), {trigger: true});
      return false;
    }
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    this.sectionsRegion.show(new SortableCollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SectionItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    }));

    this.update();
  },

  update: function() {
    this.ui.title.text(this.model.configuration.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  }
});
