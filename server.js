var express = require('express');
var bodyParser = require('body-parser');


require('./db');
var app = express();

var PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// Routes for the API are defined
app.use('/api', require('./api/routes'));


app.use(function(err, req, res, next) {
  // Only handles `next(err)` calls
  res.status(err.status || 500);
  res.send({message: err.message});
});


app.listen(PORT, function(){
  console.log('Server listening on port ' + PORT )
});
