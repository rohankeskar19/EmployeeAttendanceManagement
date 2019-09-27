const xlsx = require("xlsx");

const fileName = process.argv[2];

const wb = xlsx.readFile(fileName, { cellDates: true });

const employeeData = {};

for(sheet in wb.Sheets){

  
  
  
 
  
  
}


const ws = wb.Sheets["BasicWorkDurationReport"];

  var sheet2arr = function(sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    
    var range = xlsx.utils.decode_range(sheet["!ref"]);
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const currentRow = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
  
      row = [];
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
        var forwardCell = sheet[xlsx.utils.encode_cell({r: rowNum, c: colNum + 1})]
        var prevCell = sheet[xlsx.utils.encode_cell({r: rowNum, c: colNum - 1})]
        
        if (nextCell === undefined ) {
          //console.log(nextCell,prevCell);
          if (typeof currentRow !== "undefined") {
            if (
              currentRow.v == "Status" ||
              currentRow.v == "InTime" ||
              currentRow.v == "OutTime"
            ) {
              //console.log(prevCell);
              if(currentRow.v == "Status"){
                if(prevCell != undefined){

                }
                else{
                  row.push("NA");
                }
              }
              else{
                if(nextCell == undefined && prevCell == undefined)
                row.push("NA")
              }
              
            }
          }
        } else {
          
          row.push(nextCell.w);
        }
      }
      if (row.length == 0) {
      } else result.push(row);
    }
    return result;
  };
  

  
  const arr = sheet2arr(ws);
  
  const dates = [];
  
  const dateDuration = arr[1][0].split("To");
  const from = new Date(dateDuration[0]);
  const to = new Date(dateDuration[1]);
  
  from.setDate(from.getDate() + 1);
  to.setDate(to.getDate() + 1);
  
  for (var i = from; i <= to; i.setDate(i.getDate() + 1)) {
    dates.push(new Date(i));
  }
  
  
  
  
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][0] == "Emp. Code :") {
      const employee = {
        EmpCode: arr[i][1],
        EmpName: arr[i][3].replace("  ", " "),
        Status: [],
        InTime: [],
        OutTime: [],
        Dates: dates
      };
      if (employeeData[arr[i][1]] === undefined)
        employeeData[arr[i][1]] = employee;
    } else if (arr[i][0] == "Status") {
      const empCode = arr[i - 1][1];
  
      for (var j = 0; j < dates.length; j++) {
        
        employeeData[empCode].Status.push(arr[i][j + 1]);
      }
    } else if (arr[i][0] == "InTime") {
      const empCode = arr[i - 2][1];
  
      for (var j = 0; j < dates.length; j++) {
        employeeData[empCode].InTime.push(arr[i][j + 1]);
      }
    } else if (arr[i][0] == "OutTime") {
      const empCode = arr[i - 3][1];
  
      for (var j = 0; j < dates.length; j++) {
        employeeData[empCode].OutTime.push(arr[i][j + 1]);
      }
    }
  }
  

 // console.log(arr);
 console.log(employeeData["E0428"]);