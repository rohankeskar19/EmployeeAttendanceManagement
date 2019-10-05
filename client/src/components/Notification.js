import React, { Component, Fragment } from "react";

class Notification extends Component {
  state = {
    bottom: -100
  };

  onShow = () => {};

  showNotification = () => {
    this.setState({
      bottom: 20
    });
  };

  render() {
    const { bottom } = this.state;
    return (
      <Fragment>
        <div className="notification-container" style={{ bottom: `${bottom}` }}>
          <p className="notification-box">
            Please select a starting date and ending date
          </p>
        </div>
      </Fragment>
    );
  }
}

export default Notification;
