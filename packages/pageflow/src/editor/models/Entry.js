import Backbone from 'backbone';
import _ from 'underscore';

import {EntryConfiguration} from './EntryConfiguration';
import {FileReuse} from './FileReuse';
import {StorylineScaffold} from './StorylineScaffold';
import {editor} from '../base';
import {failureTracking} from './mixins/failureTracking';
import {filesCountWatcher} from './mixins/filesCountWatcher';
import {polling} from './mixins/polling';

import {state} from '$state';

export const Entry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',
  collectionName: 'entries',

  mixins: [filesCountWatcher,
           polling,
           failureTracking],

  initialize: function(attributes, options) {
    options = options || {};

    this.configuration = new EntryConfiguration(this.get('configuration') || {});
    this.configuration.parent = this;

    this.themes = options.themes || state.themes;
    this.files = options.files || state.files;
    this.fileTypes = options.fileTypes || editor.fileTypes;
    this.storylines = options.storylines || state.storylines;
    this.storylines.parentModel = this;
    this.chapters = options.chapters || state.chapters;
    this.chapters.parentModel = this;
    this.pages = state.pages;
    this.widgets = options.widgets;

    this.imageFiles = state.imageFiles;
    this.videoFiles = state.videoFiles;
    this.audioFiles = state.audioFiles;

    this.fileTypes.each(function(fileType) {
      this.watchFileCollection(fileType.collectionName, this.getFileCollection(fileType));
    }, this);

    this.listenTo(this.storylines, 'sort', function() {
      this.pages.sort();
    });

    this.listenTo(this.chapters, 'sort', function() {
      this.pages.sort();
    });

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration');
      this.save();
    });

    this.listenTo(this.configuration, 'change:locale', function() {
      this.once('sync', function() {
        // No other way of updating page templates used in
        // EntryPreviewView at the moment.
        location.reload();
      });
    });
  },

  getTheme: function() {
    return this.themes.findByName(this.configuration.get('theme_name'));
  },

  addStoryline: function(attributes) {
    var storyline = this.buildStoryline(attributes);
    storyline.save();

    return storyline;
  },

  buildStoryline: function(attributes) {
    var defaults = {
      title: '',
    };

    return this.storylines.addAndReturnModel(_.extend(defaults, attributes));
  },

  scaffoldStoryline: function(options) {
    var scaffold = new StorylineScaffold(this, options);
    scaffold.create();

    return scaffold;
  },

  addChapterInNewStoryline: function(options) {
    return this.scaffoldStoryline(_.extend({depth: 'chapter'}, options)).chapter;
  },

  addPageInNewStoryline: function(options) {
    return this.scaffoldStoryline(_.extend({depth: 'page'}, options)).page;
  },

  reuseFile: function(otherEntry, file) {
    var entry = this;

    FileReuse.submit(otherEntry, file, {
      entry: entry,

      success: function(model, response) {
        entry._setFiles(response, {merge: false, remove: false});
        entry.trigger('use:files');
      }
    });
  },

  getFileCollection: function(fileTypeOrFileTypeName) {
    return this.files[fileTypeOrFileTypeName.collectionName || fileTypeOrFileTypeName];
  },

  pollForPendingFiles: function() {
    this.listenTo(this, 'change:pending_files_count', function(model, value) {
      this.togglePolling(value > 0);
    });

    this.togglePolling(this.get('pending_files_count') > 0);
  },

  parse: function(response, options) {
    if (response) {
      this.set(_.pick(response, 'published', 'published_until', 'password_protected'));
      this._setFiles(response, {
        add: false,
        remove: false,
        applyConfigurationUpdaters: true
      });
    }

    return response;
  },

  _setFiles: function(response, options) {
    this.fileTypes.each(function(fileType) {
      var filesAttributes = response[fileType.collectionName];

      // Temporary solution until rights attributes is moved to
      // configuration hash. If we are polling, prevent overwriting
      // the rights attribute.
      if (options.merge !== false) {
        filesAttributes = _.map(filesAttributes, function(fileAttributes) {
          return _.omit(fileAttributes, 'rights');
        });
      }

      this.getFileCollection(fileType).set(filesAttributes,
                                           _.extend({fileType: fileType}, options));
      delete response[fileType.collectionName];
    }, this);
  },

  toJSON: function() {
    return this.configuration.toJSON();
  }
});
