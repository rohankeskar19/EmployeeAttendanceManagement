import React, { Component } from "react";
import { connect } from "react-redux";

class Admin extends Component {
  state = {};

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snap) {}

  render() {
    return (
      <div>
        <p>Admin</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  null
)(Admin);
