describe('IconTableCellView', function() {
  support.useFakeTranslations({
    'toxins.warning.cell_title.biohazard': 'Biogefährdung',
    'toxins.warning.cell_title.blank': 'Unbedenklich'
  });

  var iconClasses = ['caustic', 'biohazard', 'radioactive'];

  it('sets cell title attribute according to column attribute value', function() {
    var toxin = new Backbone.Model({warning: 'biohazard'});
    var cell = new pageflow.IconTableCellView({
      column: {
        name: 'warning'
      },
      model: toxin,
      iconClasses: iconClasses,
      attributeTranslationKeyPrefixes: ['toxins']
    });

    cell.render();

    expect(cell.$el).to.have.$attr('title', 'Biogefährdung');
  });

  it('sets cell title attribute if column is blank', function() {
    var toxin = new Backbone.Model();
    var cell = new pageflow.IconTableCellView({
      column: {
        name: 'warning'
      },
      model: toxin,
      iconClasses: iconClasses,
      attributeTranslationKeyPrefixes: ['toxins']
    });

    cell.render();

    expect(cell.$el).to.have.$attr('title', 'Unbedenklich');
  });

  it('adds class corresponding to column attribute value', function() {
    var toxin = new Backbone.Model({warning: 'caustic'});
    var cell = new pageflow.IconTableCellView({
      column: {
        name: 'warning'
      },
      model: toxin,
      iconClasses: iconClasses
    });

    cell.render();

    expect(cell.$el).to.have.$class('caustic');
  });

  it('removes previous class when changing column attribute value', function() {
    var toxin = new Backbone.Model({warning: 'caustic'});
    var cell = new pageflow.IconTableCellView({
      column: {
        name: 'warning'
      },
      model: toxin,
      iconClasses: iconClasses
    });

    cell.render();

    toxin.set('warning', 'radioactive');

    cell.render();

    expect(cell.$el).not.to.have.$class('caustic');
    expect(cell.$el).to.have.$class('radioactive');
  });
});
