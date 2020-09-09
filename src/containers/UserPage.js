import React from 'react';
import MainToolbar from '../components/MainToolbar';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import { useHistory } from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import t from '../common/localization';
const styles = theme => ({});



const useStyles = makeStyles(theme => ({
  UserPageSize : {
    float: 'right',
    width:'70%',
    marginRight: '10%',
    marginTop: '6%',
  }
}));
function createData(field, userData,) {
  return { field, userData,  };
}


const rows = [
  createData("Name:", "Erwin Nabaes", ),
  createData("Email:", "example@gmail.com",),
  createData("Phone:", "+23144022020",),
  createData("Map:","ni idea que va aca",),
  createData("Latitude:", "0,0",),
  createData("Longitude:", "0,0",),
  createData("Zoom:", "0",),
  createData("Attributes", "0",),
  createData("TwelveHourFormat:", "Disable",),
  createData("CoordinateFormat", "0",),
];


const UserPage = () => {
  const history = useHistory();

  const classes = useStyles();



  return (
    
    <div>
      <MainToolbar history={history} />
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