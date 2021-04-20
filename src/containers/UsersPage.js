import React, {useEffect, useState} from 'react';
import {TableContainer} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as service from "../utils/serviceManager";
import {useSelector} from "react-redux";
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Paper from '@material-ui/core/Paper';
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeviceConfigFull from "../components/DeviceConfigFull";

const drawerWidth = 285;

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'hidden',
    height: '100%',
    overflowX: 'hidden',
    paddingBottom: '1%',
    backgroundColor: "revert",
    [theme.breakpoints.up('md')]: {
      width: '100%',
      height: '100%',
      overflowY: 'hidden',
      flexGrow: 1,
    },
  },
  buttonFunctions: {
    minWidth: '48px !important',
  },
  formControl: {
    width: '229px',
    minWidth: 120,
  },
  rowAtri: {
    width: '40px',
    padding: '1px',
    textAlign: 'center',
    paddingRight: '1px !important',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  seleCheckinctEmpty: {
    marginTop: theme.spacing(2),
  },
  rootGrid: {
    flexGrow: 1,
    maxWidth: 752,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    zIndex: '1 !important',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      height: '100%',
      overflowY: 'hidden',
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
  drawerOpen: {
    height: "78.5%",
    width: "17%",
    top: "10.6%",
    borderRadius: "6px",
    zIndex: "1",
    display: "inline",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      top: "14.6%",
      height: "85.3%",
    },
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  dataGrid: {
    width: "100%",
    height: "80%",
    margin: "0px 40px",
    padding: "0px 29px",
    paddingTop: "1%",
    backgroundColor: "white",
    [theme.breakpoints.up('md')]: {
      height: '86%',
      width: '60%', 
      margin: '0 auto',
      paddingTop: 0,
    },
  },
  demoGrid: {
    backgroundColor: theme.palette.background.paper,
  },
}))

const UsersPage = () => {
  const user = useSelector((state) => state.session.user);
  const classes = useStyles();
  // const [variable, setVariable] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(false);
  const [openFullDialog, setOpenFullDialog] = useState(false);
  const [type, setType] = useState("");
  const [userIdSelected, setUserIdSelected] = useState();
  const rows = [];

  const getUsers = async () => {
    const response = await service.getUsers();
    setUsers(response);
  };

  useEffect(() => {
    getUsers();
  },[]);

  const columns = [
    { field: 'name', headerName: `${t(`sharedName`)}`, width: 150 },
    { field: 'email', headerName: `${t(`userEmail`)}`, width: 230 },
    { field: 'administrator', headerName: `${t(`userAdmin`)}`, width: 150 },
    { field: 'disabled', headerName: `${t(`sharedDisabled`)}`, width: 150 },
  ];
  
  try {
    users && users.map((user) => {
      rows.push({
        id: user.id,
        name: user.name,
        email: user.email,
        administrator: `${t(`${Boolean(user.administrator)}`)}`,
        disabled: `${t(`${Boolean(user.disabled)}`)}`
      });
    });
  } catch (error) {
    console.error(error);
  };   

  const handleRowSelection = (e) => {
    let selection = rows.find((r) => r.id === e.data.id);
    setUserSelected(true);
    setUserIdSelected(selection.id);
    console.log("User selected: ", selection.id);
  }

  useEffect(()=> {
    console.log(userSelected);
  },[userSelected]);

  const handleOpenFullDialog = (parametro, deviceId) => {
    setOpenFullDialog(true);
    setType(parametro);
  };

  const handleCloseFullDialog = () => {
    setOpenFullDialog(false);
  };

  const variable = {
    geocerca: "sharedGeofences",
    device: "deviceTitle",
    group: "settingsGroups",
    notification: "sharedNotifications",
    atrCalculados: "sharedComputedAttributes",
    comGuardados: "sharedSavedCommands",
    mantenimiento: "sharedMaintenance",
  };

  useEffect(()=> {
    console.log(user);
  },[user])

  return (
         <div className={classes.root}>
            <div className="title-section-users">
              <h2>{t('settingsUsers')}</h2>
              <Divider/>
            </div>
            <div className={classes.dataGrid}>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                })}
                classes={{
                  paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                  }),
                }}
              >
                <Divider />
                <List>                 
                    <LightTooltip title={`${t(`sharedAdd`)}`}>
                      <ListItem button key={"add"}>
                        <ListItemIcon>
                          <AddIcon/>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedAdd`)}`} />}
                      </ListItem>
                    </LightTooltip>
                    <LightTooltip title={`${t(`sharedEdit`)}`}>
                      <ListItem disabled={!userSelected} button key={"edit"}>
                        <ListItemIcon>
                          <EditIcon/>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedEdit`)}`} />}
                      </ListItem>
                    </LightTooltip>
                    <LightTooltip title={`${t(`sharedRemove`)}`}>
                      <ListItem disabled={!userSelected} button key={"remove"}>
                        <ListItemIcon>
                          <DeleteOutlineIcon/>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedRemove`)}`} />}
                      </ListItem>
                    </LightTooltip>                  
                </List>
                <Divider />
                <List>                  
                  <LightTooltip title={`${t(`sharedGeofences`)}`}>
                      <ListItem disabled={!userSelected} onClick={() => handleOpenFullDialog(variable.geocerca)} button key={"geofences"}>
                        <ListItemIcon>
                          <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-street-view" />
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedGeofences`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`deviceTitle`)}`}>
                      <ListItem disabled={!userSelected} onClick={() => handleOpenFullDialog(variable.device)} button key={"devices"}>
                        <ListItemIcon>
                          <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-car" />
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`deviceTitle`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`settingsGroups`)}`}>
                      <ListItem disabled={!userSelected} onClick={() => handleOpenFullDialog(variable.group)} button key={"geofences"}>
                        <ListItemIcon>
                          <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-object-group"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`settingsGroups`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`settingsUsers`)}`}>
                      <ListItem disabled={!userSelected || user.userLimit === 0}  button key={"users"}>
                        <ListItemIcon>
                        <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-users"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`settingsUsers`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`sharedNotifications`)}`}>
                      <ListItem disabled={!userSelected} onClick={() => handleOpenFullDialog(variable.notification)} button key={"notifications"}>
                        <ListItemIcon>
                          <i style={{paddingLeft: "5%", fontSize: "18px"}} className="far fa-comment-alt"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedNotifications`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`sharedCalendars`)}`}>
                      <ListItem disabled={true} /*!userSelected*/ onClick={() => openUsersAssignments()} button key={"calendars"}>
                        <ListItemIcon>
                          <i style={{paddingLeft: "5%", fontSize: "18px"}} className="far fa-calendar-alt"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedCalendars`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`sharedComputedAttributes`)}`}>
                      <ListItem disabled={true} /*!userSelected*/  button key={"comp-attributes"}>
                        <ListItemIcon>
                        <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-tasks"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedComputedAttributes`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`sharedDrivers`)}`}>
                      <ListItem disabled={true} /*!userSelected*/  button key={"drivers"}>
                        <ListItemIcon>
                        <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-key"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedDrivers`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                    <LightTooltip title={`${t(`sharedSavedCommands`)}`}>
                      <ListItem disabled={true} /*!userSelected*/   button key={"savedcommands"}>
                        <ListItemIcon>
                        <i style={{paddingLeft: "5%", fontSize: "18px"}} className="fas fa-download"></i>
                        </ListItemIcon>
                        {window.innerWidth > 960 &&
                        <ListItemText primary={`${t(`sharedSavedCommands`)}`} />}
                      </ListItem>
                    </LightTooltip> 
                </List>
              </Drawer>
              <DataGrid
                  component={Paper}
                  rows={rows} 
                  columns={columns} 
                  pageSize={8} 
                  rowHeight={42}
                  hideFooterSelectedRowCount={true}
                  checkboxSelection={false}
                  onRowSelected={handleRowSelection}
              />
              </div>
              <div>
                <DeviceConfigFull
                  open={openFullDialog}
                  close={handleCloseFullDialog}
                  type={type}
                  userId={userIdSelected}
                />
              </div>
              {/* <div>
                <UsersAssignments 
                open={openFullDialog}
                close={closeUsersAssignments}/>
              </div> */}
          </div>   
  );
}

export default UsersPage;

