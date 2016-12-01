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
  var fromId = null;
  var toId = null;

  User.findOne({id: from}, function(err, resultOne){
    if (err){
      console.log(err);
    }
    fromId = resultOne._id;
    User.findOne({id: id}, function(err, resultTwo){
      if (err){
        console.log(err);
      }
      toId = resultTwo._id;

      User.update(
        {_id: fromId},
        {$pull: { 'received': {id: to}}},
        {safe: true},
        function(err, resultThree){
          if (err){
            console.log(err);
          }
          User.update(
            {_id: toId},
            {$pull: { 'sent': {id: from}}},
            {safe: true},
            function(err, resultFour){
              if (err){
                console.log(err);
              }
              User.update(
                {_id: toId},
                { $addToSet: { friends: {_id: fromId}}},
                {safe: true},
                function(err, resultFour){
                  if (err){
                    console.log(err);
                  }
                  User.update(
                    {_id: fromId},
                    {$addToSet: { friends: {_id: toId}}},
                    {safe: true},
                    function(err, resultFour){
                      if (err){
                        console.log(err);
                      }
                      res.status(200).json({'message': 'Friend added'});
                    }
                  )
                }
              );
            }
          )
        })
    })
  })



  // Put each other in friends

  // Remove from sent and received


}

module.exports.decline = function(req, res, next){
  var from = req.body.origin;
  var to = req.body.to;

  // Remove from sent and received
}
