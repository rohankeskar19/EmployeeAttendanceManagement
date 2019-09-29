const xlsx = require("xlsx");
const mysql = require("mysql");

const fileName = process.argv[2];

const wb = xlsx.readFile(fileName, { cellDates: true });

const employeeData = {};
const dates = [];

function pushIntoArr(cell, array, empCode) {
  var valueToPush = "";
  if (cell == undefined) {
    valueToPush = "NA";
  } else {
    valueToPush = cell.w;
  }

  switch (array) {
    case 1:
      employeeData[empCode].InTime.push(valueToPush);
      break;
    case 2:
      employeeData[empCode].OutTime.push(valueToPush);
      break;
    case 3:
      employeeData[empCode].TotalTime.push(valueToPush);
      break;
    default:
      break;
  }
}

for (sheet in wb.Sheets) {
  const ws = wb.Sheets[sheet];

  var empCode = "";
  var empName = "";
  var processSheet = function(sheet) {
    var rowNum;
    var colNum;
    const columnsToCheck = [];

    var range = xlsx.utils.decode_range(sheet["!ref"]);

    if (dates.length == 0) {
      for (rowNum = range.s.r; rowNum <= 10; rowNum++) {
        for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const currentCell =
            sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
          if (currentCell !== undefined) {
            const date = currentCell.w;

            if (date.includes("To")) {
              const duration = date.split("To");
              const from = new Date(duration[0].trim());
              from.setDate(from.getDate() + 1);
              const to = new Date(duration[1].trim());
              to.setDate(to.getDate() + 1);
              for (var i = from; i <= to; i.setDate(from.getDate() + 1)) {
                dates.push(
                  new Date(i)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                );
              }
            }
          }
        }
      }
    }

    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const currentRow = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];

      if (currentRow != undefined) {
        if (currentRow.v == "Days") {
          for (var j = range.s.c + 2; j <= range.e.c; j++) {
            const columnCell =
              sheet[xlsx.utils.encode_cell({ r: rowNum, c: j })];
            if (columnCell != undefined) {
              columnsToCheck.push(j);
            }
          }
        }

        if (currentRow.v == "Emp. Code :") {
          empCode = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 3 })].w;
          for (var i = 3; i <= range.e.c; i++) {
            const currentCell =
              sheet[xlsx.utils.encode_cell({ r: rowNum, c: i })];
            if (currentCell != undefined) {
              if (currentCell.w.includes("Emp.  Name :")) {
                for (var j = i; j <= range.e.c; j++) {
                  var nameCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: j })];
                  if (nameCell != undefined) {
                    empName = nameCell.w;
                  }
                }
              }
            }
          }

          if (employeeData[empCode] == undefined) {
            const employee = {
              EmpCode: empCode,
              EmpName: empName.replace("  ", " "),
              Status: [],
              InTime: [],
              OutTime: [],
              TotalTime: []
            };
            employeeData[empCode] = employee;
          }
        }
      }

      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];

        if (columnsToCheck.includes(colNum)) {
          if (nextCell == undefined) {
            if (currentRow != undefined) {
              if (currentRow.v == "Status") {
                if (colNum != 0 && colNum != 1) {
                  employeeData[empCode].Status.push("NA");
                  rowNum++;
                  const inTimeCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
                  pushIntoArr(inTimeCell, 1, empCode);
                  rowNum++;
                  const outTimeCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
                  pushIntoArr(outTimeCell, 2, empCode);
                  rowNum++;
                  const totalTimeCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
                  pushIntoArr(totalTimeCell, 3, empCode);
                  rowNum -= 3;
                }
              }
            }
          } else {
            if (currentRow != undefined) {
              if (currentRow.v == "Status") {
                if (colNum != 0 && colNum != 1) {
                  employeeData[empCode].Status.push(nextCell.w);

                  rowNum++;

                  const inTimeCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
                  pushIntoArr(inTimeCell, 1, empCode);
                  rowNum++;
                  const outTimeCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
                  pushIntoArr(outTimeCell, 2, empCode);
                  rowNum++;
                  const totalTimeCell =
                    sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
                  pushIntoArr(totalTimeCell, 3, empCode);
                  rowNum -= 3;
                }
              }
            }
          }
        }
      }
    }
  };
  console.log("Processing sheet");
  processSheet(ws);
  console.log("Processed data from sheet");
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "danfoss"
  });

  con.connect(err => {
    if (err) console.log(err);
    else {
      console.log("Connected to databse");
      console.log("Inserting data into database");
      for (i in employeeData) {
        const employee = employeeData[i];

        const EmpCode = i;
        const Status = employee.Status;
        const InTime = employee.InTime;
        const OutTime = employee.OutTime;
        const TotalTime = employee.TotalTime;

        for (var j = 0; j < dates.length; j++) {
          var sql = `INSERT INTO attendance values ('${EmpCode}','${Status[j]}','${InTime[j]}','${OutTime[j]}','${TotalTime[j]}','${dates[j]}')`;
          con.query(sql, (err, result) => {
            if (err) console.log(err);
          });
        }
      }

      con.end();
      console.log("Done");
    }
  });
}
