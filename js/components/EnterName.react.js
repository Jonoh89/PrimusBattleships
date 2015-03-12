'use strict';

var React = require('react');
var BattleshipsActions = require('../actions/BattleshipsActions');


var EnterName = React.createClass({

  getInitialState: function () {
    return {name: ''};
  },

  render: function () {
    return (
      <section id="enterName">
        <form onSubmit={this._signIn}>
          <input type="text" onChange={this._nameChange} required/>
          <button type="submit" >Ready!</button>
        </form>
      </section>
    )
  },

  _nameChange: function (event) {
    this.setState({name: event.target.value});
  },

  _signIn: function (event) {
    event.preventDefault();
    BattleshipsActions.signIn(this.state.name);
  }

});

module.exports = EnterName;