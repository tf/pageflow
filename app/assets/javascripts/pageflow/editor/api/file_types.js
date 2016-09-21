pageflow.FileTypes = pageflow.Object.extend({
  initialize: function() {
    this.clientSideConfigs = [];
  },

  register: function(name, config) {
    if (this._setup) {
      throw 'File types already set up. Register file types before initializers run.';
    }

    this.clientSideConfigs[name] = config;
  },

  setup: function(serverSideConfigs) {
    var clientSideConfigs = this.clientSideConfigs;
    this._setup = true;

    this.fileTypes = new pageflow.FileTypesCollection(_.map(serverSideConfigs, function(serverSideConfig) {
      var clientSideConfig = clientSideConfigs[serverSideConfig.collectionName];

      if (!clientSideConfig) {
        throw 'Missing client side config for file type "' + serverSideConfig.collectionName + '"';
      }

      return new pageflow.FileType(_.extend({}, serverSideConfig, clientSideConfig));
    }));

    _.map(this.fileTypes.fileTypes, function(fileType) {
      if(fileType && fileType.nestedFileTypes.fileTypes){
        fileType.nestedFileTypes = new pageflow.FileTypesCollection(
          _.map(fileType.nestedFileTypes.fileTypes, function(nestedFileType) {
          var clientSideConfig = clientSideConfigs[nestedFileType];
          var serverSideConfig = _.find(serverSideConfigs, function(config) {
            return config.collectionName === nestedFileType;
          });
          return new pageflow.FileType(_.extend({}, serverSideConfig, clientSideConfig));
        }));
      };
    });
  }
});

_.each(['each', 'map', 'reduce', 'first', 'find', 'findByUpload', 'findByCollectionName'], function(method) {
  pageflow.FileTypes.prototype[method] = function() {
    if (!this._setup) {
      throw  'File types are not yet set up.';
    }

    return this.fileTypes[method].apply(this.fileTypes, arguments);
  };
});
