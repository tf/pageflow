import _ from 'underscore';

import {Object} from 'pageflow/ui';

import {FileTypesCollection} from '../collections/FileTypesCollection';
import {FileType} from './FileType';

export const FileTypes = Object.extend({
  modifyableProperties: [
    'configurationEditorInputs',
    'configurationUpdaters',
    'confirmUploadTableColumns',
    'filters'
  ],

  initialize: function() {
    this.clientSideConfigs = [];
    this.clientSideConfigModifications = {};

    this.commonSettingsDialogTabs = [];
    this.commonMetaDataAttributes = [];
  },

  register: function(name, config) {
    if (this._setup) {
      throw 'File types already set up. Register file types before initializers run.';
    }

    this.clientSideConfigs[name] = config;
  },

  modify: function(name, config) {
    if (this._setup) {
      throw 'File types already set up. Modify file types before initializers run.';
    }

    this.clientSideConfigModifications[name] = this.clientSideConfigModifications[name] || [];
    this.clientSideConfigModifications[name].push(config);
  },

  setup: function(serverSideConfigs) {
    var clientSideConfigs = this.clientSideConfigs;
    this._setup = true;

    var configs =
      _.chain(serverSideConfigs).map(serverSideConfig => {
        var clientSideConfig = clientSideConfigs[serverSideConfig.collectionName];

        if (!clientSideConfig) {
          throw 'Missing client side config for file type "' +
            serverSideConfig.collectionName + '"';
        }

        this.applyCommonConfig(clientSideConfig);
        this.applyModifications(serverSideConfig, clientSideConfig);

        return _.extend({}, serverSideConfig, clientSideConfig);
      }).sortBy(config => config.priority || 10).value()

    this.collection = new FileTypesCollection(_.map(configs, config => new FileType(config)));
    var those = this;

    _.map(serverSideConfigs, function(serverSideConfig) {
      var fileType = those.findByCollectionName(serverSideConfig.collectionName);
      fileType.setNestedFileTypes(new FileTypesCollection(
        _.map(serverSideConfig.nestedFileTypes, function(nestedFileType) {
          return those.findByCollectionName(nestedFileType.collectionName);
        })
      ));
    });
  },

  applyCommonConfig(clientSideConfig) {
    clientSideConfig.settingsDialogTabs = this.commonSettingsDialogTabs.concat(
      clientSideConfig.settingsDialogTabs || []
    );

    clientSideConfig.metaDataAttributes = this.commonMetaDataAttributes.concat(
      clientSideConfig.metaDataAttributes || []
    );
  },

  applyModifications(serverSideConfig, clientSideConfig) {
    _(this.clientSideConfigModifications[serverSideConfig.collectionName])
      .each(function(modification) {
        this.lintModification(modification, serverSideConfig.collectionName);
        this.applyModification(clientSideConfig, modification);
      }, this);
  },

  lintModification: function(modification, collectionName) {
    var unmodifyableProperties = _.difference(_.keys(modification), this.modifyableProperties);

    if (unmodifyableProperties.length) {
      throw 'Only the following properties are allowed in FileTypes#modify: ' +
        this.modifyableProperties.join(', ') +
        '. Given in modification for ' +
        collectionName +
        ': ' +
        unmodifyableProperties.join(', ') +
        '.';
    }
  },

  applyModification: function(target, modification) {
    _(this.modifyableProperties).each(function(property) {
      target[property] = (target[property] || []).concat(modification[property] || []);
    });
  }
});

_.each(['each',
        'map',
        'reduce',
        'first',
        'find',
        'findByUpload',
        'findByCollectionName',
        'contains',
        'filter'],
       function(method) {
         FileTypes.prototype[method] = function() {
           if (!this._setup) {
             throw  'File types are not yet set up.';
           }

           return this.collection[method].apply(this.collection, arguments);
         };
       });
