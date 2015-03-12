'use strict';

var React = require('react');
var Status = require('./Status.react');
var PreGame = require('./PreGame.react');
var Game = require('./Game.react');
var End = require('./End.react');
var EnterName = require('./EnterName.react');
var GameStore = require('../stores/GameStore');

function getStateFromStore() {
  return {
    phase: GameStore.getPhase()
  }
}

var BattleshipsApp = React.createClass({

  getInitialState: function () {
    return getStateFromStore();
  },

  componentDidMount: function() {
    GameStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GameStore.removeChangeListener(this._onChange);
  },

  render: function () {

    var main;

    switch (this.state.phase) {
      case 'enterName':
        main = <EnterName />;
        break;
      case 'placeShips':
        main = <PreGame />;
        break;
      case 'game':
        main = <Game />;
        break;
      case 'end':
        main = <End />;
        break;
    }

    return (
      <section id="battleships">
        <Status phase={this.state.phase} />
        {main}
      </section>
    )
  },

  _onChange: function() {
    this.setState(getStateFromStore());
  }

});

module.exports = BattleshipsApp;