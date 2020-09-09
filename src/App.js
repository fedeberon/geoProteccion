import { hot } from 'react-hot-loader/root'
import React from 'react';
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

const App = () => {
  return (
    <>
      <CssBaseline />
      <SuccessSnackbar />
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/device/:id?' component={DevicePage} />
        <Route exact path='/user/:id?' component={UserPage} />
        <Route exact path='/groups' component={GroupsPage} />
        <Route exact path='/geozones' component={GeozonesPage} />
        <Route exact path='/notifications' component={NotificationsPage} />
        <Route exact path='/calendars' component={CalendarsPage} />
        <Route exact path='/maintenance' component={MaintenancePage} />
        <Route exact path='/reports/route' component={RouteReportPage} />
      </Switch>
    </>
  );
}

export default hot(App);
