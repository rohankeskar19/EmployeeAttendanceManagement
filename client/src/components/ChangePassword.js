import React, { Component } from "react";
import { connect } from "react-redux";

import { changePassword } from "../actions/authActions";

class ChangePassword extends Component {
  state = {
    employee_code: "",
    current_password: "",
    new_password: "",
    confirm_password: "",

    errors: {}
  };

  componentDidUpdate(prevProps, prevState, snap) {
    if (prevProps.errors != this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      employee_code,
      current_password,
      new_password,
      confirm_password
    } = this.state;
    if (new_password.trim() !== confirm_password.trim()) {
      this.setState({
        error: "Passwords do not match"
      });
    } else {
      this.props.changePassword(
        employee_code,
        current_password,
        new_password,
        this.props.history
      );
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { errors } = this.state;
    const { error } = errors;
    return (
      <div className="ChangePassword">
        <div className="container">
          <h3 style={{ textAlign: "center" }}>Change Password</h3>
          {error && (
            <p style={{ textAlign: "center" }} className="text-danger">
              {error}
            </p>
          )}

          <form onSubmit={this.handleSubmit}>
            <div className="from-group">
              <label htmlFor="employee_code">Employee Code.</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your employee code"
                id="employee_code"
                name="employee_code"
                onChange={this.handleChange}
              />
              {errors && (
                <small className="text-danger">{errors.employee_code}</small>
              )}
            </div>
            <div className="from-group">
              <label htmlFor="current_password">Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your current password"
                id="current_password"
                name="current_password"
                onChange={this.handleChange}
              />
              {errors && (
                <small className="text-danger">{errors.current_password}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                id="new_password"
                name="new_password"
                onChange={this.handleChange}
              />
              {errors && (
                <small className="text-danger">{errors.new_password}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm your new password"
                id="confirm_password"
                name="confirm_password"
                onChange={this.handleChange}
              />
            </div>
            <button type="submit" className="btn btn-danger loginButton">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.auth.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changePassword: (employee_code, current_password, new_password, history) =>
      dispatch(
        changePassword(employee_code, current_password, new_password, history)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword);
