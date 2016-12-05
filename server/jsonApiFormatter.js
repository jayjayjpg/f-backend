const fs = require('fs');

exports.jsonToJsonApi = function(allData, typeName){

    function dasherize(string){
      return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
   if (allData.constructor === Array){
      var dashedAttr;
      var resArr = allData.map(function(dataObj, i){
      dataObj.attributes = {};
      for (var prop in dataObj){
        if (dataObj[prop] !== dataObj.attributes){
            dashedAttr = dasherize(prop);
            dataObj.attributes[dashedAttr] = dataObj[prop];
            delete dataObj[prop];
          }
        }
        //mut.attributes.row_label = mut.attributes.mut;
        //delete  mut.attributes.mut;
        dataObj.type = typeName;
        dataObj.id =  dataObj.attributes.id;
        return dataObj;
      });
      var jsonApiDataObj = {
        "data": resArr
      };
     return jsonApiDataObj;
   }
   else if (allData.constructor === Object){
     console.log("Error in server/jsonApiFormatter: Check if data input called in router is an acutal array.");
   }
};