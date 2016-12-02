var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');
var ctrlReq = require('./request');
var ctrlUser = require('./user');

router.post('/register', ctrlAuth.register);
router.post('/addrequest', ctrlReq.send);
router.post('/acceptrequest', ctrlReq.accept);
router.post('/declinerequest', ctrlReq.decline);

router.post('/user/sent', ctrlUser.getSent);
router.post('/user/received', ctrlUser.getReceived);
router.post('/user/friends', ctrlUser.getFriends);

module.exports = router;
