import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';

import {watchCollections} from '../../entryState';
import {SectionThumbnail} from '../../frontend/SectionThumbnail'

export const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',

  template: (data) => `
    <a href="#/scrolled/sections/${data.id}">Section</a>
    <div></div>
  `,

  ui: {
    thumbnail: 'div'
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
