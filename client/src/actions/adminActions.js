import {
  SEARCH_EMPLOYEE,
  ADDED_AS_ADMIN,
  SET_ADMIN_ERRORS,
  ADD_EMPLOYEE,
  FETCH_EMPLOYEES,
  FETCH_SINGLE_ATTENDANCE
} from "./types";
import axios from "axios";

export const searchEmployee = employee_code => dispatch => {
  console.log(employee_code);
  axios
    .get(`/api/admin/search-employees?employee_code=${employee_code}`)
    .then(res => {
      const employeeData = res.data;

      dispatch({ type: SEARCH_EMPLOYEE, payload: employeeData });
    })
    .catch(err => {
      dispatch({ type: SET_ADMIN_ERRORS, payload: err.response.data });
    });
};

export const addAsAdmin = employee_code => dispatch => {
  axios
    .put(`/api/admin/add-admin?employee_code=${employee_code}`)
    .then(res => {
      dispatch({ type: ADDED_AS_ADMIN });
    })
    .catch(err => {
      dispatch({ type: SET_ADMIN_ERRORS, payload: err.response.data });
    });
};

export const addEmployee = (
  employee_code,
  employee_name,
  password
) => dispatch => {
  axios
    .post("/api/auth/register", {
      employee_code,
      employee_name,
      password
    })
    .then(res => {
      dispatch({ type: ADD_EMPLOYEE, payload: employee_code });
    })
    .catch(err => {
      dispatch({ type: SET_ADMIN_ERRORS, payload: err.response.data });
    });
};

export const fetchEmployees = () => dispatch => {
  axios
    .get("/api/admin/fetch-employees")
    .then(res => {
      dispatch({ type: FETCH_EMPLOYEES, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: SET_ADMIN_ERRORS, payload: err.response.data });
    });
};

export const fetchAttendance = (
  from_date,
  to_date,
  employee_code
) => dispatch => {
  axios
    .get(
      `/api/admin/fetch-attendance?from_date=${from_date}&to_date=${to_date}&employee_code=${employee_code}`
    )
    .then(res => {
      const attendance = res.data;
      var totalWorkingTime = 0;
      var totalHours = 0;
      var totalMinutes = 0;
      attendance.forEach(a => {
        const totalTime = a.TotalTime;
        totalHours += parseInt(totalTime.split(":")[0]);
        totalMinutes += parseInt(totalTime.split(":")[1]);
      });

      totalMinutes += totalHours * 60;

      totalWorkingTime = getHour(totalMinutes);

      const payload = {
        attendance: res.data,
        totalWorkingTime
      };
      dispatch({ type: FETCH_SINGLE_ATTENDANCE, payload });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: SET_ADMIN_ERRORS, payload: err.response.data });
    });
};

function getHour(value) {
  if (value == null) {
    return "";
  }
  if (value <= 0) {
    return "";
  }
  var hours = Math.floor(value / 60);
  var minutes = value % 60;
  var hour = hours > 1 ? hours : hours;
  var min = minutes > 0 ? minutes : "";
  return hour + ":" + min;
}
