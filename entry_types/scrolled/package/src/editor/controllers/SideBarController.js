import Marionette from 'backbone.marionette';

import {editor as scrolledApi} from '../api';
import {editor as api} from 'pageflow/editor';

import {EditContentElementView} from '../views/EditContentElementView';

export const SideBarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  contentElement: function(id, tab) {
    this.region.show(new EditContentElementView({
      entry: this.entry,
      model: this.entry.contentElements.get(id),
      scrolledApi,
      api
    }));
  }
});
