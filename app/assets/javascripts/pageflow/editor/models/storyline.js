pageflow.Storyline = Backbone.Model.extend({
  modelName: 'storyline',
  paramRoot: 'storyline',
  i18nKey: 'pageflow/storyline',

  initialize: function(attributes, options) {
    this.chapters = new pageflow.StorylineChaptersCollection({
      chapters: options.chapters || pageflow.chapters,
      storyline: this
    });

    this.configuration = new pageflow.StorylineConfiguration(this.get('configuration') || {});

    this.listenTo(this.configuration, 'change', function() {
      this.save();
      this.trigger('change:configuration', this);
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/storylines';
  },

  addChapter: function(params) {
    var defaults = {
      storyline_id: this.id,
      title: '',
      position: this.chapters.length
    };
    return this.chapters.create(_.extend(defaults, params));
  },

  toJSON: function() {
    return {
      configuration: this.configuration.toJSON()
    };
  },

  destroy: function() {
    this.destroyWithDelay();
  }
});