pageflow.nativeScrolling = {
  prevent: function() {
    this.preventScrollBouncing();
    this.preventScrollingOnEmbed();
  },

  preventScrollBouncing: function() {
    $(document).on('touchmove', function (e) {
      e.preventDefault();
    });
  },

  preventScrollingOnEmbed: function() {
    $(document).on('wheel mousewheel DOMMouseScroll', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });
  }
};