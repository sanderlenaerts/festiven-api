var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports.send = function(req, res, next){

  var from = req.body.origin;
  var to = req.body.to;

  //
  User.findOne({id: from}, function(err, result){
    console.log("Found from user");
    var fromUser = result;
    User.findOne({id: to}, function(err, result){
      console.log("Found to user");
      var toUser = result;

      User.update(
        {
          _id: fromUser._id
        },
        {$push: {sent: toUser._id}}, function(err){
          if (err){
            console.log(err);
          }
          console.log('Added to sent');
        }
      ).then(function(){
        User.update(
          {
            _id: toUser._id
          },
          {$push: {received: fromUser._id}}, function(err){
            if (err){
              console.log(err);
            }
            console.log('Added to received');
          }
        ) // End update
      }) // End then
    }) // End find
  }) // End find
}
