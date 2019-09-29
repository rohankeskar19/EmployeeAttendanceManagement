const Router = require("express").Router();

const pool = require("../helpers/mysql");
const validator = require("../validators/employee");
const authentication = require("../helpers/authentication");

// Route: /api/admin/attendance
// Access: Admin
// Method: GET
// Params: from_date,to_date
Router.get("/attendance", authentication.isAdmin, (req, res) => {
  const { from_date, to_date } = req.params;

  const errors = validator.validateAttendanceInput(from_date, to_date);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    pool.getConnection((err, con) => {
      if (!err) {
        const sql = `SELECT * FROM attendance WHERE AttendanceDate >= '${from_date}' AND AttendanceDate <= '${to_date}' SORT BY EmpCode`;

        con.query(sql, (err, result) => {
          if (!err) {
            const response = [];
            for (var i = 0; i < result.length; i++) {
              const date = new Date(result[i].AttendanceDate);

              date.setDate(date.getDate() + 1);

              result[i].AttendanceDate = date;

              response.push(result[i]);
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

// Route: /api/admin/employees
// Access: Admin
// Method: GET
// Params: employee_code

// Route: /api/admin/add-admin
// Access: Admin
// Method: PUT
// Params: employee_code

module.exports = Router;
