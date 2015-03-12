'use strict';

var React = require('react');
var GameStore = require('../stores/GameStore');
var _ = require('lodash');

var gridsize = 10;

function getStateFromStores() {
  return {
    placedShips: GameStore.getPlacedShips(),
    squaresHit: GameStore.getOpponentShots()
  }
}

var PlayerBoard = React.createClass({

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

    var grid = _.times(gridsize, function (y) {
      var row =  _.times(gridsize, function (x) {
        var squareStyles = _.cloneDeep(styles.square);
        var text = '';
        var squareContainsShip = _.any(this.state.placedShips, _.matches({x: x, y: y}));
        var squareHasBeenHit = _.any(this.state.squaresHit, _.matches({x: x, y: y}))
        if (squareContainsShip && squareHasBeenHit) {
          squareStyles.backgroundColor = 'grey';
          text = 'X';
        } else if (squareHasBeenHit) {
          squareStyles.backgroundColor = 'red';
        } else if (squareContainsShip) {
          squareStyles.backgroundColor = 'grey';
        }
        return <span data-x={x} data-y={y} style={squareStyles}>{text}</span>;
      }, this);
      return <div>{row}</div>
    }, this);


    return (
      <section id="playerBoard" style={styles.playerBoard}>
        <h1>My Board</h1>
        <div className="grid">{grid}</div>
      </section>
    )
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState(getStateFromStores());
    }
  }

});

var styles = {
  playerBoard: {
    margin: '10px 25px 20px 25px'
  },
  square: {
    display: 'inline-block',
    height: 20,
    width: 20,
    backgroundColor: 'blue',
    margin: 1,
    color: 'red',
    overflow: 'hidden',
    textAlign: 'center'
  }
};


module.exports = PlayerBoard;