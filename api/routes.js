var express = require('express');
var router = express.Router();

var ctrlAuth = require('./authentication');


// Example
router.post('/register', ctrlAuth.register);

module.exports = router;
