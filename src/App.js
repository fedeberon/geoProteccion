import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './containers/MainPage';
import LoginPage from './containers/LoginPage';
import RouteReportPage from './containers/RouteReportPage';
import UserPage from './containers/UserPage';
import GroupsPage from './containers/GroupsPage';
import DevicePage from './containers/DevicePage';
import GeozonesPage from './containers/GeozonesPage';
import NotificationsPage from './containers/NotificationsPage';
import CalendarsPage from './containers/CalendarsPage';
import MaintenancePage from './containers/MaintenancePage';
import SuccessSnackbar from "./components/SuccessSnackbar";
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from './components/ PrivateRoute';
import { isWidthUp } from '@material-ui/core';
import { getBreakpointFromWidth } from './utils/functions';
import { sessionActions } from './store';

const App = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.session.authenticated);
  useEffect(() => {
    const isViewportDesktop = isWidthUp('md', getBreakpointFromWidth(window.innerWidth));
    dispatch(sessionActions.setDeviceAttribute({ attribute: 'isViewportDesktop', value: isViewportDesktop }));
  });

  return (
    <>
      <CssBaseline />
      <SuccessSnackbar />
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <PrivateRoute exact path='/' isAuthenticated={authenticated} component={MainPage} />
        <PrivateRoute exact path='/logout' isAuthenticated={authenticated} component={LoginPage} />
        <PrivateRoute exact path='/device/list' isAuthenticated={authenticated} component={DevicePage} />
        <PrivateRoute exact path='/device/:id?' isAuthenticated={authenticated} component={DevicePage} />
        <PrivateRoute exact path='/account' isAuthenticated={authenticated} component={UserPage} />
        <PrivateRoute exact path='/groups' isAuthenticated={authenticated} component={GroupsPage} />
        <PrivateRoute exact path='/geozones' isAuthenticated={authenticated} component={GeozonesPage} />
        <PrivateRoute exact path='/notifications' isAuthenticated={authenticated} component={NotificationsPage} />
        <PrivateRoute exact path='/calendars' isAuthenticated={authenticated} component={CalendarsPage} />
        <PrivateRoute exact path='/maintenance' isAuthenticated={authenticated} component={MaintenancePage} />
        <PrivateRoute exact path='/reports/route' isAuthenticated={authenticated} component={RouteReportPage} />
      </Switch>
    </>
  );
}

export default hot(App);
