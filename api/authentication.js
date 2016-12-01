var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
//Facebook register
module.exports.register = function(req, res, next){
  console.log('Creating user object');
  var user = new User();

  console.log(req.body.name);
  console.log(req.body.id);

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

      console.log('Saving new user');
      user.save(function(err){
        console.log('Trying to persist to mongodb')
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
