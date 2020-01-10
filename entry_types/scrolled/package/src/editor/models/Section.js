import Backbone from 'backbone';

import {editor, failureTracking, Configuration} from 'pageflow/editor';

export const Section = Backbone.Model.extend({
  mixins: [failureTracking],

  initialize() {
    this.configuration = new SectionConfiguration(this.get('configuration'));
    this.configuration.parent = this;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });

    this.listenTo(this.configuration, 'change', function() {
      this.save();
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : window.location.pathname + '/scrolled/sections';
  },

  toJSON: function() {
    return {
      configuration: this.configuration.toJSON()
    };
  },
});

const SectionConfiguration = Configuration.extend({
  get: function(name) {
    if (name === 'backdropImage') {
      return this.attributes.backdrop &&
             this.attributes.backdrop.image;
    }
    if (name === 'backdropType') {
      return Configuration.prototype.get.apply(this, arguments) ||
             (this.attributes.backdrop &&
              this.attributes.backdrop.image.toString().startsWith('#') ? 'color' : 'image');
    }
    return Configuration.prototype.get.apply(this, arguments);
  },

  set: function(name, value) {
    if (name === 'backdropImage' && value) {
      this.set('backdrop', {image: value});
    }
    return Configuration.prototype.set.apply(this, arguments);
  }
});

export const FileSelectionHandler = function(options) {
  const contentElement = options.entry.sections.get(options.id);

  this.call = function(file) {
    contentElement.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/sections/' + contentElement.id;
  };
};

editor.registerFileSelectionHandler('sectionConfiguration', FileSelectionHandler);
