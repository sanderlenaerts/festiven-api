
var request = require("request-json");
var requestClient = request.createClient('http://localhost:8080/');
var clients = {};

module.exports = function (io) {

  io.sockets.on('connection', function(socket){

    // Emit connect event to the socket
    // This event on client side will emit an event to the server (here) of storeClientInfo
    console.log('Connection');
    socket.emit('connect', {});

    socket.on('sendLocation', function(data){
      if (clients.hasOwnProperty(data.id)){
        var friends = clients[data.id].friends;
        for (var i = 0; i < friends.length; i++){
          // Get the socketid out of the list of clients with help of fb id

          if (clients.hasOwnProperty(friends[i])){
            var socketid = clients[friends[i]].clientId;
            if (io.sockets.connected[socketid]) {
              // Emit to the friend the data
              // Data contains fb id of user and location data
              io.sockets.connected[socketid].emit('receive-location', data);
            }
          }
        }
      }



    })

    socket.on('storeClientInfo', function (data) {
        console.log('Storing client info');

        var clientInfo = new Object();
        clientInfo.customId  = data.customId;
        clientInfo.clientId  = socket.id;
        console.log('Id: ', data.customId);

        // Save the fb-ids in friends
        requestClient.get('api/users/' + data.customId + '/friends', function(err, res, body){
          clientInfo.friends = [];
          console.log(body);

          // For every friend, save the fb id in the clientinfo
          for (var i = 0; i < body.length; i++){
            var item = body[i];
            clientInfo.friends.push(item.id);
          }
          clients[data.customId] = clientInfo;
          socket.emit('start-transmit', {});
        })
    })

    socket.on('add-friend', function(data){
      // Push the new friend to the friends
      var myId = data.myId;
      var id = data.id;

      if (clients.hasOwnProperty(myId)){
        clients[myId].friends.push(id);
      }
      if (clients.hasOwnProperty(id)){
        clients[id].friends.push(myId);
      }

    })

    socket.on('delete-friend', function(data){


      var myId = data.myId;
      var id = data.id;

      var index = clients[myId].friends.indexOf(id);

      if (index > -1) {
          array.splice(index, 1);
      }

      index = clients[id].friends.indexOf(myId);

      if (index > -1) {
          array.splice(index, 1);
      }
    })

    socket.on('disconnect', function (data) {

      for (var key in clients) {
        if (clients.hasOwnProperty(key)) {
          if (clients[key].clientId == socket.id){
            deleteMarkerFromFriends(data.id)
            delete clients[key];
            break;
          }
        }
      }
    })
  });
}

var deleteMarkerFromFriends = function(id){
  if (clients.hasOwnProperty(id)){
    var friends = clients[id].friends;
    for (var i = 0; i < friends.length; i++){
      // Get the socketid out of the list of clients with help of fb id

      if (clients.hasOwnProperty(friends[i])){
        var socketid = clients[friends[i]].clientId;
        if (io.sockets.connected[socketid]) {
          // Emit to the friend the data
          // Data contains fb id of user and location data
          io.sockets.connected[socketid].emit('delete-location', id);
        }
      }
    }
  }
}
