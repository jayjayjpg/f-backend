const fs = require('fs');

exports.jsonToJsonApi = function(jsonObj, typeName){
   //console.log("jsontoJsonApi check object type: " + JSON.stringify(jsonObj) + " is an " + jsonObj.constructor);
  //console.log("successful import jsonformatter - delete ol jsonformat file");
    function dasherize(string){
      return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
   if (jsonObj.constructor === Array){
      console.log("input is an array");
      var dashedAttr;
      var resArr = jsonObj.map(function(mut, i){
      mut.attributes = {};
      for (var prop in mut){
        if (mut[prop] !== mut.attributes){
            dashedAttr = dasherize(prop);
            mut.attributes[dashedAttr] = mut[prop];
            delete mut[prop];
          }
        }
        //mut.attributes.row_label = mut.attributes.mut;
        //delete  mut.attributes.mut;
        mut.type = typeName;
        mut.id =  mut.attributes._id;
        return mut;
      });
      var jsonApiDataObj = {
        "data": resArr
      };
     return jsonApiDataObj;
   }
   else if (jsonObj.constructor === Object){
     console.log("input is an object");
   }
};