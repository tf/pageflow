import {TextTracksFileMetaDataItemValueView} from '$pageflow/editor';

import * as support from '$support';

describe('TextTracksFileMetaDataItemValueView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.fixture = support.factories.videoFileWithTextTrackFiles({
      textTrackFilesAttributes: [
        {configuration: {label: 'English'}},
        {configuration: {label: 'German'}}
      ]
    });
  });

  support.setupGlobals({
    textTrackFiles: function() { return this.fixture.textTrackFiles; }
  });

  test('renders a comman separated list of text track labels', () => {
    var view = new TextTracksFileMetaDataItemValueView({
      model: testContext.fixture.videoFile
    });

    view.render();

    expect(view.$el.text()).toEqual(expect.arrayContaining(['English']));
  });
});