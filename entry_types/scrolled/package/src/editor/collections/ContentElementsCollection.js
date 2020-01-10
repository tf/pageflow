import Backbone from 'backbone';

import {ContentElement} from '../models/ContentElement';

export const ContentElementsCollection = Backbone.Collection.extend({
  model: ContentElement,

  url() {
    return window.location.pathname + '/scrolled/content_elements';
  }
});
