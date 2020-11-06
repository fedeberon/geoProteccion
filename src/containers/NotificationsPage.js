import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import * as service from "../utils/serviceManager";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {useSelector} from "react-redux";
import Divider from "@material-ui/core/Divider";
import t from "../common/localization";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import {DeleteTwoTone, Label} from "@material-ui/icons";
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useTheme from "@material-ui/core/styles/useTheme";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({

  root: {
    overflowY: 'scroll',
    height: '100%',
    overflowX: 'hidden',
    paddingBottom: '5%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
  table: {
    minWidth: 650,
  },
  formControlType: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chipsTypes: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chipTypes: {
    margin: 2,
  },
  noLabelTypes: {
    marginTop: theme.spacing(3),
  },
}));

const styles = (theme) => ({
  rootNotification: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

export default function NotificationsPage() {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const userId = useSelector((state) => state.session.user.id);
  const [notifications, setNotifications] = React.useState([])
  const theme = useTheme();
  const [idToRemove, setIdToRemove] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState('');
  const [always, setAlways] = useState(false);
  const [notificators, setNotificators] = useState('')
  const typesList = [
    `${t('eventDeviceUnknown')}`,
    `${t('eventDeviceOnline')}`,
    `${t('eventTextMessage')}`,
    `${t('eventDeviceFuelDrop')}`,
    `${t('eventDeviceOverspeed')}`,
    `${t('eventGeofenceEnter')}`,
    `${t('eventGeofenceExit')}`,
    `${t('eventCommandResult')}`,
    `${t('eventMaintenance')}`,
    `${t('eventDriverChanged')}`,
    `${t('eventDeviceOffline')}`,
    `${t('eventIgnitionOff')}`,
    `${t('eventIgnitionOn')}`,
    `${t('eventDeviceMoving')}`,
    `${t('eventDeviceStopped')}`,
    `${t('eventAlarm')}`,
  ]

  const typesValues = [
    'DeviceUnknown',
    'DeviceOnline',
    'TextMessage',
    'DeviceFuelDrop',
    'DeviceOverspeed',
    'GeofenceEnter',
    'GeofenceExit',
    'CommandResult',
    'Maintenance',
    'DriverChanged',
    'DeviceOffline',
    'IgnitionOff',
    'IgnitionOn',
    'DeviceMoving',
    'DeviceStopped',
    'Alarm',
  ]


  const handleAlwaysChecked = () => {
    setAlways(!always);
  }

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeChannel = (event) => {
    setNotificators(event.target.value);
  }

  const getChannel = () => {
  }

  const handleOpenNotification = () => {
    setOpen(true);
  };

  const handleCloseNotification = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getNotifications = async (userId) => {
    const response = await service.getNotificationsByUserId(userId);
    setNotifications(response);
    getNotifications(userId);
  }

  const postNotifications = () => {
      const addNotification = {}
        addNotification.type = type;
        addNotification.always = always;
        addNotification.notificators = notificators;

        console.log(JSON.stringify(addNotification))

        fetch(`api/notifications?userId=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(addNotification)
        }).then(response => console.log(response))
    getNotifications(userId);
    handleCloseNotification();
  }

  // const removeConfirm = () => {
  //   setConfirm(true);
  //   if(confirm){
  //     fetch(`api/notifications/${idToRemove}`, {method: 'DELETE'})
  //       .then(response => {
  //         if(response.ok){
  //           const getNotifications = async (userId) => {
  //             const response = await service.getNotificationsByUserId(userId);
  //             setNotifications(response);
  //           }
  //           getNotifications(userId);
  //         }
  //       })
  //   }
  //   handleCloseConfirm()
  // }


  return (
    <div className={classes.root}>
      <div style={{marginTop: '5%'}} className="title-section">
        <h2>{t('sharedNotifications')}</h2>
        <Divider/>
      </div>
      <Button style={{margin: '10px 0px'}} type="button" color="primary"
              variant="outlined"
              onClick={handleOpenNotification}>
        <AddIcon color="primary"/>
        Crear nueva notificacion
      </Button>

        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab onClick={() => getNotifications(userId)}
                 label="By User ID" {...a11yProps(0)} />
            <Tab label="By Device ID" {...a11yProps(1)} />
            <Tab label="By Group ID" {...a11yProps(2)} />
            <Tab label="All Notifications" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Tipo de notificacion</TableCell>
                    <TableCell align="center">Todos los dispositivos</TableCell>
                    <TableCell align="center">Alarma</TableCell>
                    <TableCell align="center">Canales</TableCell>
                    <TableCell align="center"/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{notification.id}</TableCell>
                      <TableCell align="center">{notification.type}</TableCell>
                      <TableCell
                        align="center">{`${Boolean(notification.always)}`}</TableCell>
                      <TableCell align="center">Undefined</TableCell>
                      <TableCell
                        align="center">{notification.notificators}</TableCell>
                      <TableCell align="center">
                        <EditTwoToneIcon/>
                        <DeleteTwoTone/>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Four
        </TabPanel>
        <TabPanel value={value} index={4}>
          Item Five
        </TabPanel>
        <TabPanel value={value} index={5}>
          Item Six
        </TabPanel>
        <TabPanel value={value} index={6}>
          Item Seven
        </TabPanel>

      <div>
        {/*Modal Add New Notification*/}
        <Dialog onClose={handleCloseNotification}
                aria-labelledby="customized-dialog-title"
                open={open}>
          <DialogTitle id="customized-dialog-title"
                       onClose={handleCloseNotification}>
            {` Agregar nueva Notificacion `}
            <Button onClick={handleCloseNotification}>X</Button>
          </DialogTitle>

          <DialogContent dividers>
            <form className={classes.rootNotification} noValidate
                  autoComplete="off">
              <Table>
                <TableRow>
                  <TableCell>Tipo:</TableCell>
                  <TableCell>
                    <FormControl variant="outlined" className={classes.formControlType}>
                      <Select
                        native
                        value={type}
                        onChange={handleChangeType}
                      >
                        <option aria-label="None" value="" />
                        {typesValues.map((types, index) => (
                          <option key={index} value={types}>{types}</option>
                          ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              <TableRow>
                <TableCell>Aplicar a todos los dispositivos:</TableCell>
                <TableCell>
                  <Switch
                    onChange={handleAlwaysChecked}
                    name="all"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Canales:</TableCell>
                <TableCell>
                  <FormControl variant="outlined" className={classes.formControlType}>
                    <Select
                      native
                      value={notificators}
                      onChange={handleChangeChannel}
                    >
                      <option aria-label="None" value="" />
                      <option value='web'>Web</option>
                      <option value='correo'>Correo</option>
                      <option value='sms'>Sms</option>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              </Table>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNotification} autoFocus color="primary">
              {t('sharedCancel')}
            </Button>
            <Button onClick={postNotifications} autoFocus color="primary">
              {t('sharedSave')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
