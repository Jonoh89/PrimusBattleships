'use strict';

var React = require('react');
var PrimusStore = require('../stores/PrimusStore');

function getStateFromStores() {
  return {
    primus: PrimusStore.getState()
  }
}

var Status = React.createClass({

  getInitialState: function () {
    return getStateFromStores();
  },

  componentDidMount: function() {
    PrimusStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    PrimusStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var connectionStatus, phase;
    if (this.state.primus.connected) {
      connectionStatus = <span>Conencted!</span>;
      if (this.props.phase) {
        phase = <span> in {this.props.phase} phase.</span>
      }
    } else {
      connectionStatus = <span>Connecting...</span>;
    }

    return (
      <section id="status">
        {connectionStatus}
        {phase}
      </section>
    )
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = Status;