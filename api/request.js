var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports.send = function(req, res, next){

  var from = req.body.origin;
  var to = req.body.to;

  //
  User.findOne({id: from}, function(err, result){
    if (err){
      console.log(err);
    }
    console.log("Found from user");
    var fromUser = result;
    User.findOne({id: to}, function(err, result){
      if (err){
        console.log(err);
      }
      console.log("Found to user");
      var toUser = result;



      User.update(
        {
          _id: fromUser._id
        },
        {$addToSet: {sent: toUser._id}}, function(err){
          if (err){
            console.log(err);
          }
          console.log('Added to sent');
          User.update(
            {
              _id: toUser._id
            },
            {$addToSet: {received: fromUser._id}}, function(err){
              if (err){
                console.log(err);
              }
              res.status(200).json({'message': 'Friend request was sent'});
              console.log('Added to received');
            }
          ) // End update
        } // End then
      )

    }) // End find
  }) // End find
}

module.exports.accept = function(req, res, next){
  var from = req.body.from;
  var id = req.body.accept_id;

  // Get the objects



  findUsers(from, id, function(fromId, toId){
    removeRequests(fromId, toId, function(fromId, toId){
      addToFriends(fromId, toId);
      res.status(200).json({'message': 'Friend was added'});
    });
  })
}

var findUsers = function(from, to, callback){
  console.log("Finding users");
  var fromId = null;
  var toId = null;

  User.findOne({id: from}, function(err, resultOne){
    if (err){
      console.log(err);
    }
    console.log("Found first user");
    fromId = resultOne._id;
    User.findOne({id: to}, function(err, resultTwo){
      if (err){
        console.log(err);
      }
      console.log("Found second user");
      toId = resultTwo._id;
      callback(fromId, toId);
    });
  });
}

var removeRequests = function(fromId, toId, callback){
  console.log("First callback was called");
  console.log("Callback is removing request");
  console.log(fromId);
  console.log(toId);
  User.update(
    {_id: fromId},
    {$pull: { "received": {"_id":  mongoose.Schema.ObjectId('"' + toId + '"')}}},
    {safe: true},
    function(err, resultThree){
      if (err){
        console.log(err);
      }
      console.log("Request removed from first user");
      User.update(
        {_id: toId},
        {$pull: { "sent": {"_id":  mongoose.Schema.ObjectId('"' + fromId + '"')}}},
        {safe: true},
        function(err, resultFour){
          if (err){
            console.log(err);
          }
          console.log("Request removed from second user");
          callback(fromId, toId);
        });
    });



}

var addToFriends = function(fromId, toId){
  console.log("Second callback was called");
  console.log("Callback is adding friends");
  console.log(fromId);
  console.log(toId);
  User.update(
    {_id: toId},
    { $addToSet: { "friends": {"_id": fromId}}},
    {safe: true},
    function(err, resultFour){
      if (err){
        console.log(err);
      }
      console.log("Friends was added to user one");
      User.update(
        {_id: fromId},
        {$addToSet: { "friends": {"_id": toId}}},
        {safe: true},
        function(err, resultFour){
          if (err){
            console.log(err);
          }
          console.log("Friends was added to user two");
        })

    }
  );

}


module.exports.decline = function(req, res, next){
  var from = req.body.from;
  var to = req.body.decline_id;

  findUsers(from, id, function(fromId, toId){
    removeRequests(fromId, toId, function(fromId, toId){
      res.status(200).json({'message': 'Friend request was declined'});
      // Nothing to do here.
    });
  })
}
