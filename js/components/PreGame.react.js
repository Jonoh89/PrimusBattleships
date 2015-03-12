'use strict';

var React = require('react');
var PrimusStore = require('../stores/PrimusStore');
var GameStore = require('../stores/GameStore');
var BattleshipsActions = require('../actions/BattleshipsActions');
var _ = require('lodash');

var gridsize = 10;
var ships = [{id: 0, size: 5, direction: 'horizontal'}, {id: 1, size: 4, direction: 'vertical'}, {id: 2, size: 3, direction: 'horizontal'}];

function getStateFromStores() {
  return {
    primus: PrimusStore.getState(),
    game: GameStore.getState()
  }
}

function canPlaceShipAt(ship, cords, placedShips) {
  if (placedShips) {
    var shipCords = getShipCords(ship, cords);
    var shipCorssingPlacedShip =  _.any(getPlacedShipCords(placedShips), function(placedShipCords) {
      return _.any(shipCords, _.matches(placedShipCords));
    });
    if (shipCorssingPlacedShip) {
      return false;
    }
  }

  if (ship.direction === 'horizontal') {
     return ship.size + cords.x <= gridsize;
  } else {
    return ship.size + cords.y <= gridsize;
  }
}

function getShipCords(ship, cords) {
  if (ship.direction === 'horizontal') {
    return _.times(ship.size, function (n) {
      return {x: cords.x + n, y: cords.y};
    });
  } else {
    return _.times(ship.size, function (n) {
      return {x: cords.x, y: cords.y + n};
    });
  }
}

function getPlacedShipCords(placedShips) {
  return _.flatten(_.map(placedShips, function (placedShip) {
    return getShipCords(ships[placedShip.ship], placedShip.cords);
  }));
}

var PreGame = React.createClass({

  getInitialState: function () {
    return getStateFromStores();
  },

  componentDidMount: function() {
    PrimusStore.addChangeListener(this._onChange);
    GameStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    PrimusStore.removeChangeListener(this._onChange);
    GameStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var shipPlacementHoverBackgroundColor, shipCords;
    if (this.state.ship && this.state.hoveringCords) {
      shipPlacementHoverBackgroundColor = canPlaceShipAt(this.state.ship, this.state.hoveringCords, this.state.placedShips) ? 'green' : 'red';
      shipCords = getShipCords(this.state.ship, this.state.hoveringCords);
    }

    var grid = _.times(gridsize, function (y) {
      var row =  _.times(gridsize, function (x) {
        var squareStyle = _.cloneDeep(styles.square);
        if (this.state.hoveringCords) {
          if (_.any(shipCords, _.matches({x: x, y: y}))) {
            squareStyle.backgroundColor = shipPlacementHoverBackgroundColor;
          }
          if (this.state.placedShips) {
            var placedShipCords = getPlacedShipCords(this.state.placedShips);
            if (_.any(placedShipCords, _.matches({x: x, y: y}))) {
              squareStyle.backgroundColor = 'grey';
            }
          }
        }

        return <span data-x={x} data-y={y} onMouseOver={this._onSquareMouseOver} onClick={this._onSquareMouseClick} style={squareStyle}></span>;
      }, this);
      return <div>{row}</div>
    }, this);

    var shipsButtons = _.map(ships, function (ship, index) {
      if (!_.any(this.state.placedShips, _.matchesProperty('ship', ship.id))) {
        var buttonText = ship.size + ' ' + ship.direction;
        return <button type="submit" data-ship={index} onClick={this._onShipClick}>{buttonText}</button>
      }
    }, this);

    return (
      <section id="game">
        <div className="grid">{grid}</div>
        <div className="ships">{shipsButtons}</div>
      </section>
    )
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState(getStateFromStores());
    }
  },

  _onSquareMouseOver: function (event) {
    if (this.state.ship) {
      this.setState({hoveringCords: {x: parseInt(event.target.dataset.x), y: parseInt(event.target.dataset.y)}});
    }
  },

  _onSquareMouseClick: function () {
    var cords = {x: parseInt(event.target.dataset.x), y: parseInt(event.target.dataset.y)};
    if (this.state.ship && this.state.hoveringCords && canPlaceShipAt(this.state.ship, cords, this.state.placedShips)) {
      this.state.placedShips = this.state.placedShips || [];
      this.state.placedShips.push({ ship: this.state.ship.id, cords: cords });
      this.setState({ placedShips: this.state.placedShips, ship: null } );
      if (this.state.placedShips.length === ships.length) {
        BattleshipsActions.placedShips(getPlacedShipCords(this.state.placedShips));
      }
    }
  },

  _onShipClick: function (event) {
    event.preventDefault();
    this.setState({ship: ships[parseInt(event.target.dataset.ship)]});
  }

});

var styles = {
  square: {
    display: 'inline-block',
    height: 30,
    width: 30,
    backgroundColor: 'blue',
    margin: 2
  }
};


module.exports = PreGame;