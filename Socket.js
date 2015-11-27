// var io = require('socket.io')(http);

// Set Maximum Sotred-Message Count
var HistoryMaxCount = 30
var HistoryMessage = []
var Socket

function StartListen(Http, Callback) {
  Socket = require('socket.io')(Http)

  // Set Listener On Connection Event
  Socket.on('connection', function(Connection){
    SetNameHandler(Connection, function (Error) {
      if (Error) {
        return console.log(Error);
      }
      ConnectionHandler(Connection)
    })
  });
}

function SetNameHandler(Connection, Callback) {

  // Send First Message TO Client
  Connection.emit('chat message', 'Wellcome!')

  // Set Listener On User Set Name
  Connection.on('set name', function (NickName) {
    Connection.Nickname = null
    if (Connection.Nickname === null) {
      // Set Nick-Name To Connection
      Connection.Nickname = NickName

      // Histroy Message Prepare
      if(HistoryMessage.length > 0) {
        HistoryMessage.forEach(function (Message) {
          Connection.emit('chat message', Message)
        })
      }
      // Broadcast User Check In
      var Message = "["+NickName+"] 進入聊天室"
      Broadcast(Message)
      HistoryMessageHandler(Message)

    }
    Callback(null)
  })
}

function ConnectionHandler(Connection) {
  Connection.on('chat message', function(Message){
    // Broadcast User Message
    var Message = "["+Connection.Nickname+"] ： "+Message
    Broadcast(Message)
    HistoryMessageHandler(Message)
  });

  Connection.on('disconnect', function(){
    var Message = "["+Connection.Nickname+"] 離開聊天室"
    Broadcast(Message)
    HistoryMessageHandler(Message)
  });
}

function HistoryMessageHandler(Message) {
  // ReFlash History Message
  if(HistoryMessage.length > HistoryMaxCount){
    var NewHistoryMessage = []
    for (var i = HistoryMaxCount-20; i < HistoryMaxCount; i++) {
      NewHistoryMessage.push(HistoryMessage[i])
    }
    HistoryMessage = NewHistoryMessage;
  }
  // Stored In Histroy Message Array
  HistoryMessage.push(Message)

}


// Broadcast Function --> Send Message To All User
function Broadcast(Message) {
  Socket.emit('chat message',Message)
  MessageLog(Message)
}

var Logger = require('./Logger')('./log/Message.log');
function MessageLog(Message) {
  Logger.log('info',Message);
}

module.exports= {
  StartListen : StartListen
}
