import React from "react";
import { Redirect, Route } from "react-router-dom";
import MainToolbar from "./MainToolbar";

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  return (
    <>
      {rest.path !== "/" && rest.path !== "/logout" ? <MainToolbar /> : ""}
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Component {...rest} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          )
        }
      />
    </>
  );
};

export default PrivateRoute;
