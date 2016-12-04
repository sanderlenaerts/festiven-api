var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.getSent = function(req, res, next) {
  console.log('getSent');
  var id = req.body.id;
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
  var id = req.body.id;
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
  var id = req.body.id;

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
