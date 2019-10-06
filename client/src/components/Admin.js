import React, { Component } from "react";
import { connect } from "react-redux";

import {
  searchEmployee,
  addAsAdmin,
  addEmployee,
  fetchEmployees,
  fetchAttendance
} from "../actions/adminActions";
import { logOutUser } from "../actions/authActions";
import AdminAttendanceList from "./AdminAttendanceList";

class Admin extends Component {
  state = {
    currentPage: 0,
    employee_code: "",
    employee_name: "",
    password: "",
    local_errors: {},
    showEmployees: false,
    from_date: "",
    to_date: "",
    currentEmployee: ""
  };

  setPage = (page, employee_code) => {
    this.setState({
      currentPage: page,
      employee_code: "",
      employee_name: "",
      password: "",
      currentEmployee: employee_code
    });
  };

  formatDate = date => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  handleAddEmployeeChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  changeFromDate = e => {
    this.setState({
      from_date: e.target.value
    });
  };
  changeToDate = e => {
    this.setState({
      to_date: e.target.value
    });
  };

  componentDidMount() {
    const currentDate = new Date();
    const to_date = this.formatDate(currentDate);
    currentDate.setDate(currentDate.getDate() - 30);
    const from_date = this.formatDate(currentDate);
    this.setState({
      from_date,
      to_date
    });
  }

  componentDidUpdate() {
    const { auth } = this.props;

    if (auth.isAuthenticated) {
      this.props.fetchEmployees();
    }
  }

  handleAddEmployeeSubmit = e => {
    e.preventDefault();
    const { employee_code, employee_name, password } = this.state;
    var errorOccured = false;
    const local_errors = {};

    if (employee_code === undefined || employee_code === "") {
      local_errors.employee_code = "Please enter a employee code to continue";
      errorOccured = true;
    }
    if (employee_name === undefined || employee_name === "") {
      local_errors.employee_name = "Please enter a employee name to continue";
      errorOccured = true;
    }
    if (password === undefined || password === "") {
      local_errors.password = "Please enter a password to continue";
      errorOccured = true;
    }

    if (errorOccured) {
      this.setState({
        local_errors
      });
    } else {
      this.props.addEmployee(employee_code, employee_name, password);
      this.setState({
        employee_code: "",
        employee_name: "",
        password: ""
      });
    }
  };
  handleSearchEmployeeSubmit = e => {
    e.preventDefault();
    const { employee_code } = this.state;
    if (employee_code === undefined || employee_code === "") {
      const local_errors = {};
      local_errors.employee_code = "Please enter employee code to continue";
      this.setState({
        local_errors
      });
    } else {
      this.props.searchEmployee(employee_code);
    }
  };

  addAsAdmin = () => {
    const { admin } = this.props;
    const { searchedEmployee } = admin;

    const { EmpCode } = searchedEmployee;

    this.props.addAsAdmin(EmpCode);
  };

  fetchEmployeeAttendance = () => {
    const { from_date, to_date, currentEmployee } = this.state;
    console.log("calling1", currentEmployee);
    this.props.fetchAttendance(from_date, to_date, currentEmployee);
  };

  getContent = () => {
    const {
      currentPage,
      local_errors,
      employee_code,
      employee_name,
      password,
      from_date,
      to_date,
      currentEmployee
    } = this.state;
    const { admin } = this.props;
    const { searchedEmployee, errors } = admin;

    switch (currentPage) {
      case 0:
        return (
          <div>
            <form onSubmit={this.handleSearchEmployeeSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter employee code"
                  name="employee_code"
                  onChange={this.handleAddEmployeeChange}
                />
                {local_errors && (
                  <small className="text-danger">
                    {local_errors.employee_code}
                  </small>
                )}
                {errors && (
                  <small className="text-danger">{errors.employee_code}</small>
                )}
              </div>
            </form>
            {searchedEmployee && (
              <div className="search-result">
                <p>
                  {searchedEmployee.EmpCode} {searchedEmployee.EmpName}{" "}
                </p>
                {searchedEmployee.Access === "admin" ? (
                  <i className="material-icons text-success">check</i>
                ) : (
                  <button className="btn btn-danger" onClick={this.addAsAdmin}>
                    Add as admin
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case 1:
        this.props.fetchAttendance(from_date, to_date, currentEmployee);
        return (
          <div>
            <div
              className="attendanceView"
              style={{
                width: "85%",
                height: "93%",
                position: "fixed",
                top: "2rem",
                overflowY: "scroll"
              }}
            >
              <AdminAttendanceList />
            </div>
            <div
              className="datePicker"
              style={{
                position: "fixed",
                bottom: "0",
                width: "100%",
                height: "5rem",
                padding: ".5rem"
              }}
            >
              <div className="row">
                <div
                  className="vcenter"
                  style={{ height: "3em", margin: "1rem" }}
                >
                  <span style={{ margin: ".5rem" }}>From: </span>
                  <input
                    type="date"
                    onChange={this.changeFromDate}
                    className="date_picker"
                    value={from_date}
                  />
                </div>
                <div
                  className="vcenter"
                  style={{ height: "3em", margin: "1rem" }}
                >
                  <span style={{ margin: ".5rem" }}>To:</span>
                  <input
                    type="date"
                    onChange={this.changeToDate}
                    className="date_picker"
                    value={to_date}
                  />
                </div>
                <div
                  className="vcenter"
                  style={{ marginLeft: "50px", height: "10em" }}
                >
                  <button
                    className="btn btn-light"
                    onClick={this.fetchEmployeeAttendance}
                  >
                    <i className="material-icons">refresh</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <form onSubmit={this.handleAddEmployeeSubmit}>
            <div class="form-group">
              <label htmlFor="employee_code">Employee Code.</label>
              <input
                type="text"
                class="form-control"
                id="employee_code"
                placeholder="Enter employee code"
                name="employee_code"
                onChange={this.handleAddEmployeeChange}
                value={employee_code}
              />
              {local_errors && (
                <small className="text-danger">
                  {local_errors.employee_code}
                </small>
              )}
              {errors && (
                <small className="text-danger">{errors.employee_code}</small>
              )}
            </div>
            <div class="form-group">
              <label for="employee_name">Employee Name</label>
              <input
                type="text"
                class="form-control"
                id="employee_name"
                name="employee_name"
                placeholder="Enter employee name"
                onChange={this.handleAddEmployeeChange}
                value={employee_name}
              />
              {local_errors && (
                <small className="text-danger">
                  {local_errors.employee_name}
                </small>
              )}
              {errors && (
                <small className="text-danger">{errors.employee_name}</small>
              )}
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                placeholder=" Set password"
                onChange={this.handleAddEmployeeChange}
                value={password}
              />
              {local_errors && (
                <small className="text-danger">{local_errors.password}</small>
              )}
              {errors && (
                <small className="text-danger">{errors.employee_code}</small>
              )}
            </div>

            <button type="submit" class="btn btn-danger">
              Add user
            </button>
          </form>
        );
      default:
        break;
    }
  };

  toggleEmployees = () => {
    this.setState({
      showEmployees: !this.state.showEmployees
    });
  };

  logOutUser = () => {
    this.props.logOutUser(this.props.history);
  };

  render() {
    const { showEmployees } = this.state;
    const { auth, admin } = this.props;
    const { employees } = admin;

    return (
      <div className="wrapper">
        <nav id="sidebar">
          <div className="sidebar-header">
            {auth && <p>{auth.user.EmpName}</p>}
          </div>

          <ul className="list-unstyled components">
            {auth && (
              <p className="employee-code-navbar">
                Employee Code. {auth.user.EmpCode}
              </p>
            )}

            <li className="admin-links" onClick={() => this.setPage(0)}>
              <p to="/add-admin" data-toggle="collapse" aria-expanded="false">
                Add admin
              </p>
            </li>
            <li onClick={this.toggleEmployees} className="admin-links">
              <p>
                Employees{" "}
                <i className="material-icons dropdown-arrow">
                  keyboard_arrow_down
                </i>
              </p>
              <div style={{ display: showEmployees ? "block" : "none" }}>
                {employees &&
                  employees.map(employee => (
                    <p
                      onClick={() => this.setPage(1, employee.EmpCode)}
                      key={employee.EmpCode}
                    >
                      {employee.EmpCode}
                    </p>
                  ))}
              </div>
            </li>
            <li onClick={() => this.setPage(2)} className="admin-links">
              <p>Add employee</p>
            </li>
            <li onClick={this.logOutUser} className="admin-links">
              <p>
                <i className="material-icons">exit_to_app</i>
              </p>
            </li>
          </ul>
        </nav>
        <div className="admin-content">{this.getContent()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    admin: state.admin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchEmployee: employee_code => dispatch(searchEmployee(employee_code)),
    addAsAdmin: employee_code => dispatch(addAsAdmin(employee_code)),
    addEmployee: (employee_code, employee_name, password) =>
      dispatch(addEmployee(employee_code, employee_name, password)),
    fetchEmployees: () => dispatch(fetchEmployees()),
    fetchAttendance: (from_date, to_date, employee_code) =>
      dispatch(fetchAttendance(from_date, to_date, employee_code)),
    logOutUser: history => dispatch(logOutUser(history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
