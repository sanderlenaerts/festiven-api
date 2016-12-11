var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');
var ctrlReq = require('./request');
var ctrlUser = require('./user');

router.post('/users', ctrlAuth.register);

router.post('/users/:fbid/sent', ctrlReq.send);
router.post('/users/:fbid/friends', ctrlReq.accept);
router.delete('/users/:fbid/received/:friendid', ctrlReq.decline);
router.delete('/users/:fbid/sent/:friendid/', ctrlReq.cancel);

// Turn into get with parameter in URI
router.get('/users/:fbid/sent', ctrlUser.getSent);
router.get('/users/:fbid/received', ctrlUser.getReceived);
router.get('/users/:fbid/friends', ctrlUser.getFriends);
router.delete('/users/:fbid/friends/:friendid', ctrlUser.deleteFriend);

// Markers
router.post('/users/:fbid/markers', ctrlUser.addMarker);
router.get('/users/:fbid/markers', ctrlUser.getMarkers);

module.exports = router;





// router.post('/addrequest', ctrlReq.send);
// router.post('/acceptrequest', ctrlReq.accept);
// router.post('/declinerequest', ctrlReq.decline);
//
// Turn into get with parameter in URI
// router.post('/user/sent', ctrlUser.getSent);
// router.post('/user/received', ctrlUser.getReceived);
// router.post('/user/friends', ctrlUser.getFriends);
