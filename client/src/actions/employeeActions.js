import axios from "axios";

import { FETCH_ATTENDANCE } from "../actions/types";

export const fetchAttendance = (from_date, to_date) => dispatch => {
  axios
    .get(`/api/employee/attendance?from_date=${from_date}&to_date=${to_date}`)
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
      }

      dispatch({ type: FETCH_ATTENDANCE, payload });
    })
    .catch(err => {
      console.log(err.response.data);
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

  
  return hour + " h " + min + " m";
}