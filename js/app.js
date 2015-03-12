'use strict';

var BattleshipsApp = require('./components/BattleshipsApp.react');
require('./engineBroker');
var React = require('react');
window.React = React;

React.render(
  <BattleshipsApp />,
  document.getElementById('battleships')
);