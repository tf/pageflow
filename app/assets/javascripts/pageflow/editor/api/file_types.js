pageflow.FileTypes = pageflow.Object.extend({
  modifyableProperties: [
    'configurationEditorInputs',
    'configurationUpdaters',
    'confirmUploadTableColumns',
    'filters'
  ],

  initialize: function() {
    this.clientSideConfigs = [];
    this.clientSideConfigModifications = {};
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

    this.fileTypes = new pageflow.
      FileTypesCollection(_.map(serverSideConfigs, function(serverSideConfig) {
        var clientSideConfig = clientSideConfigs[serverSideConfig.collectionName];

        if (!clientSideConfig) {
          throw 'Missing client side config for file type "' +
            serverSideConfig.collectionName + '"';
        }

        _(this.clientSideConfigModifications[serverSideConfig.collectionName])
          .each(function(modification) {
            this.lintModification(modification, serverSideConfig.collectionName);
            this.applyModification(clientSideConfig, modification);
          }, this);

        return new pageflow.FileType(_.extend({}, serverSideConfig, clientSideConfig));
      }, this));

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
      }
    });
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
  },

  findByUpload: function(upload) {
    var result = this.find(function(fileType) {
      return fileType.matchUpload(upload);
    });

    if (!result) {
      throw(new pageflow.FileTypes.UnmatchedUploadError(upload));
    }

    return result;
  },

  findByCollectionName: function(collectionName) {
    var result = this.find(function(fileType) {
      return fileType.collectionName === collectionName;
    });
  }
});

_.each(['each', 'map', 'reduce', 'first', 'find', 'findByUpload', 'findByCollectionName'],
       function(method) {
         pageflow.FileTypes.prototype[method] = function() {
           if (!this._setup) {
             throw  'File types are not yet set up.';
           }

           return this.fileTypes[method].apply(this.fileTypes, arguments);
         };
       });
