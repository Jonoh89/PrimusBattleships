'use strict';

var BattleshipsConstants = require('../constants/BattleshipsConstants');
var BattleshipsAppDispatcher = require('../dispatcher/BattleshipsAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var primus = require('../PrimusConnection');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var PrimusStore = assign({}, EventEmitter.prototype, {
  state: {
    connected: false,
    name: null
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

  signIn: function (data) {
    this.state.name = data.name;
    primus.write({event: 'signIn', name: data.name})
  },

  placedShips: function (data) {
    primus.write({event: 'placedShips', cords: data.shipCords, name: this.state.name})
  },

  connected: function () {
    this.state.connected = true;
  },

  fire: function (data) {
    primus.write({event: 'fire', cords: data.cords, name: this.state.name});
  }

});

PrimusStore.dispatchToken = BattleshipsAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case BattleshipsConstants.CONNECTED:
      PrimusStore.connected();
      PrimusStore.emitChange();
      break;

    case BattleshipsConstants.SIGNIN:
      PrimusStore.signIn(action.data);
      break;

    case BattleshipsConstants.PLACEDSHIPS:
      PrimusStore.placedShips(action.data);
      break;

    case BattleshipsConstants.FIRE:
      PrimusStore.fire(action.data);
      break;

    default:
    // do nothing
  }

});

module.exports = PrimusStore;