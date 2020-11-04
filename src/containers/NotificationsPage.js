import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
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
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {DeleteTwoTone} from "@material-ui/icons";
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

  root: {
    overflowY: 'scroll',
    height: '100%',
    overflowX: 'hidden',
    paddingBottom: '15%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      paddingTop: '5%',
      paddingRight: '15%',
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
  table: {
    minWidth: 650,
  },
}));

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
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [confirm, setConfirm] = React.useState(false);
  const [idToRemove, setIdToRemove] = React.useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpenConfirm = (param) => {
    setOpenConfirm(true);
    setIdToRemove(param)
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  function getNotifications() {
    fetch(`api/notifications?userId=${userId}`)
      .then(response => response.json())
      .then(data => setNotifications(data))
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
    <div>
      <div style={{marginTop: '5%'}} className="title-section">
        <h2>{t('sharedNotifications')}</h2>
        <Divider/>
      </div>
      {/*<button type="button "onClick={getNotificationsByUserId}>Obtener notif</button>*/}
      <ButtonGroup variant="text" color="default" aria-label="text primary button group">
        <Button>Agregar Notificacion </Button>
        <Button>Editar Notificacion</Button>
        <Button>Eliminar Notificacion</Button>
      </ButtonGroup>
      <div className={classes.root}>
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
            <Tab onClick={getNotifications} label="By User ID" {...a11yProps(0)} />
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
                      <TableCell align="center">{`${Boolean(notification.always)}`}</TableCell>
                      <TableCell align="center">Undefined</TableCell>
                      <TableCell align="center">{notification.notificators}</TableCell>
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
      </div>

      {/*Dialog to confirm remove*/}
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={openConfirm}
          onClose={handleCloseConfirm}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Eliminar notificación?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseConfirm} color="primary">
              Cancelar
            </Button>
            <Button color="primary" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
