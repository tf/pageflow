import Backbone from 'backbone';

import {Section} from '../models/Section';

export const SectionsCollection = Backbone.Collection.extend({
  model: Section,

  url() {
    return window.location.pathname + '/scrolled/sections';
  }
});
