import {editor} from './api';

import {ScrolledEntry} from './models/ScrolledEntry';
import {ContentElementFileSelectionHandler} from './models/ContentElementFileSelectionHandler';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import {SideBarRouter} from './routers/SideBarRouter';
import {SideBarController} from './controllers/SideBarController';

editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,

  previewView(options) {
    return new EntryPreviewView({
      ...options,
      editor
    });
  },
  outlineView: EntryOutlineView
});

editor.registerSideBarRouting({
  router: SideBarRouter,
  controller: SideBarController
});

editor.registerFileSelectionHandler('contentElementConfiguration',
                                    ContentElementFileSelectionHandler);