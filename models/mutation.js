const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

      
/* Object Schema from /server/createjsonfromexcel.js
  obj.entityId = <String> ("mutMatrix");
  obj.patientId = <String>;
  obj.rsId = <String>;
  obj.score = <Number>(0...1);
*/

const MutationSchema = new Schema({  
  entityId: {
    type: String,
    lowercase: true,
    required: true
  },
  patientId: {
    type: String,
    lowercase: true,
    required: true
  },
  rsId: {
    type: String,
    lowercase: true,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});


module.exports = mongoose.model('Mutation', MutationSchema);
