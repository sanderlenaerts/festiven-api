var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
//Facebook register
module.exports.register = function(req, res, next){
  var user = new User();

  user.name = req.body.name;
  user.id = req.body.id;


  // Check if user already exists
  User.findOne({id: user.id}, function(err, result){
    if (err){
      console.log(err);
    }
    else if (result){
      console.log("User already created");
      // User already exists, so we do nothing
      res.status(200).json({'message': 'Account was already there'});
    }
    else {
      // Create account


      user.save(function(err){
        if (err){
          console.log(err);
          next(err);
        }
        else {
          console.log("User registered");
          res.status(201).json({'message': 'Account was succesfully created'});
        }
      })
    }
  })



}
