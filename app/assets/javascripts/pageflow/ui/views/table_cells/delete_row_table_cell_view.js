pageflow.DeleteRowTableCellView = pageflow.TableCellView.extend({
  className: 'delete_row_table_cell',
  template: 'templates/delete_row_table_cell',

  ui: {
    removeButton: '.remove'
  },

  events: {
    'click .remove': 'destroy',

    'click': function() {
      return false;
    }
  },

  showButton: function() {
    if (this.options.toggleDeleteButton) {
      var context = this.getModel();
      var toggle = context[this.options.toggleDeleteButton].apply(context);

      if (this.options.invertToggleDeleteButton) {
        return !toggle;
      }
      else {
        return toggle;
      }
    }
    else {
      return true;
    }
  },

  update: function() {
    this.ui.removeButton.toggleClass('remove', this.showButton());

    this.ui.removeButton.attr('title', this.attributeTranslation('cell_title'));
  },

  destroy: function() {
    this.getModel().destroy();
  }
});
