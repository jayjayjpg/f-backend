const fs = require('fs');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

exports.mEvents = myEmitter;

exports.create = function(sourceFile){
  const input = require('../' + sourceFile);
  console.log("starting final excel formatting....");
  var resArr = input.map(function(mut, i){
    mut.attributes = {};
    for (var prop in mut){
      if (mut[prop] !== mut.attributes){
            mut.attributes[prop] = mut[prop];
            delete mut[prop];
      }
    }
    //mut.attributes.row_label = mut.attributes.mut;
    //delete  mut.attributes.mut;
    mut.type = "mutation";
    mut.id =  i;
    return mut;
  });

  var smArray = resArr;
  console.log("new mut object: " + JSON.stringify(resArr[0]));
  var resultJSON = JSON.stringify({
    data: smArray
  });
  fs.writeFile("./server/data/excelmod.json", resultJSON, function(err){
    if (err) {
      return console.log(err);
    }

    myEmitter.emit('hola');
    console.log("File successfully saved: " + "./server/data/excelmod.json");
  });

}
