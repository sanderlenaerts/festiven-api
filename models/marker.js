// Allows for schema creation in an object oriented approach
var mongoose = require('mongoose');

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
    enum: ['car', 'tent', 'marker'],
  },
  shared: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }]

});

markerSchema.pre('remove', function(next){
  console.log('Pre remove marker with id: ', this._id);
  this.shared.forEach(function(user_id){
  console.log('The marker was shared with:', user_id);
    this.model('User').update({_id: user_id},
      {$pull: {'markers': this._id}},
      {safe: true}, function(err, result){
        if (err){
          next(err);
        }
        console.log('Removed marker from all the shared users');
      })
  })
})

// Before we save a marker, add it to the
markerSchema.post('save', function(){

  // We loop over all the people in the shared array, who are supposed to receive the marker and update their set of markers
  console.log('Pre marker save');
  for (var i = 0; i < this.shared.length; i++){
    console.log('Save marker id to: ', this.shared[i]);
    this.model('User').update({_id: this.shared[i]},{ $addToSet: {
      markers: this._id} }, {multi: true}, function(err, result){

      });
  }

  this.model('User').update({_id: this.owner},{ $addToSet: {
    markers: this._id} }, {multi: true}, function(err, result){

    });

  console.log('Finished pre marker save');

});



// Export the created models so they're accessible by name through Mongoose
mongoose.model('Marker', markerSchema)
