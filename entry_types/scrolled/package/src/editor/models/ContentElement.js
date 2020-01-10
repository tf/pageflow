import Backbone from 'backbone';

import {editor, failureTracking, Configuration} from 'pageflow/editor';

export const ContentElement = Backbone.Model.extend({
  mixins: [failureTracking],

  initialize() {
    this.configuration = new ContentElementConfiguration(this.get('configuration'));
    this.configuration.parent = this;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });
  }
});

const ContentElementConfiguration = Configuration.extend({

});

export const PageConfigurationFileSelectionHandler = function(options) {
  const contentElement = options.entry.contentElements.get(options.id);

  this.call = function(file) {
    contentElement.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/content_elements/' + contentElement.id;
  };
};

editor.registerFileSelectionHandler('contentElementConfiguration', PageConfigurationFileSelectionHandler);
