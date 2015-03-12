'use strict';

var BattleshipsDispatcher = require('../dispatcher/BattleshipsAppDispatcher');
var BattleshipsConstants = require('../constants/BattleshipsConstants');

var BattleshipsActions = {

  connected: function () {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.CONNECTED
      }
    });
  },

  signIn: function (name) {
    BattleshipsDispatcher.dispatch({
      action: {
        type: BattleshipsConstants.SIGNIN,
        data: {name: name}
      }
    });
  },

  phaseChange: function (phase) {
    BattleshipsDispatcher.dispatch({
      action: {
        type: BattleshipsConstants.PHASECHANGE,
        data: {phase: phase}
      }
    });
  },

  placedShips: function (shipCords) {
    BattleshipsDispatcher.dispatch({
      action: {
        type: BattleshipsConstants.PLACEDSHIPS,
        data: { shipCords: shipCords }
      }
    });
  },

  startGame: function (playerTurn, playerData) {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.STARTGAME,
        data: {playerTurn: playerTurn, playerData: playerData}
      }
    });
  },

  opponentDisconnect: function () {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.OPPONENTDISCCONECTED
      }
    });
  },

  opponentConnected: function () {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.OPPONENTCONECTED
      }
    });
  },

  fire: function (cords) {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.FIRE,
        data: {cords: cords}
      }
    });
  },

  nextTurn: function (playerTurn, playerData, placedShips) {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.NEXTTURN,
        data: {playerTurn: playerTurn, playerData: playerData, placedShips: placedShips}
      }
    });
  },

  newGame: function () {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.NEWGAME
      }
    });
  },

  finish: function (winner) {
    BattleshipsDispatcher.dispatch({
      action : {
        type: BattleshipsConstants.FINISH,
        data: {winner: winner}
      }
    });
  }

};

module.exports = BattleshipsActions;