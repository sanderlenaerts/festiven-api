var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');




var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var options = {};
options.socket = socket;
options.io = io;

io.sockets.on('connection', require('./socket')(options));

var PORT = process.env.PORT || 8080;

//require('./socket');
require('./db');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: true
}));

app.options('*', cors());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes for the API are defined
app.use('/api', require('./api/routes'));


app.use(function(err, req, res, next) {
  // Only handles `next(err)` calls
  res.status(err.status || 500);
  res.send({message: err.message});
});


http.listen(PORT, function(){
  console.log('Server listening on port ' + PORT )
});
