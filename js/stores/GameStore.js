'use strict';

var BattleshipsConstants = require('../constants/BattleshipsConstants');
var BattleshipsAppDispatcher = require('../dispatcher/BattleshipsAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var GameStore = assign({}, EventEmitter.prototype, {
  state: {
    player: null,
    phase: null,
    opponentDisconnected: false,
    playerData: {},
    playerTurn: false,
    placedShips: [],
    opponentShots: [],
    playerShots: [],
    playerHits: [],
    winner: null
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.addListener(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getState: function () {
    return this.state;
  },

  getPhase: function () {
    return this.state.phase;
  },

  getPlacedShips: function () {
    return this.state.placedShips;
  },

  getOpponentInfo: function () {
    var opponent =  _.find(this.state.playerData, function (player) {
      return player.name !== this.state.player;
    }, this);
    if (opponent) {
      return {name: opponent.name, disconnected: this.state.opponentDisconnected};
    }
    return null;
  },

  getOpponentShots: function () {
    return this.state.opponentShots;
  },

  getPlayerShots: function () {
      return this.state.playerShots;
  },

  getPlayerHits: function () {
      return this.state.playerHits;
  },

  getPlayerTurn: function () {
      return this.state.playerTurn;
  },

  getWinner: function () {
      return this.state.winner;
  },

  _phaseChange: function (data) {
    this.state.phase = data.phase;
  },

  _startGame: function (data) {
    this.state.playerTurn = data.playerTurn;
    this.state.playerData = data.playerData;
  },

  _placedShips: function (data) {
    this.state.placedShips = data.shipCords;
  },

  _opponentDisconnected: function () {
    this.state.opponentDisconnected = true;
  },

  _opponentConnected: function () {
    this.state.opponentDisconnected = false;
  },

  _fire: function (data) {
    this.state.playerShots.push(data.cords);
  },

  _setName: function (data) {
    this.state.player = data.name;
  },

  _nextTurn: function (data) {
    this.state.playerTurn = data.playerTurn;
    this.state.placedShips = data.placedShips;
    this.state.playerData = data.playerData;
    _.each(data.playerData, function (player) {
      if (player.name === this.state.player) {
        this.state.playerShots = player.shots;
        this.state.playerHits = player.hits;
      } else {
        this.state.opponentShots = player.shots;
      }
    }, this);
  },

  _newGame: function () {
    this.state.opponentDisconnected = false;
    this.state.playerData = {};
    this.state.playerTurn = false;
    this.state.placedShips = [];
    this.state.opponentShots = [];
    this.state.playerShots = [];
    this.state.playerHits = [];
    this.state.winner = null;
  },

  _finishGame: function (data) {
    this.state.winner = data.winner;
  }

});

GameStore.dispatchToken = BattleshipsAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case BattleshipsConstants.SIGNIN:
      GameStore._setName(action.data);
      break;

    case BattleshipsConstants.PHASECHANGE:
      GameStore._phaseChange(action.data);
      GameStore.emitChange();
      break;

    case BattleshipsConstants.STARTGAME:
      GameStore._startGame(action.data);
      GameStore.emitChange();
      break;

    case BattleshipsConstants.OPPONENTDISCCONECTED:
      GameStore._opponentDisconnected();
      GameStore.emitChange();
      break;

    case BattleshipsConstants.OPPONENTCONECTED:
      GameStore._opponentConnected();
      GameStore.emitChange();
      break;

    case BattleshipsConstants.PLACEDSHIPS:
      GameStore._placedShips(action.data);
      GameStore.emitChange();
      break;

    case BattleshipsConstants.FIRE:
      GameStore._fire(action.data);
      GameStore.emitChange();
      break;

    case BattleshipsConstants.NEXTTURN:
      GameStore._nextTurn(action.data);
      GameStore.emitChange();
      break;

    case BattleshipsConstants.NEWGAME:
      GameStore._newGame();
      GameStore.emitChange();
      break;

    case BattleshipsConstants.FINISH:
      GameStore._finishGame(action.data);
      GameStore.emitChange();
      break;

    default:
    // do nothing
  }

});

module.exports = GameStore;