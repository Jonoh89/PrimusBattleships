'use strict';

var Hapi = require("hapi");
var Primus = require("primus");

var server = new Hapi.Server();
server.connection({ port: 3000 });

var options = {
  transformer: "engine.io",
  timeout: false
};

var primus = new Primus(server.listener, options);
var battleships = require('./server/Battleships')(primus);

primus.on("connection", function(spark) {

  console.log('connection id', spark.id);

  spark.write({phase: 'enterName'});

  spark.on("data", function(data) {

    switch (data.event) {

      case 'signIn':
        battleships.signIn(data.name, spark);
        break;

      case 'placedShips':
        battleships.placedShips(data.name, data.cords);
        break;

      case 'fire':
        battleships.fire(data.name, data.cords);
        break;
    }
  });

});

primus.on('disconnection', function (spark) {
  console.log('disconnection id', spark.id);
  battleships.playerDisconnected(spark.id);
});



server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('./index.html');
  }
});

server.route({
  method: 'GET',
  path: '/js/bundle.js',
  handler: function (request, reply) {
    reply.file('./js/bundle.js');
  }
});

server.start(function () {
  console.log('Server running at:', server.info.uri);
});