
var request = require("request");
var clients = {};

module.exports = function (socket) {

    // Emit connect event to the socket
    // This event on client side will emit an event to the server (here) of storeClientInfo
    console.log('Connection');
    socket.emit('connect', {});

    socket.on('storeClientInfo', function (data) {
        console.log('Storing client info');

        var clientInfo = new Object();
        clientInfo.customId  = data.customId;
        clientInfo.clientId  = socket.id;

        console.log("fb-id: " + data.customId);

        // Save the fb-ids in friends
        request.post('http://localhost:3000/api/user/friends', {form: {id: data.customId}}, function(err,httpResponse,body){
          console.log(body);
          clientInfo.friends = [];

          // For every friend, save the fb id in the clientinfo
          body.forEach(function(item){
            clientInfo.friends.push(item.id);
          })
        });

        clients[data.customId] = clientInfo;

        console.log(clients);
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
