import {
  LOGIN_USER,
  SET_ERRORS,
  LOGINGIN_USER,
  LOGOUT_USER,
  CLEAR_DATA
} from "./types";
import axios from "axios";
import jwtdecode from "jwt-decode";
import setAuthToken from "../helpers/setAuthToken";

export const loginUser = (loginData, history) => dispatch => {
  const { employee_code, password } = loginData;
  axios
    .post("/api/auth/login", {
      employee_code,
      password
    })
    .then(res => {
      dispatch({ type: LOGINGIN_USER });

      const { token } = res.data;

      localStorage.setItem("token", token);
      setAuthToken(token);

      const decoded = jwtdecode(token);

      const payload = {};

      payload.isAuthenticated = true;

      if (decoded.Access === "admin") {
        payload.isAdmin = true;
      } else {
        payload.isAdmin = false;
      }

      payload.user = decoded;
      payload.loading = false;
      const pathToSend = payload.isAdmin ? "/admin" : "/dashboard";

      history.push(pathToSend);

      dispatch({ type: LOGIN_USER, payload: payload });
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const changePassword = (
  employee_code,
  current_password,
  new_password,
  history
) => dispatch => {
  axios
    .post("/api/auth/change-password", {
      employee_code,
      current_password,
      new_password
    })
    .then(res => {
      history.push("/");
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const logOutUser = history => dispatch => {
  localStorage.removeItem("token");
  setAuthToken();
  dispatch({ type: LOGOUT_USER });
  dispatch({ type: CLEAR_DATA });

  history.push("/");
};
