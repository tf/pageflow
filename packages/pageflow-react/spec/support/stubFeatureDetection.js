import sinon from 'sinon';

export default function stubFeatureDetection() {
  let browserBackup = {};

  beforeEach(() => {
    window.pageflow = window.pageflow || {};
    browserBackup = window.pageflow.browser;

    window.pageflow.browser  = {
      has: sinon.stub().returns(false)
    };
  });

  afterEach(() => {
    window.pageflow.browser = browserBackup;
  });
}
