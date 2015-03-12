'use strict';

var React = require('react');
var PlayerBoard = require('./PlayerBoard.react');
var OpponentBoard = require('./OpponentBoard.react');

var Game = React.createClass({

  render: function () {

    return (
      <section id="game">
        <PlayerBoard />
        <OpponentBoard />
      </section>
    );

  }

});

module.exports = Game;