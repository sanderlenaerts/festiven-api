// Allows for schema creation in an object oriented approach
var mongoose = require('mongoose');
// To allow superclasses
var extend = require('mongoose-schema-extend');

var markerSchema = new mongoose.Schema({
  location: {
    type: [Number],   // [<longitude>, <latitude>]
    index: '2d',      // Create the geospatial index
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: ['Car', 'Tent'],
  },
  shared: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }]

});

// Export the created models so they're accessible by name through mongoose
mongoose.model('Marker', markerSchema)
