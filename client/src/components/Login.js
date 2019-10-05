import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { loginUser } from "../actions/authActions";

class Login extends Component {
  state = {
    employee_code: "",
    password: "",
    errors: {},
    isAuthenticated: null,
    isAdmin: null
  };

  componentDidUpdate(prevProps, prevState, snap) {
    if (prevProps.errors != this.props.errors) {
      this.setState({
        errors: this.props.errors
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { employee_code, password } = this.state;

    this.props.loginUser({ employee_code, password }, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="Login">
        <div className="container">
          {errors && (
            <p style={{ textAlign: "center" }} className="text-danger">
              {errors.error}
            </p>
          )}

          <h3 style={{ textAlign: "center" }}>Login</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="from-group">
              <label htmlFor="employee_code">Employee Code.</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter employee code"
                id="employee_code"
                name="employee_code"
                onChange={this.handleChange}
              />
              {errors && (
                <small className="text-danger">{errors.employee_code}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                id="password"
                name="password"
                onChange={this.handleChange}
              />
              {errors && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>
            <button type="submit" className="btn btn-danger loginButton">
              Login
            </button>
          </form>
          <Link to="/change-password" className="changePasswordLink">
            Change Password
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.auth.errors,
    isAuthenticated: state.auth.isAuthenticated,
    isAdmin: state.auth.isAdmin,
    isLoading: state.auth.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: (userData, history) => dispatch(loginUser(userData, history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
