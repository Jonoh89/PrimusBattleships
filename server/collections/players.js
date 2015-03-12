'use strict';

var Player = require('../models/player');
var _ = require('lodash');

function Players() {
  this.players = [];

  this.createPlayer = function (name, sparkId) {
    var player = new Player(name, sparkId);
    this.players.push(player);
  };

  this.findPlayerByName = function (name) {
    return _.find(this.players, {'name': name});
  };

  this.findPlayerBySpark = function (sparkId) {
    return _.find(this.players, {spark: sparkId});
  };
}

module.exports = Players;