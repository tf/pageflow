import cookieNotice from 'cookieNotice';
import {isCookieNoticeVisible} from 'cookieNotice/selectors';
import {dismiss} from 'cookieNotice/actions';
import createStore from 'createStore';
import Backbone from 'backbone';

import sinon from 'sinon';

describe('cookieNotice', () => {
  function setup(cookies = fakeCookies()) {
    const widgetsApi = fakeWidgetsApi();
    const events = {...Backbone.Events};

    const store = createStore([cookieNotice], {widgetsApi, cookies, events});

    return {
      dispatch: store.dispatch.bind(store),

      select(selector) {
        return selector(store.getState());
      },

      widgetsApi,
      cookies,
      events
    };
  }

  function fakeCookies() {
    const cookies = {};

    return {
      hasItem(key) { return cookies[key]; },

      setItem(key, value) { cookies[key] = value; }
    };
  }

  function fakeWidgetsApi() {
    const resetCallback = sinon.spy();

    return {
      resetCallback,
      use: sinon.stub().yields(resetCallback)
    };
  }

  test('is invisible by default', () => {
    const {select} = setup();

    const result = select(isCookieNoticeVisible);

    expect(result).toBe(false);
  });

  test('becomes visible once requested', () => {
    const {select, events} = setup();

    events.trigger('cookie_notice:request');
    const result = select(isCookieNoticeVisible);

    expect(result).toBe(true);
  });

  test('is hidden on dismiss', () => {
    const {select, events, dispatch} = setup();

    events.trigger('cookie_notice:request');
    dispatch(dismiss());
    const result = select(isCookieNoticeVisible);

    expect(result).toBe(false);
  });

  test('stays invisible if dismissed before', () => {
    const cookies = fakeCookies();

    const {dispatch} = setup(cookies);
    dispatch(dismiss());

    const {select, events} = setup(cookies);

    events.trigger('cookie_notice:request');
    const result = select(isCookieNoticeVisible);

    expect(result).toBe(false);
  });

  test('uses cookie_notice_bar_visible widget when it becomes visible', () => {
    const {events, widgetsApi} = setup();

    events.trigger('cookie_notice:request');

    expect(widgetsApi.use).toHaveBeenCalledWith({
      name: 'cookie_notice_bar_visible',
      insteadOf: 'cookie_notice_bar'
    });
  });

  test('resets cookie_notice_bar_visible widget once dismissed', () => {
    const {events, dispatch, widgetsApi} = setup();

    events.trigger('cookie_notice:request');
    dispatch(dismiss());

    expect(widgetsApi.resetCallback).toHaveBeenCalled();
  });

  test(
    'does not use cookie_notice_bar_visible widget if dismissed before',
    () => {
      const cookies = fakeCookies();

      const {dispatch} = setup(cookies);
      dispatch(dismiss());

      const {events, widgetsApi} = setup(cookies);

      events.trigger('cookie_notice:request');

      expect(widgetsApi.use).not.toHaveBeenCalledWith({
        name: 'cookie_notice_bar_visible',
        insteadOf: 'cookie_notice_bar'
      });
    }
  );
});
