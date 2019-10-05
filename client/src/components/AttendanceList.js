import React from "react";
import { connect } from "react-redux";

const AttendanceList = ({ attendance }) => {
  return (
    <div>
      {attendance && attendance.map(att => <p>{JSON.stringify(att)}</p>)}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    attendance: state.employee.attendance
  };
};

export default connect(
  mapStateToProps,
  null
)(AttendanceList);
