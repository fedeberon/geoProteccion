import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import * as service from "../utils/serviceManager";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import t from "../common/localization";
import { DataGrid } from '@material-ui/data-grid';
import {useSelector} from "react-redux";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
      backgroundColor: theme.palette.background.paper,
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
  dataGrid: {
    height: '77%', 
    width: '100%', 
    margin: '0 auto', 
    paddingTop: '1%' ,
    [theme.breakpoints.up('md')]: {
      height: '80%',
      width: '60%', 
      margin: '0 auto',
    },
  },
  demoGrid: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    zIndex: '1 !important',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    top: '10.6%',
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    minHeight: '35px !important',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state) => state.session.user.id);
  const [variable, setVariable] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState()
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
        administrator: Boolean(user.administrator),
        disabled: Boolean(user.disabled)
      });
    });
  } catch (error) {
    console.error(error);
  };   

  const handleRowSelection = (e) => {

    let selection = rows.find((r) => r.id === e.data.id);
    setUserSelected(selection)
    console.log("User selected: ", selection.id);
  }

  useEffect(()=> {
    console.log(userSelected);
  },[userSelected])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
          {t('settingsUsers')}
          </Typography>
        </Toolbar>
      </AppBar> */}
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
        {/* <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div> */}
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
          <div className={classes.dataGrid}>
              <DataGrid 
                  rows={rows} 
                  columns={columns} 
                  pageSize={8} 
                  rowHeight={42}
                  loading={variable}
                  checkboxSelection={false}
                  onRowSelected={handleRowSelection}
            />
            </div>
      
    </div>
  );
}