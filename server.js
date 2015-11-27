var Express = require('express');
var App = Express()
var Http = require('http').Server(App);


App.get('/', function(req, res){
  res.sendFile(process.cwd()+'/index.html');
});

//Start Srever On 8080 Port
Http.listen(8080, function(){
  var Logger = require('./Logger')('./log/Server.log');
  Logger.log('info','Server Start To Listen on 8080!!!');
});
// Start Socket On 8080 Port
var Socket = require('./Socket');
Socket.StartListen(Http)
