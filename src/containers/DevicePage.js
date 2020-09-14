import React, { useEffect, useState } from 'react';
import MainToolbar from '../components/MainToolbar';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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

import t from '../common/localization';

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
  DivicePageSize : {
    float: 'right',
    width:'75%',
    marginRight: '5%',
    marginTop: '6%',
  }
}));


function createData(Id, Name, Uniqueld, Status, Disable, lastUpdate, Positionid, Groupid, Phone, Contact, Category, Geofenceids, Attributes, ) {
  return { Id, Name, Uniqueld, Status, Disable, lastUpdate, Positionid, Groupid, Phone, Contact, Category, Geofenceids, Attributes, };
}


const rows = [
  createData("", "", ),
  createData("Name:", "", ),
  createData("Uniqueld:", "",),
  createData("Status:", "", ),
  createData("Disable:", "", ),
  createData("lastUpdate:", "", ),
  createData("Positionid:", "", ),
  createData("Groupid:", "", ),
  createData("Phone:", "",),
  createData(" Model", "",),
  createData("Contact:", "",),
  createData("Category:", "",),
  createData("Geofenceids:", "", ),
  createData("Attributes", "",),
];

const DevicePage = () => {
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [device, setDevice] = useState();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  useEffect(() => {
    fetch(`/api/devices/${id}`).then(response => {
      if (response.ok) {
        response.json().then(setDevice);
      }
    });
  }, [id]);

  const handleSave = () => {
    const updatedDevice = id ? device : {};
    updatedDevice.name = name || updatedDevice.name;
    updatedDevice.uniqueId = uniqueId || updatedDevice.uniqueId;

    let request;
    if (id) {
      request = fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDevice),
      });
    } else {
      request = fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <MainToolbar history={history} />
        <div className={classes.DivicePageSize}>
    
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Uniqueld</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Disable</TableCell>
                  <TableCell align="right">lastUpdate</TableCell>
                  <TableCell align="right">Positionid</TableCell>
                  <TableCell align="right">Groupid</TableCell>
                  <TableCell align="right">Phone</TableCell>
                  <TableCell align="right">Contact</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Geofenceids</TableCell>
                  <TableCell align="right">Attributes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.field}
                    </TableCell>
                    <TableCell align="left">{row.Name}</TableCell>
                    <TableCell align="left">{row.Uniqueld}</TableCell>
                    <TableCell align="left">{row.Status}</TableCell>
                    <TableCell align="left">{row.Disable}</TableCell>
                    <TableCell align="left">{row.lastUpdate}</TableCell>
                    <TableCell align="left">{row.Positionid}</TableCell>
                    <TableCell align="left">{row.Groupid}</TableCell>
                    <TableCell align="left">{row.Phone}</TableCell>
                    <TableCell align="left">{row.Contact}</TableCell>
                    <TableCell align="left">{row.Category}</TableCell>
                    <TableCell align="left">{row.Geofenceids}</TableCell>
                    <TableCell align="left">{row.Attributes}</TableCell>
                  </TableRow>
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
              variant="filled" />
          }
          {(!id || device) &&
            <TextField
              margin="normal"
              fullWidth
              defaultValue={device && device.uniqueId}
              onChange={(event) => setUniqueId(event.target.value)}
              label={t('deviceIdentifier')}
              variant="filled" />
          }
          <FormControl fullWidth margin="normal">
            <div className={classes.buttons}>
              <Button type="button" color="primary" variant="outlined" onClick={() => history.goBack()}>
                {t('sharedCancel')}
              </Button>
              <Button type="button" color="primary" variant="contained" onClick={handleSave}>
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
