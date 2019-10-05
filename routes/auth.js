const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const pool = require("../helpers/mysql");

const config = require("../config/keys");
const validator = require("../validators/auth");
const authentication = require("../helpers/authentication");

// Route: /api/auth/register
// Access: Admin
// Method: POST
// Params: employee_code,employee_name
Router.post("/register", authentication.isAdmin, (req, res) => {
  const { employee_code, employee_name, password, access } = req.body;
  const errors = validator.validateRegisterInput(
    employee_code,
    employee_name,
    password,
    access
  );

  if (Object.keys(errors).length > 0) {
    return res.status(422).json(errors);
  } else {
    bcrypt.hash(password, config.saltRounds, (err, hash) => {
      if (!err) {
        pool.getConnection((err, con) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Failed to process request try again" });
          } else {
            var checkUserExists = `SELECT * FROM employees WHERE EmpCode = '${employee_code}'`;

            con.query(checkUserExists, (err, result) => {
              if (!err) {
                if (result.length > 0) {
                  return res.status(409).json({ error: "User already exists" });
                } else {
                  var sql = "";
                  if (access != undefined)
                    sql = `INSERT INTO employees values ('${employee_code.trim()}','${employee_name.trim()}','${hash}','${access}')`;
                  else
                    sql = `INSERT INTO employees values ('${employee_code.trim()}','${employee_name.trim()}','${hash}','regular')`;

                  con.query(sql, (err, result) => {
                    if (!err) {
                      return res.json({
                        message: "Succesfully registered employee"
                      });
                    } else {
                      console.log(err);

                      return res.status(500).json({
                        error: "Failed to process request try again"
                      });
                    }
                  });
                }
              } else {
                return res
                  .status(500)
                  .json({ error: "Failed to process request try again" });
              }
              con.release();
            });
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

// Route: /api/auth/login
// Access: Public
// Method: POST
// Params: employee_code,password
Router.post("/login", (req, res) => {
  const { employee_code, password } = req.body;
  console.log(req.body);
  const errors = validator.validateLoginInput(employee_code, password);

  if (Object.keys(errors).length > 0) {
    return res.status(422).json(errors);
  } else {
    pool.getConnection((err, con) => {
      if (!err) {
        const sql = `SELECT * FROM employees where EmpCode = '${employee_code}'`;

        con.query(sql, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to process request try again" });
          } else {
            if (result.length == 0) {
              return res.status(404).json({ error: "User does not exists" });
            } else {
              var employeeData = {};
              Object.assign(employeeData, result[0]);

              bcrypt.compare(password, employeeData.Password, (err, match) => {
                if (!err) {
                  if (match) {
                    delete employeeData["Password"];
                    console.log(employeeData);
                    jsonwebtoken.sign(
                      employeeData,
                      config.secret,
                      {
                        expiresIn: config.tokenLifeTime
                      },
                      (err, token) => {
                        if (!err) {
                          return res.json({
                            auth: true,
                            token: "Bearer " + token
                          });
                        } else {
                          console.log(err);
                          return res.status(500).json({
                            error: "Failed to process request try again"
                          });
                        }
                      }
                    );
                  } else {
                    return res
                      .status(401)
                      .json({ password: "Passwords do not match" });
                  }
                } else {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: "Failed to process request try again" });
                }
              });
            }
          }
          con.release();
        });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to process request try again" });
      }
    });
  }
});

// Route: /api/auth/change-password
// Access: Public
// Method: POST
// Params: employee_code,current_password,new_password
Router.post("/change-password", (req, res) => {
  const { employee_code, current_password, new_password } = req.body;

  const errors = validator.validateChangePasswordInput(
    employee_code,
    current_password,
    new_password
  );

  if (Object.keys(errors).length > 0) {
    return res.status(422).json(errors);
  } else {
    pool.getConnection((err, con) => {
      if (!err) {
        const sql = `SELECT * FROM employees WHERE EmpCode = '${employee_code}'`;

        con.query(sql, (err, result) => {
          if (!err) {
            if (result.length > 0) {
              var employeeData = {};
              Object.assign(employeeData, result[0]);

              bcrypt.compare(
                current_password,
                employeeData.Password,
                (err, match) => {
                  if (!err) {
                    if (match) {
                      bcrypt.hash(
                        new_password,
                        config.saltRounds,
                        (err, hash) => {
                          if (!err) {
                            const changePassword = `UPDATE employees SET Password = '${hash}' WHERE EmpCode = '${employee_code}'`;

                            con.query(changePassword, (err, result) => {
                              if (!err) {
                                return res.json({
                                  message: "Password updated"
                                });
                              } else {
                                return res.status(500).json({
                                  error: "Failed to process request try again"
                                });
                              }
                            });
                          } else {
                            return res.status(500).json({
                              error: "Failed to process request try again"
                            });
                          }
                        }
                      );
                    } else {
                      return res.status(401).json({
                        current_password: "Your current password is incorrect"
                      });
                    }
                  } else {
                    return res
                      .status(500)
                      .json({ error: "Failed to process request try again" });
                  }
                }
              );
            } else {
              return res
                .status(404)
                .json({ employee_code: "User does not exists" });
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
});

module.exports = Router;
