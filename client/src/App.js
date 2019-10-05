import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import setAuthToken from "./helpers/setAuthToken";

import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";
import store from "./store";

import { LOGOUT_USER, LOGIN_USER } from "./actions/types";
import EmployeeRoutes from "./components/EmployeeRoutes";
import AdminRoutes from "./components/AdminRoutes";

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token.split(" ")[1]);
      var currentTime = Date.now().toString();
      currentTime = currentTime.substring(0, currentTime.length - 3);
      if (parseInt(currentTime) < decoded.exp) {
        const payload = {};
        payload.user = decoded;
        payload.isAuthenticated = true;
        payload.isAdmin = decoded.Access == "admin" ? true : false;
        setAuthToken(token);
        store.dispatch({ type: LOGIN_USER, payload: payload });
        if (decoded.Access == "admin") {
          this.props.history.push("/admin");
        } else {
          this.props.history.push("/dashboard");
        }
      } else {
        store.dispatch({ type: LOGOUT_USER });
        localStorage.removeItem("token");
        setAuthToken();
      }
    } else {
      store.dispatch({ type: LOGOUT_USER });
      localStorage.removeItem("token");
      setAuthToken();
    }
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/change-password" component={ChangePassword} exact />
          <EmployeeRoutes path="/dashboard" component={Dashboard} exact />
          <AdminRoutes path="/admin" component={Admin} exact />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
