const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

      
/* Object Schema from /server/createjsonfromexcel.js
  obj.entityId = <String> ("mutMatrix");
  obj.patientId = <String>;
  obj.rsId = <String>;
  obj.score = <Number>(0...1);
*/

const InteractionSchema = new Schema({  
  actor: {
    type: String,
    lowercase: true,
    required: true
  },
  actorId: {
    type: String,
    lowercase: true,
    required: true
  },
  target: {
    type: String,
    lowercase: true,
    required: true
  },
  targetSnp: {
    type: String,
    lowercase: true,
    required: true
  }
});


module.exports = mongoose.model('Interaction', InteractionSchema);
