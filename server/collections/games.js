'use strict';
var _ = require('lodash');

module.exports = function (primus) {
  var Game = require('../models/game')(primus);

  function Games() {
    var self = this;
    self.games = [];

    self.availableGame = function () {
      return _.find(self.games, function (game) {
        return game.players.length === 1;
      });
    };

    self.createGame = function (initialPlayer) {
      var game = new Game();
      game.on('endGame', self._endGame);
      self.games.push(game);

      if (initialPlayer) {
        game.players.push(initialPlayer)
      }
    };

    self.gameWithPlayer = function (playerName) {
      return _.find(self.games, function (game) {
        var playerNames = _.map(game.players, 'name');
        return _.contains(playerNames, playerName);
      });
    };

    self._endGame = function (game) {
      _.remove(self.games, game);
    };

  }

  return Games;

};