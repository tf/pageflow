import Marionette from 'backbone.marionette';

export const SideBarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/content_elements/:id': 'contentElement'
  }
});
