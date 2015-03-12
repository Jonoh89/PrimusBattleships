'use strict';

var React = require('react');
var GameStore = require('../stores/GameStore');
var _ = require('lodash');
var BattleshipsActions = require('../actions/BattleshipsActions');

var gridsize = 10;

function getStateFromStores() {
  return {
    opponentInfo: GameStore.getOpponentInfo(),
    shots: GameStore.getPlayerShots(),
    hits: GameStore.getPlayerHits(),
    playerTurn: GameStore.getPlayerTurn()
  }
}

var OpponentBoard = React.createClass({

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
        if (_.any(this.state.shots, _.matches({x: x, y: y}))) {
          squareStyles.backgroundColor = 'red';
        }
        if (_.any(this.state.hits, _.matches({x: x, y: y}))) {
          squareStyles.backgroundColor = 'green';
        }
        if (this.state.playerTurn) {
          if (_.isMatch(this.state.hoveringCords, {x: x, y: y})) {
            squareStyles.backgroundColor = 'brown';
          }

          return <span data-x={x} data-y={y} style={squareStyles} onMouseOver={this._onSquareMouseOver} onClick={this._onSquareClick} onMouseOut={this._onSquareMouseOut}></span>;
        } else {
          return <span data-x={x} data-y={y} style={squareStyles}></span>;
        }
      }, this);
      return <div>{row}</div>
    }, this);


    var title;
    if (this.state.opponentInfo) {
      if (this.state.opponentInfo.disconnected) {
        title = this.state.opponentInfo.name + '\'s Board - DISCONNECTED';
      } else {
        title = this.state.opponentInfo.name + '\'s Board';
      }
    }

    return (
      <section id="opponentBoard" style={styles.opponentBoard}>
        <h1>{title}</h1>
        <div className="grid">{grid}</div>
      </section>
    )
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState(getStateFromStores());
    }
  },

  _onSquareMouseOver: function (event) {
    this.setState({hoveringCords: {x: parseInt(event.target.dataset.x), y: parseInt(event.target.dataset.y)}});
  },

  _onSquareMouseOut: function (event) {
    this.setState({hoveringCords: null});
  },

  _onSquareClick: function (event) {
    BattleshipsActions.fire({x: parseInt(event.target.dataset.x), y: parseInt(event.target.dataset.y)});
  }

});

var styles = {
  opponentBoard: {
    margin: '10px 25px 20px 25px'
  },
  square: {
    display: 'inline-block',
    height: 30,
    width: 30,
    backgroundColor: 'blue',
    margin: 2
  }
};


module.exports = OpponentBoard;