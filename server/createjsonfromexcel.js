const fs = require('fs');
const Excel = require('exceljs');
const fileInputEntities = './server/interactions2.xlsx'; // testing here if update of excel files reflects in data endpoint
const fileInputSnps = './server/SNPannotation.xlsx';
const EventEmitter = require('events');

exports.create = function (processCallback){
  console.log("Step 1: try to create json from raw excel");
  var workbook = new Excel.Workbook();
  var emitter = new EventEmitter();
  
  function getDataFromWorkbook(dataFile, eventName, dataCallback){
    var resArray = [];
    workbook.xlsx.readFile(dataFile)
    .then(function(){
        dataCallback(resArray, eventName);
        console.log("read from " + dataFile + ": ");
        // return resArray; // a promise is a closed box! :-) http://stackoverflow.com/questions/22536385/setting-a-variable-to-get-return-from-call-back-function-using-promise
    });
  }

  getDataFromWorkbook(fileInputSnps, 'snpsReady', getSnps);
  getDataFromWorkbook(fileInputEntities, 'entitiesReady', getEntities);
  emitter.on('entitiesReady', function(){
   //  console.log("resulting array: " + JSON.stringify(myEntityData));
    console.log("processed entities.");
  });
  emitter.on('snpsReady', function(){
   //  console.log("resulting array: " + JSON.stringify(myEntityData));
    console.log("processed Snps.");
  });

      // }); 
  //}

  function getEntities(dataArr, evName){
    var worksheet = workbook.getWorksheet(1);
    var col = worksheet.getColumn(1);
    var colScore = worksheet.getColumn(2);
    var resultFilePath = "./server/data/excel.json";

    //console.log("cell 1 val: " + row.getCell(1).value);
    for (var i = 0; i < 58; i += 1){
      var labelVal = worksheet.getRow(1).values[i+2];
      worksheet.eachRow(function(row, rowNumber){
        
        if (rowNumber > 1){
          var obj = {};
          obj.entityId = "mutMatrix";
          obj.patientId = labelVal;
          obj.rsId = row.getCell(1).value;
          obj.score = row.getCell(i+2).value;
          dataArr.push(obj);
          // console.log('Row ' + rowNumber + " " + JSON.stringify(obj));
        }
      });   
    }
    emitter.emit(evName);
    saveDataToJSON(dataArr, resultFilePath, evName);
  }
  
  function getSnps(dataArr, evName){
    var worksheet = workbook.getWorksheet(1);
    var colSnp = worksheet.getColumn(1);
    var colFunc = worksheet.getColumn(2);
    var resultFilePath = "./server/data/snps.json";
    var row;
    var obj = {};

    //console.log("cell 1 val: " + row.getCell(1).value);
    for (var i = 1; i < 197; i += 1){
      row = worksheet.getRow(i);
      obj.rsId = row.getCell(1).value;
      obj.genomicRegion = row.getCell(2).value;
      dataArr.push(obj);
     // console.log('Row ' + i + " " + JSON.stringify(obj)); 
    }
    emitter.emit(evName);
    saveDataToJSON(dataArr, resultFilePath, evName);
  }
  
  function saveDataToJSON(inputArr, path, processName){
    var resultJSON = JSON.stringify(inputArr);
    var resFilePath = path;
    fs.writeFile(resFilePath, resultJSON, function(err){
      if (err) {
        return console.log(err);
      }
      console.log(processName + "JSON file successfully saved: " + resFilePath);
      // processCallback(resFilePath);
    }); 
  }
}