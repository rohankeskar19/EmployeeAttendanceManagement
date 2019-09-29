const validator = {};

validator.validateAttendanceInput = (from_date, to_date) => {
  const errors = {};

  if (from_date == undefined) {
    errors.from_date = "Please specify beginning date to continue";
  } else {
    if (Object.prototype.toString.call(from_date) === "[object Date]") {
      if (isNaN(from_date.getTime())) {
        errors.from_date = "Please specify a valid date";
      }
    }
  }
  if (to_date == undefined) {
    errors.to_date = "Please specify ending date to continue";
  } else {
    if (Object.prototype.toString.call(to_date) === "[object Date]") {
      if (isNaN(to_date.getTime())) {
        errors.to_date = "Please specify a valid date";
      }
    }
  }

  return errors;
};

module.exports = validator;
