pageflow.PageThumbnailView = Backbone.Marionette.View.extend({
  className: 'page_thumbnail',

  modelEvents: {
    'change:configuration': 'update'
  },

  render: function() {
    this.update();
    return this;
  },

  update: function() {
    var file = this.model && this.model.thumbnailFile();

    if (this.fileThumbnailView && this.currentFileThumbnail == file) {
      return;
    }

    this.currentFileThumbnail = file;

    if (this.fileThumbnailView) {
      this.fileThumbnailView.close();
    }

    this.fileThumbnailView = this.subview(new pageflow.FileThumbnailView({
      model: file,
      className: 'thumbnail file_thumbnail',
      imageUrlPropertyName: this.options.imageUrlPropertyName
    }));

    this.$el.append(this.fileThumbnailView.el);
  }
});