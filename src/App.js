import { hot } from 'react-hot-loader/root'
import React, {useEffect, useState} from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
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
import MainToolbar from './components/MainToolbar';
import {sessionActions} from "./store";
import {useDispatch, useSelector} from "react-redux";

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.session.authenticated);

  const checkToolbarVisibility = (path) => {
    return  !( path === '/' || path === '/login' || path === '/reports/route');
  }

  const [isToolbarVisible, setToolbarVisible] = useState(false);

  history.listen((location, action) => {
    let isVisible = checkToolbarVisibility(location.pathname);
    setToolbarVisible(isVisible);
  });


  useEffect(() => {
    if (!authenticated) {
      fetch('/api/session').then(response => {
        if (response.ok) {
          dispatch(sessionActions.authenticated(true));
        } else {
          history.push('/login');
        }
      });
    }
  }, [authenticated]);

  return (
    <>
      <CssBaseline />
      <SuccessSnackbar />
      <MainToolbar history={history} visible={isToolbarVisible} />
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/device/list' component={DevicePage} />
        <Route exact path='/device/:id?' component={DevicePage} />
        <Route exact path='/user/:id' component={UserPage} />
        <Route exact path='/account' component={UserPage} />
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
