var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');
var ctrlReq = require('./request');
var ctrlUser = require('./user');

// Example
router.post('/register', ctrlAuth.register);
router.post('/addrequest', ctrlReq.send);


router.post('/user/sent', ctrlUser.getSent);
router.post('/user/friends', ctrlUser.getFriends);

module.exports = router;
