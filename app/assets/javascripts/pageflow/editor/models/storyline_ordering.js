pageflow.StorylineOrdering = function(storylines, pages) {
  var storylinesByParent;

  this.apply = function() {
    prepare();
    visit(storylines.main(), 1, 'H');
  };

  function visit(storyline, offset, number) {
    storyline.set('position', offset);
    storyline.set('number', number);

    return _(children(storyline)).reduce(function(offset, storyline, index) {
      return visit(storyline, offset, number + '.' + (index + 1));
    }, offset + 1);
  }

  function children(storyline) {
    return storylinesByParent[storyline.cid] || [];
  }

  function prepare() {
    storylinesByParent = _(storylines
      .reduce(function(result, storyline) {
        var parentPage = pages.getByPermaId(storyline.configuration.get('parent_page_perma_id'));
        var key;

        if (parentPage) {
          key = parentPage.chapter.storyline.cid;

          result[key] = result[key] || [];
          result[key].push({
            storyline: storyline,
            page: parentPage
          });
        }

        return result;
      }, {}))
      .reduce(function(result, groups, key) {
        result[key] = _.chain(groups)
          .sort(function(groupA, groupB) {
            var pageIndexA = pages.indexOf(groupA.page);
            var pageIndexB = pages.indexOf(groupB.page);

            var rowA = groupA.storyline.configuration.get('row');
            var rowB = groupB.storyline.configuration.get('row');

            if (pageIndexA > pageIndexB) {
              return 1;
            }
            else if (pageIndexA < pageIndexB) {
              return -1;
            }
            else if (rowA > rowB) {
              return 1;
            }
            else if (rowA < rowB) {
              return -1;
            }
            else {
              return 0;
            }
          })
          .map(function(group) {
            return group.storyline;
          })
          .value();

        return result;
      }, {});
  }
};