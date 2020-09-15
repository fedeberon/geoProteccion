import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import MainToolbar from './MainToolbar';

const PrivateRoute = ({ isAuthenticated: isAuthenticated, component: Component, ...rest}) => {

	return (
    <>
      { rest.path !== '/' ?
        <MainToolbar/>
        :
        ''
      }
      <Route
      {...rest}
        render={props =>
          isAuthenticated ? (
              <Component {...rest} component />
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
}

export default PrivateRoute;
