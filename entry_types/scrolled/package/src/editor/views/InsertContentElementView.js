import Marionette from 'backbone.marionette'

import {CollectionView, BackButtonDecoratorView} from 'pageflow/editor';

import styles from './InsertContentElementView.module.css';

export const InsertContentElementView = Marionette.ItemView.extend({
  template: () => `
    <h2>Element einfügen</h2>
    <ul></ul>
  `,

  ui: {
    items: 'ul'
  },

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.items,
      collection: this.options.scrolledApi.scrolledContentElements.toCollection(),
      itemViewConstructor: ItemView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  },

  onGoBack() {
    this.options.entry.trigger('resetSelection');
  }
});

const ItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.item,

  template: ({displayName}) => `
    <a href="">${displayName}</a>
  `,

  events: {
    'click a': function() {
      this.options.entry.insertContentElement({typeName: this.model.get('typeName')},
                                              this.options.insertOptions);
    }
  }
});

InsertContentElementView.create = function(options) {
  return new BackButtonDecoratorView({
    view: new InsertContentElementView(options)
  });
};
