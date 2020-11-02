import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import {makeStyles} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import t from '../common/localization';
import { useSelector } from 'react-redux';
import Divider from "@material-ui/core/Divider";

const styles = theme => ({});

const useStyles = makeStyles(theme => ({

  root: {
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    paddingTop: '5%',
    paddingRight: '15%',
  },
  UserPageSize : {
    float: 'right',
    width:'70%',
    marginRight: '10%',
    marginTop: '6%',
  }
}));

function createData(field, userData) {
  userData = userData !== undefined ? userData.toString() : '';
  return { field, userData };
}

const UserPage = () => {
  const classes = useStyles();

  const user = useSelector(state => state.session.user);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let name = createData(t('sharedName'), user.name);
    let email = createData(t('userEmail'), user.email);
    let phone = createData(t('sharedPhone'), user.phone);
    let map = createData(t('mapTitle'), user.map);
    let latitude = createData(t('positionLatitude'), user.latitude);
    let longitude = createData(t('positionLongitude'), user.longitude);
    let zoom = createData(t('serverZoom'), user.zoom);
    let attributes = createData(t('sharedAttributes'), 'NOT FINISHED');
    let twelveHourFormat = createData(t('settingsTwelveHourFormat'), user.twelveHourFormat);
    let coordinatesFormat = createData(t('settingsCoordinateFormat'), user.coordinateFormat);
    setRows([ name, email, phone, map, latitude, longitude, zoom, attributes, twelveHourFormat, coordinatesFormat ]);
  },[user]);

  return (

    <div className={classes.root}>
      <div className="title-section">
        <h2>Información de Usuario</h2>
        <Divider />
      </div>
      <div className={classes.UserPageSize}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.field}>
                  <TableCell component="th" scope="row">
                    {row.field}
                  </TableCell>
                  <TableCell align="left">{row.userData}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default withWidth()(withStyles(styles)(UserPage));
