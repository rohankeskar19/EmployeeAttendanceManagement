const jsonwebtoken = require("jsonwebtoken");
const config = require("../config/keys");
const pool = require("../helpers/mysql");

const isAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "No authorization credentials sent" });
  } else {
    const token = req.headers.authorization.split(" ");
    jsonwebtoken.verify(token[1], config.secret, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to process request try again" });
      } else {
        req.user = decoded;
        return next();
      }
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "No authorization credentials sent" });
  } else {
    const token = req.headers.authorization.split(" ");
    jsonwebtoken.verify(token[1], config.secret, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to process request try again" });
      } else {
        pool.getConnection((err, con) => {
          if (!err) {
            const sql = `SELECT * FROM employees where EmpCode = '${decoded.EmpCode}'`;
            con.query(sql, (err, result) => {
              if (!err) {
                if (result.length > 0) {
                  var employeeData = {};
                  Object.assign(employeeData, result[0]);
                  if (employeeData.Access == "admin") {
                    delete employeeData["Password"];
                    req.user = employeeData;
                    return next();
                  } else {
                    return res.status(401).json({
                      error:
                        "You require admin access to perform this operation"
                    });
                  }
                } else {
                  return res.status(400).json({ error: "Invalid request" });
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
  }
};

module.exports = { isAuthenticated, isAdmin };
