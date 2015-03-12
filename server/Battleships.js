'use strict';

module.exports = function (primus) {
  var Players = require('./collections/players');
  var Games = require('./collections/games')(primus);

  var _players = new Players();
  var _games = new Games();

  return {

    signIn: function (name, spark) {
      var player = _players.findPlayerByName(name);
      if (player) {
        player.spark = spark.id;
        var game = _games.gameWithPlayer(name);
        if (game) {
          game.reconnectPlayer(player);
        } else {
          spark.write({phase: 'placeShips'});
        }
      } else {
        _players.createPlayer(name, spark.id);
        spark.write({phase: 'placeShips'});
      }
    },

    placedShips: function (name, cords) {
      var player = _players.findPlayerByName(name);
      player.shipCords = cords;

      var game = _games.availableGame();

      if (game) {
        game.addPlayer(player);
        game.start();
      } else {
        _games.createGame(player);
      }
    },

    fire: function (playerName, cords) {
      var game = _games.gameWithPlayer(playerName);
      game.fire(playerName, cords)
    },

    playerDisconnected: function (sparkId) {
      var player = _players.findPlayerBySpark(sparkId);
      if (player) {
        player.spark = null;
        var game = _games.gameWithPlayer(player.name);
        if (game) {
          game.playerDisconnected(player);
        }
      }
    }

  }
};