import { hot } from 'react-hot-loader/root'
import React from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './containers/MainPage';
import LoginPage from './containers/LoginPage';
import RouteReportPage from './containers/RouteReportPage';
import DevicePage from './containers/DevicePage';

const App = () => {
  return (
    <>
      <CssBaseline />
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/device/:id?' component={DevicePage} />
        <Route exact path='/reports/route' component={RouteReportPage} />
      </Switch>
    </>
  );
}

export default hot(App);
