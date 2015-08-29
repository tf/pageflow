(function($) {
  $.widget('pageflow.pageNavigationList', {
    _create: function() {
      var element = this.element;
      var options = this.options;
      var scroller = options.scroller;
      var links = element.find('a[href]');

      var chapterFilter = pageflow.ChapterFilter.create();
      var highlightedPage = pageflow.HighlightedPage.create();

      pageflow.ready.then(function() {
        highlightUnvisitedPages(pageflow.visited.getUnvisitedPages());
        update(getPagePermaId(pageflow.slides.currentPage()));
      });

      pageflow.slides.on('pageactivate', function(e) {
        setPageVisited(e.target.getAttribute('id'));
        update(getPagePermaId(e.target));
      });

      function getPagePermaId(section) {
        return parseInt($(section).attr('id') || $(section).attr('data-perma-id'), 10);
      }

      function update(currentPagePermaId) {
        var highlightedPagePermaId = highlightedPage.getPagePermaId(currentPagePermaId);

        element.toggleClass('inside_sub_chapter', highlightedPagePermaId !== currentPagePermaId);

        highlightPage(highlightedPagePermaId);
        setStorylineTransitionClass(currentPagePermaId);
        filterChapters(currentPagePermaId);
      }

      function highlightPage(permaId) {
        links.each(function() {
          var link = $(this);
          var active = '#' + permaId === link.attr('href');

          link.toggleClass('active', active);
          link.attr('tabindex', active ? '-1' : '3');

          if (active) {
            if (link.data('chapterId')) {
              highlightChapter(link.data('chapterId'));
            }

            if (options.scrollToActive) {
              scroller.scrollToElement(link[0], 800);
            }
          }
        });
      }

      function highlightChapter(activeChapterId) {
        links.each(function() {
          var link = $(this);
          var active = activeChapterId === link.data('chapterId');

          link.toggleClass('in_active_chapter', active);
        });
      }

      function highlightUnvisitedPages(ids) {
        links.each(function() {
          var link = $(this);
          var unvisited = ids.indexOf(parseInt(link.attr('href').substr(1), 10)) >= 0;

          link.toggleClass('unvisited', unvisited);
        });
      }

      function setPageVisited(id) {
        element.find('[href="#' + id + '"]').removeClass('unvisited');
      }

      function filterChapters(currentPagePermaId) {
        links.each(function() {
          var link = $(this);

          link.parent().toggleClass('filtered', !chapterFilter.chapterVisibleFromPage(
            currentPagePermaId,
            link.data('chapterId')
          ));
        });

        scroller.refresh();
      }

      var previousStorylineId;

      function setStorylineTransitionClass(currentPagePermaId) {
        var currentStorylineId = pageflow.entryData.getStorylineIdByPagePermaId(currentPagePermaId);

        var parentPagePermaId = pageflow.entryData.getParentPagePermaId(currentStorylineId);
        var currentParentPageStorylineId = parentPagePermaId && pageflow.entryData.getStorylineIdByPagePermaId(parentPagePermaId);

        parentPagePermaId = pageflow.entryData.getParentPagePermaId(previousStorylineId);
        var previousParentPageStorylineId = parentPagePermaId && pageflow.entryData.getStorylineIdByPagePermaId(parentPagePermaId);

        element.removeClass('moving_in moving_out');

        if (previousStorylineId) {
          if (currentParentPageStorylineId === previousStorylineId) {
            element.addClass('moving_in');
          }
          if (currentStorylineId === previousParentPageStorylineId) {
            element.addClass('moving_out');
          }
        }

        previousStorylineId = currentStorylineId;
      }
    }
  });
}(jQuery));