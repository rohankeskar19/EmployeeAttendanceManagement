const Router = require("express").Router();
const pool = require("../helpers/mysql");
const validator = require("../validators/employee");
const authentication = require("../helpers/authentication");

// Route: /api/employee/attendance
// Access: private
// Method: POST
// Params: from_date,to_date
Router.get("/attendance", authentication.isAuthenticated, (req, res) => {
  const { from_date, to_date } = req.query;
  console.log(req.query);
  const errors = validator.validateAttendanceInput(from_date, to_date);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    pool.getConnection((err, con) => {
      if (!err) {
        const sql = `SELECT * FROM attendance where EmpCode = '${req.user.EmpCode}' AND AttendanceDate >= '${from_date}' AND AttendanceDate <= '${to_date}'`;

        con.query(sql, (err, result) => {
          if (!err) {
            const response = [];

            for (var i = 0; i < result.length; i++) {
              var attendance = {};
              const date = new Date(result[i].AttendanceDate);
              date.setDate(date.getDate());
              result[i].AttendanceDate = date;
              Object.assign(attendance, result[i]);
              response.push(attendance);
            }
            return res.json(response);
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process request try again" });
          }
        });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to process request try again" });
      }
      con.release();
    });
  }
});

module.exports = Router;
