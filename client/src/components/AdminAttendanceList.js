import React from "react";
import { connect } from "react-redux";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

const AdminAttendanceList = ({ attendance }) => {
  return (
    <div className="attendance-list">
      {attendance &&
        attendance.map((att, index) => {
          const date = new Date(att.AttendanceDate);
          const day = date.getDay();
          const dayOfWeek = daysOfWeek[day];
          const dateOfMonth = date.getDate();
          const month = months[date.getMonth()];
          const totalTime = att.TotalTime;

          var numHours = parseInt(totalTime.split(":")[0]);
          var classToSet = "";
          if (dayOfWeek !== "Sunday" && dayOfWeek !== "Saturday") {
            if (numHours < 5) {
              classToSet = "yellow";
            }
          }
          if (dayOfWeek === "Sunday" || dayOfWeek === "Saturday") {
            classToSet = "weekend";
          } else {
            if (att.Status === "A") {
              classToSet = "absent";
            }
          }

          classToSet = "calendar-cell " + classToSet;

          return (
            <span className={classToSet} key={index}>
              <span className="date-of-month">
                {dateOfMonth} {month}
              </span>
              <span className="status">{att.Status}</span>
              <span className="tooltip">
                <span className="intime">In time: {att.InTime}</span>
                <span className="outtime">Out time: {att.OutTime}</span>

                <span className="totaltime">Total time: {att.TotalTime}</span>
              </span>
            </span>
          );
        })}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    attendance: state.admin.attendance
  };
};

export default connect(
  mapStateToProps,
  null
)(AdminAttendanceList);
