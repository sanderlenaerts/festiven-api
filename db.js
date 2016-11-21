var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://95.85.9.178:27017/festiven', function(){
  console.log('MongoDB connected');
});


require('./models/marker');
require('./models/setting');
require('./models/user');
