var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.send = function(req, res, next) {
  var from = req.params.fbid;
  var to = req.body.to;

  // Search the database for the user sending the request
  User.findOne({id: from}, function(err, result) {
    if(err) {
      console.log(err);
    }

    console.log("Found from user");
    var fromUser = result;
    User.findOne({id: to}, function(err, result) {
      if(err) {
        console.log(err);
      }
      // Search the database for the user receiving the request
      console.log("Found to user");
      var toUser = result;

      User.update(
        {_id: fromUser._id},
        {$addToSet: {sent: toUser._id}}, function(err) {
          if(err) {
            console.log(err);
          }
          console.log('Added to sent');
          User.update(
            {_id: toUser._id},
            {$addToSet: {received: fromUser._id}}, function(err) {
              if(err) {
                console.log(err);
              }
              res.status(200).json({'message': 'Friend request was sent'});
              console.log('Added to received');
            } // End fromUser $addToSet error
          ) // End toUser User.update
        } // End toUser $addToSet error
      ) // End fromUser User.update
    }) // End find toUser
  }) // End find fromUser
} // End send

module.exports.accept = function(req, res, next) {
  var from = req.params.fbid;
  var to = req.body.accept_id;

  // Get the objects
  var fromId = null;
  var toId = null;
  var fromUser = "";
  var toUser = "";

  User.findOne({id: from}, function(err, resultOne) {
    if (err){
      console.log(err);
    }
    fromName = resultOne.name;
    fromId = resultOne._id;
    console.log(fromId);

    User.findOne({id: to}, function(err, resultTwo) {
      if(err) {
        console.log(err);
      }
      toName = resultTwo.name;
      toId = resultTwo._id;
      console.log(toId);

      User.findOneAndUpdate(
        {name: fromName},
        {$pull: {'received': toId}},
        {safe: true}).exec();

      User.findOneAndUpdate(
        {name: toName},
        {$pull: {'sent': fromId}},
        {safe: true}).exec();

      User.findOneAndUpdate(
        {_id: toId},
        {$addToSet: {friends: fromId}},
        {safe: true}).exec();

      User.findOneAndUpdate(
        {_id: fromId},
        {$addToSet: {friends: toId}},
        {safe: true}).exec();
    })
    res.status(200).json({'message': 'Friend added'});
  })
  // Put each other in friends
  // Remove from sent and received
}

module.exports.decline = function(req, res, next) {
  var from = req.params.fbid;
  var to = req.body.decline_id;
  // Remove from sent and received
}
