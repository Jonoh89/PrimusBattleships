'use strict';
var BattleShipsActions = require('./actions/BattleshipsActions');
var primus = require('./PrimusConnection');


primus.on("open", function () {
   BattleShipsActions.connected();
});

primus.on("data", function(data) {

  switch (data.event) {

    case 'start':
      BattleShipsActions.startGame(data.playerTurn, data.playerData);
      break;

    case 'nextTurn':
      BattleShipsActions.nextTurn(data.playerTurn, data.playerData, data.placedShips);
      break;

    case 'newGame':
      BattleShipsActions.newGame();
      break;

    case 'opponentDisconnect':
      BattleShipsActions.opponentDisconnect();
      break;

    case 'opponentConnected':
      BattleShipsActions.opponentConnected();
      break;

    case 'finish':
      BattleShipsActions.finish(data.winner);
      break;
  }

  if (data.phase) {
    BattleShipsActions.phaseChange(data.phase);
  }

});

module.exports = primus;