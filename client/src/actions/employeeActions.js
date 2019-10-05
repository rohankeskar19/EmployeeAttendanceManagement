import axios from "axios";

import { FETCH_ATTENDANCE } from "../actions/types";

export const fetchAttendance = (from_date, to_date) => dispatch => {
  axios
    .get(`/api/employee/attendance?from_date=${from_date}&to_date=${to_date}`)
    .then(res => {
      dispatch({ type: FETCH_ATTENDANCE, payload: res.data });
    })
    .catch(err => {
      console.log(err.response.data);
    });
};
