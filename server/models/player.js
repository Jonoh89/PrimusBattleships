'use strict';

var Player = function (name, spark) {
  this.name = name;
  this.spark = spark;
  this.shipCords = null;
  this.shots = [];
  this.hits = [];

  this.leaveGame = function () {
    this.shipCords = null;
    this.shots = [];
    this.hits = [];
  }
};

module.exports = Player;