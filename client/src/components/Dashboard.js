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

  formatDate = date => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  componentDidMount() {
    const currentDate = new Date();
    const to_date = this.formatDate(currentDate);
    currentDate.setDate(currentDate.getDate() - 30);
    const from_date = this.formatDate(currentDate);
    this.setState(
      {
        from_date,
        to_date
      },
      () => {
        this.props.fetchAttendance(from_date, to_date);
      }
    );
  }

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

    if (from_date === undefined || from_date === "") {
      datesSelected = false;
    }
    if (to_date === undefined || to_date === "") {
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
    const { auth, employee } = this.props;
    const { from_date, to_date } = this.state;
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
                height: "4rem",
                zIndex: 1
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
                  <i className="material-icons">exit_to_app</i>
                </button>
              </span>
            </nav>
            <div
              className="datePicker"
              style={{
                position: "fixed",
                top: "5rem",
                width: "100%",
                height: "8rem",
                padding: ".5rem",
                
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
                    value={from_date == null || undefined ? "" : from_date}
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
                    value={to_date == null || undefined ? "" : to_date}
                  />
                </div>
                <div
                  className="vcenter"
                  style={{ marginLeft: "50px", height: "10em" }}
                >
                  <button
                    className="btn btn-light"
                    onClick={this.fetchAttendance}
                  >
                    <i className="material-icons">refresh</i>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="attendanceView"
              style={{
                width: "100%",
                height: "85%",
                position: "fixed",
                top: "9rem",
                
              }}
            >
              <AttendanceList />
            </div>
            <p style={{position: "fixed", bottom: "10px", left: "15px"}}>Total working time: {employee.totalWorkingTime}</p>
            
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    employee: state.employee
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
