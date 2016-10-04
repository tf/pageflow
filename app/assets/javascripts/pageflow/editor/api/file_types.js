pageflow.FileTypes = pageflow.Object.extend({
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
    this._setup = true;

    this.fileTypes = _.map(serverSideConfigs, function(serverSideConfig) {
      var clientSideConfig = this.clientSideConfigs[serverSideConfig.collectionName];

      if (!clientSideConfig) {
        throw 'Missing client side config for file type "' + serverSideConfig.collectionName + '"';
      }

      _(this.clientSideConfigModifications[serverSideConfig.collectionName])
        .each(function(modification) {
          clientSideConfig.configurationEditorInputs =
            (clientSideConfig.configurationEditorInputs || []).concat(
              modification.configurationEditorInputs || []
            );

          clientSideConfig.confirmUploadTableColumns =
            (clientSideConfig.confirmUploadTableColumns || []).concat(
              modification.confirmUploadTableColumns || []
            );

          clientSideConfig.filters  =
            (clientSideConfig.filters || []).concat(
              modification.filters || []
            );
        });

      return new pageflow.FileType(_.extend({}, serverSideConfig, clientSideConfig));
    }, this);
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

    if (!result) {
      throw('Could not find file type by collection name "' + collectionName +'"');
    }

    return result;
  }
});

_.each(['each', 'map', 'reduce', 'first', 'find'], function(method) {
  pageflow.FileTypes.prototype[method] = function() {
    if (!this._setup) {
      throw  'File types are not yet set up.';
    }

    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.fileTypes);
    return _[method].apply(_, args);
  };
});

pageflow.FileTypes.UnmatchedUploadError = pageflow.Object.extend({
  name: 'UnmatchedUploadError',

  initialize: function(upload) {
    this.upload = upload;
    this.message = 'No matching file type found for upload "' + upload.name + '" of type "' + upload.type +'".';
  }
});