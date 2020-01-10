import Backbone from 'backbone';

import {failureTracking, Configuration} from 'pageflow/editor';
import {ChapterSectionsCollection} from '../collections';

export const Chapter = Backbone.Model.extend({
  mixins: [failureTracking],

  initialize(attributes, options) {
    this.configuration = new ChapterConfiguration(this.get('configuration'));
    this.configuration.parent = this;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });

    this.listenTo(this.configuration, 'change', function() {
      this.save();
    });

    this.sections = new ChapterSectionsCollection({
      sections: options.sections,
      chapter: this
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : window.location.pathname + '/scrolled/chapters';
  },

  toJSON: function() {
    return {
      configuration: this.configuration.toJSON()
    };
  },
});

const ChapterConfiguration = Configuration.extend({

});
