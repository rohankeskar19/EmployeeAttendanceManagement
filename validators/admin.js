const validator = {};

validator.validateEmployeeCode = employee_code => {
  const errors = {};
  if (employee_code == undefined) {
    errors.employee_code = "Please enter a Employee Code to continue";
  } else {
    if (employee_code.trim() == "") {
      errors.employee_code = "Invalid Employee Code";
    }
  }
  return errors;
};

module.exports = validator;
