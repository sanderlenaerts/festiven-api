
var request = require("request-json");
var requestClient = request.createClient('http://localhost:8080/');
var clients = {};

module.exports = function (options) {

    var socket = options.socket;
    var io = options.io;

    // Emit connect event to the socket
    // This event on client side will emit an event to the server (here) of storeClientInfo
    console.log('Connection');
    socket.emit('connect', {});

    socket.on('sendLocation', function(data){
      var friends = clients[data.id].friends;
      for (var i = 0; i < friends.length; i++){
        // Get the socketid out of the list of clients with help of fb id
        var socketid = clients[friends[i]].clientId;
        if (io.sockets.connected[socketid]) {
          // Emit to the friend the data
          // Data contains fb id of user and location data
          io.sockets.connected[socketid].emit(data);
        }
      }


    })

    socket.on('storeClientInfo', function (data) {
        console.log('Storing client info');

        var clientInfo = new Object();
        clientInfo.customId  = data.customId;
        clientInfo.clientId  = socket.id;

        console.log("fb-id: " + data.customId);

        // Save the fb-ids in friends
        requestClient.post('api/user/friends', {id: data.customId}, function(err, res, body){
          console.log(body);
          clientInfo.friends = [];

          // For every friend, save the fb id in the clientinfo
          for (var i = 0; i < body.length; i++){
            var item = body[i];
            clientInfo.friends.push(item.id);
          }
          clients[data.customId] = clientInfo;

          console.log(clients);
        })




    })

    socket.on('add-friend', function(data){
      // Push the new friend to the friends
      socket.clientInfo.friends.push(data.id);
    })

    socket.on('disconnect', function (data) {

      for (var key in clients) {
        if (clients.hasOwnProperty(key)) {
          if (clients[key].clientId = socket.id){
            delete clients[key];
            break;
          }
        }
      }
    })
}
