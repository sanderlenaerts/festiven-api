var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
//Facebook register
module.exports.register = function(req, res, next){

  var user = new User();

  user.name = req.body.name;
  user.id = req.body.id;

  user.save(function(err){
    if (err){
      next(err);
    }
    else {
      res.status(201).json({'message': 'Account was succesfully created'});
    }
  })

}
