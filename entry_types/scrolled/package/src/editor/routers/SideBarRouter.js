import Marionette from 'backbone.marionette';

export const SideBarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/chapters/:id': 'chapter',
    'scrolled/sections/:id/transition': 'sectionTransition',
    'scrolled/sections/:id/paddings': 'sectionPaddings',
    'scrolled/sections/:id': 'section',
    'scrolled/content_elements/:id': 'contentElement'
  }
});
