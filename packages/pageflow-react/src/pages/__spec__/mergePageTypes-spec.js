import mergePageTypes from '../mergePageTypes';

import sinon from 'sinon';

describe('mergePageTypes', () => {
  test('keeps method only defined in base', () => {
    const base = {
      enhance: sinon.spy()
    };
    const mixin = {};

    const result = mergePageTypes(base, mixin);
    result.enhance();

    expect(base.enhance).toHaveBeenCalled();
  });

  test('keeps method only defined in mixin', () => {
    const base = {};
    const mixin = {
      enhance: sinon.spy()
    };

    const result = mergePageTypes(base, mixin);
    result.enhance();

    expect(mixin.enhance).toHaveBeenCalled();
  });

  test('calls both methods when page types provide conflicting method ', () => {
    const base = {
      enhance: sinon.spy()
    };
    const mixin = {
      enhance: sinon.spy()
    };

    const result = mergePageTypes(base, mixin);
    result.enhance();

    expect(base.enhance).toHaveBeenCalled();
    expect(mixin.enhance).toHaveBeenCalled();
  });

  test('uses return value of mixin', () => {
    const base = {
      enhance: sinon.stub().returns(4)
    };
    const mixin = {
      enhance: sinon.stub().returns(5)
    };

    const result = mergePageTypes(base, mixin);

    expect(result.enhance()).toBe(5);
  });

  test('keeps properties only defined in base', () => {
    const base = {
      scroller: true
    };
    const mixin = {};

    const result = mergePageTypes(base, mixin);

    expect(result.scroller).toBe(true);
  });

  test('keeps properties only defined in mixin', () => {
    const base = {};
    const mixin = {
      scroller: true
    };

    const result = mergePageTypes(base, mixin);

    expect(result.scroller).toBe(true);
  });

  test('lets mixin properties win', () => {
    const base = {
      scroller: false
    };
    const mixin = {
      scroller: true
    };

    const result = mergePageTypes(base, mixin);

    expect(result.scroller).toBe(true);
  });
});
