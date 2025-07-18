import Backbone from 'backbone';

import {TextTableCellView} from 'pageflow/ui';

import {UploadableFilesView, editor} from 'pageflow/editor';

import * as support from '$support';
import {Table} from '$support/dominos/ui';

describe('UploadableFilesView', () => {
  var f = support.factories;

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.files.tabs.image_files': 'Entry Tab',
    'pageflow.editor.files.tabs.image_files': 'Fallback Tab'
  });

  it('renders confirmUploadTableColumns of file type', () => {
    var fileType = f.fileType({
      confirmUploadTableColumns: [
        {name: 'custom', cellView: TextTableCellView}
      ]
    });
    var view = new UploadableFilesView({
      collection: f.filesCollection({
        fileType: fileType
      }),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();
    var table = Table.find(view);

    expect(table.columnNames()).toEqual(expect.arrayContaining(['custom']));
  });

  it('uses entry type-specific translation keys if provided', () => {
    editor.registerEntryType('strange');
    var fileType = f.fileType({collectionName: 'image_files'});
    var view = new UploadableFilesView({
      collection: f.filesCollection({fileType: fileType}),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();

    expect(view.$el.find('thead th').first()).toHaveText('Entry Tab');
  });

  it('falls back to generic translation keys', () => {
    editor.registerEntryType('other');
    var fileType = f.fileType({collectionName: 'image_files'});
    var view = new UploadableFilesView({
      collection: f.filesCollection({fileType: fileType}),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();

    expect(view.$el.find('thead th').first()).toHaveText('Fallback Tab');
  });
});
