var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Marker = mongoose.model('Marker');

module.exports.getSent = function(req, res, next) {
  console.log('getSent');
  var id = req.params.fbid;
  console.log(id);

  User
  .findOne({ id: id })
  .populate('sent')
  .exec(function (err, user) {
    if(err){
      console.log(err);
    }
    res.status(200).json(user.sent);
  });
}

module.exports.getReceived = function(req, res, next) {
  console.log('getSent');
  var id = req.params.fbid;
  console.log(id);

  User
  .findOne({ id: id })
  .populate('received')
  .exec(function (err, user) {
    if(err) {
      console.log(err);
    }
    res.status(200).json(user.received);
  });
}

module.exports.getFriends = function(req, res, next) {
  var id = req.params.fbid;

  User
  .findOne({ id: id })
  .populate('friends')
  .exec(function (err, user) {
    if(err) {
      console.log(err);
    }
    res.status(200).json(user.friends);
  });
}

module.exports.deleteFriend = function(req, res, next){
  var fbid = req.params.fbid;
  var friendid = req.params.friendid;

  User.findOne({id: fbid}, function(err, resultOne){
    if (err){
      console.log(err);
      next(err);
    }

    User.findOne({id: friendid}, function(err, resultTwo){
      if (err){
        console.log(err);
        next(err);
      }

      User.findOneAndUpdate(
        {id: fbid},
        {$pull: {'friends': resultTwo._id}},
        {safe: true}, function(err, result){
          if (err){
            console.log(err);
            next(err);
          }
          User.findOneAndUpdate(
            {id: friendid},
            {$pull: {'friends': resultOne._id}},
            {safe: true}, function(err, result){
              if (err){
                console.log(err);
                next(err);
              }
              res.status(200).json({'message': 'Friend succesfully deleted'});
            })
        })
    })
  })
}

module.exports.addMarker = function(req, res, next) {
  var fbid = req.params.fbid;
  var people = req.body.people;
  var coords = req.body.location;
  var markerType = req.body.markerType;

  var marker = new Marker();

  // Find the owner by fb-id

  User.findOne({id: fbid}, function(error, result) {
    if (error){
      next(error);
    }
    console.log("Fb: ", fbid);
    console.log("Mongo: ", result._id);

    // Loop over the people, find the ObjectId for the person and add that to the shared array of the marker

    for (var i = 0; i < people.length; i++){
      console.log('Shared with: ', people[i])
      User.findOne({id: people[i]}, function(error, result) {
        if (error){
          next(error);
        }
        console.log('Found user: ', result._id);
        marker.shared.push(result._id)
      })
    }


    // Set the coordinates
    var coordsArray = [];
    coordsArray.push(coords.lat);
    coordsArray.push(coords.lng);

    marker.location = coordsArray;

    // Set the type of the marker
    marker.type = markerType;

    // Set the owner of the marker
    marker.owner = result._id;



    marker.save(function(err) {
      console.log('Trying to persist marker to MongoDB')
      if(err) {
        console.log(err);
        next(err);
      } else {
        console.log("Marker added");
        res.status(201).json({'message': 'Marker was succesfully created'});
      }
    })
  })
}

module.exports.getMarkers = function(req, res, next) {
  var id = req.params.fbid;

  User
  .findOne({ id: id })
  .populate({
    path: 'markers',
    model: 'Marker',
    populate: [{
      path: 'owner',
      model: 'User'
    }, {path: 'shared', model: 'User'}]
  })
  .exec(function (err, user) {
    if(err) {
      console.log(err);
    }
    res.status(200).json(user.markers);
  });
}

module.exports.deleteMarker = function(req, res, next) {
  var id = req.params.markerid;
  var fbid  req.params.fbid;

  var mongoId = new mongoose.Schema.Types.ObjectId(id);

  Marker.findOne({_id: mongoId}, function(err, result){
    if (err){
      next(err);
    }
    User.findOne({id: fbid}, function(err, user){
      if (err){
        next(err);
      }
      if (user._id == result.owner){
        Marker.remove({_id: mongoId}, function(err, result){
          if (err){
            next(err);
          }
          res.status(200).json({message: "Marker correctly deleted"});
        })
      }
      else {
        // Just pull the marker id from the list of markers in the user

        User.update({'_id': user._id}, { $pull: { "markers" : { _id: mongoId } } }, false, true, function(err, update){
          if (err){
            next(err);
          }
          res.status(200).json({message: "Marker correctly deleted from the user"});
        });


      }
    })
  })


}
