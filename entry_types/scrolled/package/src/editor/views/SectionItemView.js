import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';
import {editor} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {watchCollections} from '../../entryState';
import {SectionThumbnail} from '../../frontend/SectionThumbnail'

import styles from './SectionItemView.module.css';

export const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.root,

  template: (data) => `
    <div class="${styles.thumbnailContainer}">
      <div class="${styles.thumbnail}"></div>
      <div class="${styles.clickMask}"></div>
    </div>
    <a href="" class="${styles.editLink}" title="${I18n.t('pageflow_scrolled.editor.section_item.edit')}"></a>
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail'),

  events: {
    [`click .${styles.clickMask}`]: function() {
      this.options.entry.trigger('scrollToSection', this.model);
    },

    [`click .${styles.editLink}`]: function() {
      this.options.entry.trigger('scrollToSection', this.model);
      editor.navigate(`/scrolled/sections/${this.model.id}`, {trigger: true})
      return false;
    }
  },

  initialize() {
    this.listenTo(this.options.entry, 'change:currentSectionIndex', () => {
      const active =
        this.options.entry.sections.indexOf(this.model) === this.options.entry.get('currentSectionIndex');

      this.$el.toggleClass(styles.active, active);

      if (active) {
        this.$el[0].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
  },

  onRender() {
    ReactDOM.render(React.createElement(SectionThumbnail,
                                        {
                                          sectionPermaId: this.model.get('permaId'),
                                          seed: this.options.entry.scrolledSeed,
                                          subscribe: dispatch =>
                                            watchCollections(this.options.entry, {dispatch})
                                        }),
                    this.ui.thumbnail[0]);
  }
});
