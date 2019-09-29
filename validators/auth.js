const validator = {};

validator.validateRegisterInput = (
  employee_code,
  employee_name,
  password,
  access
) => {
  const errors = {};

  if (employee_code == undefined) {
    errors.employee_code = "Please specify employee code to continue";
  } else if (employee_code.trim() == "") {
    errors.employee_code = "Invalid employee code";
  }
  if (employee_name == undefined) {
    errors.employee_name = "Please specify employee name to continue";
  } else if (employee_name.trim() == "") {
    errors.employee_name = "Invalid employee name";
  }
  if (password == undefined) {
    errors.password = "Please specify password to continue";
  } else if (password.trim() == "") {
    errors.password = "Password must be between 6-30 characters";
  } else if (password.trim().length < 6 || password.trim().length > 30) {
    errors.password = "Password must be between 6-30 characters";
  }
  if (access != undefined) {
    if (access.trim() == "admin" || access.trim() == "regular") {
    } else {
      errors.access = "Invalid access specified";
    }
  }

  return errors;
};

validator.validateLoginInput = (
  employee_code,

  password
) => {
  const errors = {};

  if (employee_code == undefined) {
    errors.employee_code = "Please specify employee code to continue";
  } else if (employee_code.trim() == "") {
    errors.employee_code = "Invalid employee code";
  }

  if (password == undefined) {
    errors.password = "Please specify password to continue";
  } else if (password.trim() == "") {
    errors.password = "Password must be between 6-30 characters";
  } else if (password.trim().length < 6 || password.trim().length > 30) {
    errors.password = "Password must be between 6-30 characters";
  }

  return errors;
};

validator.validateChangePasswordInput = (
  employee_code,
  current_password,
  new_password
) => {
  const errors = {};

  if (employee_code == undefined) {
    errors.employee_code = "Please specify employee code to continue";
  } else if (employee_code.trim() == "") {
    errors.employee_code = "Invalid employee code";
  }

  if (current_password == undefined) {
    errors.current_password = "Please specify password to continue";
  } else if (current_password.trim() == "") {
    errors.current_password = "Password must be between 6-30 characters";
  } else if (
    current_password.trim().length < 6 ||
    current_password.trim().length > 30
  ) {
    errors.current_password = "Password must be between 6-30 characters";
  }

  if (new_password == undefined) {
    errors.new_password = "Please specify password to continue";
  } else if (new_password.trim() == "") {
    errors.new_password = "Password must be between 6-30 characters";
  } else if (
    new_password.trim().length < 6 ||
    new_password.trim().length > 30
  ) {
    errors.new_password = "Password must be between 6-30 characters";
  }
  return errors;
};

module.exports = validator;
