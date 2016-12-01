const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

      
/* Object Schema from /server/createjsonfromexcel.js
  obj.entityId = <String> ("mutMatrix");
  obj.patientId = <String>;
  obj.rsId = <String>;
  obj.score = <Number>(0...1);
*/

const SnpSchema = new Schema({  
  rsId: {
    type: String,
    lowercase: true,
    required: true
  },
  genomicRegion: {
    type: String,
    lowercase: true,
    required: true
  }
});


module.exports = mongoose.model('Snp', SnpSchema);
