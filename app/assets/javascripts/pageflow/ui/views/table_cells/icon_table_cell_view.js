pageflow.IconTableCellView = pageflow.TableCellView.extend({
  className: 'icon_table_cell',

  update: function() {
    var icon = this.attributeValue();
    var isPresent = !!this.attributeValue();

    this.removeExistingIcons();

    this.$el.attr('title',
                  isPresent ?
                  this.attributeTranslation('cell_title.' + icon, {
                    value: this.attributeValue()
                  }) :
                  this.attributeTranslation('cell_title.blank'));
    this.$el.addClass(icon);
  },

  removeExistingIcons: function() {
    this.$el.removeClass(this.options.iconClasses.join(' '));
  }
});
