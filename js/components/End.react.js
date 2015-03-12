'use strict';

var React = require('react');
var GameStore = require('../stores/GameStore');

function getStateFromStores() {
  return {
    won: GameStore.getWinner()
  }
}

var Status = React.createClass({

  getInitialState: function () {
    return getStateFromStores();
  },

  componentDidMount: function() {
    GameStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GameStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var result = this.state.won ? 'won! :D' : 'lost :(';
    return (
      <h1>You {result}</h1>
    )
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState(getStateFromStores());
    }
  }

});

module.exports = Status;