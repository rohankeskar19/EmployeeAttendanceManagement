const Router = require("express").Router();

const pool = require("../helpers/mysql");
const validator = require("../validators/employee");
const adminValidator = require("../validators/admin");
const authentication = require("../helpers/authentication");

// Route: /api/admin/fetch-attendance
// Access: Admin
// Method: GET
// Params: from_date,to_date,employee_code
Router.get("/fetch-attendance", authentication.isAdmin, (req, res) => {
  const { from_date, to_date, employee_code } = req.query;

  const errors = validator.validateAttendanceInput(from_date, to_date);

  if (employee_code == undefined || employee_code == "") {
    errors.error = "Please specify employee code to continue";
  } else {
    if (employee_code.trim() == "") {
      errors.error = "Please specify employee code to continue";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    pool.getConnection((err, con) => {
      if (!err) {
        const sql = `SELECT * FROM attendance WHERE AttendanceDate >= '${from_date}' AND AttendanceDate <= '${to_date}' AND EmpCode = '${employee_code}'`;

        con.query(sql, (err, result) => {
          con.release();
          if (!err) {
            const response = [];
            for (var i = 0; i < result.length; i++) {
              const date = new Date(result[i].AttendanceDate);

              date.setDate(date.getDate());

              result[i].AttendanceDate = date;

              response.push(result[i]);
            }
            console.log(response);
            return res.json(response);
          } else {
            console.log(err);
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
    });
  }
});

// Route: /api/admin/search-employees
// Access: Admin
// Method: GET
// Params: employee_code
Router.get("/search-employees", authentication.isAdmin, (req, res) => {
  const { employee_code } = req.query;
  console.log(employee_code);
  const errors = adminValidator.validateEmployeeCode(employee_code);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    if (req.user.EmpCode == employee_code) {
      return res.json({});
    } else {
      pool.getConnection((err, con) => {
        if (!err) {
          const sql = `SELECT EmpCode,EmpName,Access FROM employees WHERE EmpCode = '${employee_code}'`;

          con.query(sql, (err, result) => {
            con.release();
            if (!err) {
              if (result.length > 0) {
                var employeeData = {};
                Object.assign(employeeData, result[0]);

                console.log("response sent search employee");
                return res.json(employeeData);
              } else {
                return res.status(404).json({ error: "User does not exists" });
              }
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
      });
    }
  }
});

// Route: /api/admin/add-admin
// Access: Admin
// Method: PUT
// Params: employee_code
Router.put("/add-admin", authentication.isAdmin, (req, res) => {
  const { employee_code } = req.query;

  const errors = adminValidator.validateEmployeeCode(employee_code);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    pool.getConnection((err, con) => {
      con.release();
      if (!err) {
        const sql = `UPDATE employees SET Access = 'admin' WHERE EmpCode = '${employee_code}'`;

        con.query(sql, (err, result) => {
          if (!err) {
            return res.json({ message: "Success" });
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process reques try agian" });
          }
        });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to process request try again" });
      }
    });
  }
});

// Route: /api/admin/fetch-employees
// Access: Admin
// Method: GET
// Params: none
Router.get("/fetch-employees", authentication.isAdmin, (req, res) => {
  pool.getConnection((err, con) => {
    if (!err) {
      const sql = `SELECT EmpCode,EmpName,Access FROM employees`;

      con.query(sql, (err, result) => {
        con.release();
        if (!err) {
          if (result.length > 0) {
            const employees = [];
            for (var i = 0; i < result.length; i++) {
              var employeeData = {};
              Object.assign(employeeData, result[i]);

              employees.push(employeeData);
            }

            return res.json(employees);
          } else {
            return res.status(404).json({ error: "User does not exists" });
          }
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
  });
});

module.exports = Router;
