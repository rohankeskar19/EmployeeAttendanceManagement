import React, { Component } from "react";
import { connect } from "react-redux";
import { logOutUser } from "../actions/authActions";
import { fetchAttendance } from "../actions/employeeActions";
import AttendanceList from "./AttendanceList";

class Dashboard extends Component {
  state = {
    auth: null,
    from_date: null,
    to_date: null,
    error: ""
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

  logOut = () => {
    this.props.logOutUser(this.props.history);
  };

  fetchAttendance = () => {
    const { from_date, to_date } = this.state;
    var datesSelected = true;

    if (from_date == undefined) {
      datesSelected = false;
    }
    if (to_date == undefined) {
      datesSelected = false;
    }

    if (!datesSelected) {
      this.setState({
        error: "Please select a starting date and a ending date to continue"
      });
    } else {
      this.props.fetchAttendance(from_date, to_date);
    }
  };

  render() {
    const { auth } = this.props;
    const { error } = this.state;
    return (
      <div>
        {auth && (
          <div>
            <nav
              className="navbar navbar-expand-lg navbar-light bg-light"
              style={{
                position: "fixed",
                top: "0",
                width: "100%",
                height: "4rem"
              }}
            >
              <span className="navbar-brand">{auth.user.EmpName}</span>
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item active">
                  <span className="nav-link" href="#">
                    Employee Code. {auth.user.EmpCode}
                  </span>
                </li>
              </ul>
              <span className="form-inline my-2 my-lg-0">
                <button
                  className="btn btn-light my-2 my-sm-0"
                  onClick={this.logOut}
                >
                  Log out
                </button>
              </span>
            </nav>
            <div
              className="attendanceView"
              style={{
                width: "100%",
                height: "85%",
                position: "fixed",
                top: "4rem",
                overflowY: "scroll"
              }}
            >
              <AttendanceList />
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
                  <span style={{ margin: ".5rem" }}>From:</span>
                  <input
                    type="date"
                    onChange={this.changeFromDate}
                    className="date_picker"
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
                  />
                </div>
                <div
                  className="vcenter"
                  style={{ marginLeft: "50px", height: "10em" }}
                >
                  <button
                    className="btn btn-danger"
                    onClick={this.fetchAttendance}
                  >
                    Refresh
                  </button>
                </div>
                <div
                  className="vcenter"
                  style={{ marginLeft: "50px", height: "10em" }}
                >
                  {error && <p className="text-danger">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logOutUser: history => dispatch(logOutUser(history)),
    fetchAttendance: (from_date, to_date) =>
      dispatch(fetchAttendance(from_date, to_date))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
