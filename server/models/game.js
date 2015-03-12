'use strict';

var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

module.exports = function (primus) {

  return function () {
    var Game = assign({}, EventEmitter.prototype, {
    players: [],
    state: {
      phase: 'placeShips',
      turn: 0
    },

    addPlayer: function (player) {
      this.players.push(player);
    },

    start: function (start) {
      this.state.phase = 'game';
      var playerNames = _.map(this.players, 'name');
      var turn = this.state.turn;

      _.each(this.players, function (player) {
        var spark = primus.spark(player.spark);
        spark.write({
          phase: 'game',
          event: 'start',
          playerData: this._getPlayerData(),
          playerTurn: playerNames[turn % 2] === player.name
        });
      }, this);
    },

    fire: function (playerName, cords) {
      var player = _.find(this.players, {name: playerName});
      this.state.turn++;

      player.shots.push(cords);
      var opponent = this._getOpponent(player);
      if (_.any(opponent.shipCords, _.matches(cords))) {
        player.hits.push(cords);
      }

      if (opponent.shipCords.length === player.hits.length) {
        this._finishGame(player, opponent);
      } else {
        _.each(this.players, function (player) {
          this.sendStateToPlayer(player);
        }, this);
      }
    },

    sendStateToPlayer: function (player) {
      var spark = primus.spark(player.spark);
      if (player.shipCords && this.state.phase === 'game') {
        spark.write({
          phase: 'game',
          event: 'nextTurn',
          placedShips: player.shipCords,
          playerData: this._getPlayerData(),
          playerTurn: this._getPlayerNames()[this.state.turn % 2] === player.name
        });
      }
    },

    reconnectPlayer: function (player) {
      var opponent = this._getOpponent(player);
      if (opponent && opponent.spark) {
        var spark = primus.spark(opponent.spark);
        if (spark) {
          spark.write({event: 'opponentConnected'});
        }
      }
      this.sendStateToPlayer(player);
    },

    playerDisconnected: function (player) {
      var opponent = this._getOpponent(player);
      if (opponent && opponent.spark) {
        var spark = primus.spark(opponent.spark);
        if (spark) {
          spark.write({event: 'opponentDisconnect'});
        }
      } else {
        this._endGame();
      }
    },

    _getOpponent: function (player) {
      return _.find(this.players, function (opponent) {
        return opponent !== player
      });
    },

    _getPlayerData: function () {
      return _.map(this.players, function (player) {
        return {name: player.name, shots: player.shots, hits: player.hits};
      });
    },

    _getPlayerNames: function () {
      return _.map(this.players, 'name');
    },

    _finishGame: function (winner, loser) {
      var winningSpark = primus.spark(winner.spark);
      winningSpark.write({phase: 'end', event: 'finish', winner: true});
      var losingSpark = primus.spark(loser.spark);
      losingSpark.write({phase: 'end', event: 'finish', winner: false});
      var self = this;
      _.delay(function () {
        _.each(self.players, function (player) {
          var spark = primus.spark(player.spark);
          spark.write({phase: 'placeShips', event: 'newGame'});
        }, self);
        self._endGame();
      }, 8000)
    },

    _endGame: function () {
      _.each(this.players, function (player) {
        player.leaveGame();
      });
      this.emit('endGame', this);
    }

  });

    return Game;
  };

};