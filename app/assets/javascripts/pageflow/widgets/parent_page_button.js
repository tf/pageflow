(function($) {
  $.widget('pageflow.parentPageButton', {
    _create: function() {
      var element = this.element;

      element.click(function(event) {
        pageflow.slides.goToParentPage();
        event.preventDefault();
      });

      pageflow.slides.on('pageactivate', function(e, ui) {
        update();
      });

      update();

      function update() {
        var pagePermaId = parseInt(pageflow.slides.currentPage().attr('id'), 10);
        var chapterId = pageflow.entryData.getChapterIdByPagePermaId(pagePermaId);
        var chapterConfiguration = pageflow.entryData.getChapterConfiguration(chapterId);

        element.toggleClass('visible',
                            pageflow.slides.parentPageExists() &&
                            (!pageflow.entryData.getThemingOption('configurable_parent_page_button') ||
                             chapterConfiguration.display_parent_page_button));
      }
    }
  });
}(jQuery));