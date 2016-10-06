const fs = require('fs');
const Excel = require('exceljs');
const fileInput = 'server/interactions2.xlsx'; // testing here if update of excel files reflects in data endpoint

exports.create = function (callback){
  var resArray = [];
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(fileInput)
    .then(function(){
      var worksheet = workbook.getWorksheet(1);
      var col = worksheet.getColumn(1);
      var colScore = worksheet.getColumn(2);
      //console.log("cell 1 val: " + row.getCell(1).value);
      for (var i = 0; i < 58; i += 1){
      var labelVal = worksheet.getRow(1).values[i+2];
      worksheet.eachRow(function(row, rowNumber){
        
        if (rowNumber > 1){
          var obj = {};
          obj.row = rowNumber - 2;
          obj.col = i;
          obj.label = labelVal;
          obj.row_label = row.getCell(1).value;
          obj.score = row.getCell(i+2).value;
          resArray.push(obj);
          console.log('Row ' + rowNumber + " " + JSON.stringify(obj));
        }

      });
      }
      var resultJSON = JSON.stringify(resArray);
      var resFilePath = "server/data/excel.json";
      fs.writeFile(resFilePath, resultJSON, function(err){
        if (err) {
          return console.log(err);
        }
        callback(resFilePath);
        console.log("File successfully saved: " + resFilePath);
      });
    });
}