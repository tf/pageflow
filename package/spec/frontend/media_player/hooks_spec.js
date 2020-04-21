import BackboneEvents from 'backbone-events-standalone';

import _ from 'underscore';

import {mediaPlayer} from 'pageflow/frontend';

import sinon from 'sinon';

describe('hooks', function() {
  var hooks = mediaPlayer.hooks;
  var asyncPlay = mediaPlayer.asyncPlay;

  describe('#play', function() {
    describe('without before option', function() {
      it('calls orginal play method', function() {
        var player = fakePlayer();
        hooks(player, {});

        player.play();

        expect(player.originalPlay).toHaveBeenCalled();
      });
    });

    describe('with before option', function() {
      it('calls passed function', function() {
        var player = fakePlayer();
        var beforeCallback = sinon.spy();
        hooks(player, {
          before: beforeCallback
        });

        player.play();

        expect(beforeCallback).toHaveBeenCalled();
      });

      it('emits beforeplay event', function() {
        var player = fakePlayer();
        var eventHandler = sinon.spy();
        hooks(player, {
          before: function() {}
        });

        player.on('beforeplay', eventHandler);
        player.play();

        expect(eventHandler).toHaveBeenCalled();
      });

      it('aborts intent to pause', function() {
        var player = fakePlayer();
        hooks(player, {
          before: function() {
            return Promise.resolve();
          }
        });

        player.intendToPause();
        player.play();

        expect(player.intendingToPause()).toBe(false);
      });

      it('calls original play method when promise returned by before is resolved', async () => {
        var player = fakePlayer();

        var promiseResolve;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
        });

        hooks(player, {
          before: function() {
            return promise;
          }
        });

        player.play();
        await promiseResolve();

        expect(player.originalPlay).toHaveBeenCalled();
      });

      it('does not call original play method until promise returned by before is resolved', function() {
        var player = fakePlayer();
        hooks(player, {
          before: function() {
            return Promise.resolve();
          }
        });

        player.play();

        expect(player.originalPlay).not.toHaveBeenCalled();
      });

      it('calls original play method if before does not return promise', function() {
        var player = fakePlayer();
        hooks(player, {
          before: function() {}
        });

        player.play();

        expect(player.originalPlay).toHaveBeenCalled();
      });

      it('does not call original play method if player is paused before promise returned by before is resolved', async () => {
        var player = fakePlayer();

        var promiseResolve;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
        });

        hooks(player, {
          before: function() {
            return promise;
          }
        });

        player.play();
        player.pause();
        promiseResolve();

        expect(player.originalPlay).not.toHaveBeenCalled();
      });
    });
  });

  function fakePlayer() {
    var playSpy = sinon.spy();
    var playAndFadeInSpy = sinon.spy();

    var player = _.extend({
      play: playSpy,
      originalPlay: playSpy,

      playAndFadeIn: playAndFadeInSpy,
      originalPlayAndFadeIn: playAndFadeInSpy,

      pause: sinon.spy()
    }, BackboneEvents);

    asyncPlay(player);

    return player;
  }
});
