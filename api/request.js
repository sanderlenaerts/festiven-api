var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports.send = function(req, res, next){
  console.log('SEND REQUEST');

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

module.exports.getSent = function(req, res, next){
  console.log('getSent');
  var id = req.body.id;
  console.log(id);

  User
  .findOne({ id: id })
  .populate('users')
  .exec(function (err, user) {
    if (err) {
      console.log(err);
    }
    res.status(200).json(user.sent);


  });
}
