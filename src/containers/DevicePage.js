import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as service from '../utils/serviceManager';
import t from '../common/localization';
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
  DivicePageSize: {
    float: 'right',
    width: '70%',
    marginRight: '10%',
    marginTop: '6%',
  },
  table: {
    minWidth: 700,
  },
  devicesTable: {
    width: '70%',
    marginRight: '15%',
    float: 'right',
    marginTop: 'theme.spacing.unit * 3',
    overflowX: 'auto',
  }

}));


function createData(field, userData,) {
  return {field, userData,};
}


const rows = [
  createData("id:", "",),
  createData("names:", "",),
  createData("uniqueId:", "",),
  createData("Status:", "",),
  createData("Disable:", "",),
  createData("lastUpdate:", "",),
  createData("Positionid:", "",),
  createData("Groupid:", "",),
  createData("Phone:", "",),
  createData("Model", "",),
  createData("Contact:", "",),
  createData("Category:", "",),
  createData("GeofenceIds:", "",),
  createData("Attributes", "",),
];

const DevicePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const [device, setDevice] = useState();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const userId = useSelector((state) => state.session.user.id)
  const [devices, setDevices] = useState([])

  useEffect(() => {
    const getDevices = async (userId) => {
      const response = await service.getDeviceByUserId(userId);
      console.log(response);
      setDevices(response);
    }
    getDevices(userId);
  }, [userId]);

  // useEffect(()=>{
  //   fetch(`/api/devices/${id}`).then(response => {
  //     if (response.ok) {
  //       response.json().then(setDevice);
  //     }
  //   });
  // })

  const handleSave = () => {
    const updatedDevice = id ? device : {};
    updatedDevice.name = name || updatedDevice.name;
    updatedDevice.uniqueId = uniqueId || updatedDevice.uniqueId;

    let request;
    if (id) {
      request = fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedDevice),
      });
    } else {
      request = fetch('/api/devices', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedDevice),
      });
    }

    request.then(response => {
      if (response.ok) {
        history.goBack();
      }
    });
  }

  return (
    <>
      <div className={classes.devicesTable}>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>UserID</TableCell>
                <TableCell>Names</TableCell>
                <TableCell>UniqueID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Disable</TableCell>
                <TableCell>LastUpdate</TableCell>
                <TableCell>PositionID</TableCell>
                <TableCell>GroupID</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>GeoFenceIds</TableCell>
                <TableCell>Attributes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableCell key={row.field}>
                  <TableRow>
                    {row.userData}</TableRow>
                </TableCell>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Container maxWidth='xs' className={classes.container}>
        <form>
          {(!id || device) &&
          <TextField
            margin="normal"
            fullWidth
            defaultValue={device && device.name}
            onChange={(event) => setName(event.target.value)}
            label={t('sharedName')}
            variant="filled"/>
          }
          {(!id || device) &&
          <TextField
            margin="normal"
            fullWidth
            defaultValue={device && device.uniqueId}
            onChange={(event) => setUniqueId(event.target.value)}
            label={t('deviceIdentifier')}
            variant="filled"/>
          }
          <FormControl fullWidth margin="normal">
            <div className={classes.buttons}>
              <Button type="button" color="primary" variant="outlined"
                      onClick={() => history.goBack()}>
                {t('sharedCancel')}
              </Button>
              <Button type="button" color="primary" variant="contained"
                      onClick={handleSave}>
                {t('sharedSave')}
              </Button>
            </div>
          </FormControl>
        </form>
      </Container>
    </>
  );
}

export default DevicePage;
