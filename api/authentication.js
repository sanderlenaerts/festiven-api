var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
//Facebook register
module.exports.register = function(req, res, next){
  console.log('Registering')

  var user = new User();

  console.log('User object created')

  user.name = req.body.name;
  user.id = req.body.id;

  console.log(req.body.name);
  console.log(req.body.id);

  console.log('Registering')

  user.save(function(err){
    if (err){
      console.log(err);
      next(err);
    }
    else {

      res.status(201).json({'message': 'Account was succesfully created'});
    }
  })

}
