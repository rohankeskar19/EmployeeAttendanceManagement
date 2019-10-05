import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const EmployeeRoutes = ({
  component: Component,
  auth: { isAuthenticated, loading, isAdmin },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!isAuthenticated && !loading) {
          return <Redirect to="/" />;
        } else {
          if (isAuthenticated && !loading) {
            if (!isAdmin) {
              return <Component {...props} />;
            } else {
              return <Redirect to="/admin" />;
            }
          }
        }
      }}
    />
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  null
)(EmployeeRoutes);
