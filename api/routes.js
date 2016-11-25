var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');
var ctrlReq = require('./request');

// Example
router.post('/register', ctrlAuth.register);
router.post('/addrequest', ctrlReq.send);
router.post('/sent-requests', ctrlReq.getSent);

module.exports = router;
