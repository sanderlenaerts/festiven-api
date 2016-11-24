var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://188.166.58.138:27017/festiven', function(){
  console.log('MongoDB connected');
});


require('./models/marker');
require('./models/setting');
require('./models/user');
