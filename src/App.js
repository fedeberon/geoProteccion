import { hot } from "react-hot-loader/root";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainPage from "./containers/MainPage";
import LoginPage from "./containers/LoginPage";
import UserPage from "./containers/UserPage";
import UsersPage from "./containers/UsersPage";
import GroupsPage from "./containers/GroupsPage";
import DevicePage from "./containers/DevicePage";
import GeozonesPage from "./containers/GeozonesPage";
import SavedCommandsPage from "./containers/SavedCommandsPage";
import NotificationsPage from "./containers/NotificationsPage";
import CalendarsPage from "./containers/CalendarsPage";
import MaintenancePage from "./containers/MaintenancePage";
import SuccessSnackbar from "./components/SuccessSnackbar";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/ PrivateRoute";
import { isWidthUp } from "@material-ui/core";
import { getBreakpointFromWidth } from "./utils/functions";
import { sessionActions } from "./store";
import DeviceDetail from "./components/DeviceDetail";
import SocketController from "./components/SocketController";
import * as service from "./utils/serviceManager";
import Validation from './components/Validation';

const App = () => {
  
  const dispatch = useDispatch();  
  const history = useHistory();
  const authenticated = useSelector((state) => state.session.authenticated);
  const server = useSelector((state) => state.session.server);  
  let userData;
  let response;

  useEffect(() => {
    const isViewportDesktop = isWidthUp(
      "md",
      getBreakpointFromWidth(window.innerWidth)
    );
    dispatch(
      sessionActions.setDeviceAttribute({
        attribute: "isViewportDesktop",
        value: isViewportDesktop,
      })
    );
  });

  useEffect(()=> {
    userData
        if(localStorage.token){          
          history.push("/validation");      
        }
        const autoLogin = async () => {           
        if(localStorage.token && localStorage.username && localStorage.password){        
        response = await service.setSession(localStorage.username, localStorage.password);
        let userData = response.status === 200 ? await response.json() : "";

        if (response.status === 200) {
          dispatch(sessionActions.authenticated(true));
          dispatch(sessionActions.setUser(userData));
          let responseServer = await service.getServer();
          dispatch(sessionActions.setServer(responseServer));                   
        }        
        if(server && userData){
          setTimeout(()=> {
            history.push("/"); 
          },2000)                   
        }    
      }
    }
    autoLogin();   
  },[]);  

  return (
    
    <>
      <CssBaseline />
      <SuccessSnackbar />      
      {authenticated && <SocketController />}         
      <Switch>       
        <Route exact path="/validation" component={Validation}/>  
        <Route exact path="/login" component={LoginPage} />     
        <PrivateRoute
          exact
          path="/"
          isAuthenticated={authenticated}
          component={MainPage}
        />
        <PrivateRoute
          exact
          path="/logout"
          isAuthenticated={authenticated}
          component={LoginPage}
        />
        <PrivateRoute
          exact
          path="/device/list"
          isAuthenticated={authenticated}
          component={DevicePage}
        />
        <PrivateRoute
          exact
          path="/device/:id?"
          isAuthenticated={authenticated}
          component={DeviceDetail}
        />
        <PrivateRoute
          exact
          path="/account"
          isAuthenticated={authenticated}
          component={UserPage}
        />
        <PrivateRoute
          exact
          path="/groups"
          isAuthenticated={authenticated}
          component={GroupsPage}
        />
        <PrivateRoute
          exact
          path="/geozones"
          isAuthenticated={authenticated}
          component={GeozonesPage}
        />
        <PrivateRoute
          exact
          path="/notifications"
          isAuthenticated={authenticated}
          component={NotificationsPage}
        />
        <PrivateRoute
          exact
          path="/calendars"
          isAuthenticated={authenticated}
          component={CalendarsPage}
        />
        <PrivateRoute
          exact
          path="/maintenance"
          isAuthenticated={authenticated}
          component={MaintenancePage}
        />
        <PrivateRoute
          exact
          path="/savedcommands"
          isAuthenticated={authenticated}
          component={SavedCommandsPage}
        />        
        <PrivateRoute
          exact
          path="/users"
          isAuthenticated={authenticated}
          component={UsersPage}
        />
      </Switch>      
    </>
  );
};

export default hot(App);
