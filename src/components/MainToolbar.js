import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../store';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';

import t from '../common/localization';
import PopupInfo from '../components/PopupInfo';
import Tabla from '../components/Tabla';

const useStyles = makeStyles(theme => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },

  list: {
    width: 250
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}));

const MainToolbar = () => {
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [ openPopup, setOpenPopup ] = useState(false);
  const [ openTable, setOpenTable ] = useState (false); 

  const openDrawer = () => { setDrawer(true) }
  const closeDrawer = () => { setDrawer(false) }

  const handleLogout = () => {
    fetch('/api/session', { method: 'DELETE' }).then(response => {
      if (response.ok) {
        dispatch(sessionActions.authenticated(false));
        history.push('/login');
      }
    })
  }

  const handleDialog = () => {
    setOpenPopup(!openPopup);
  }

  const handleTable = () => {
    setOpenTable(!openTable);
  }
  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            onClick={openDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Traccar
        </Typography>
          <Button onClick={handleDialog}>Apretame ;)</Button>
          <Button onClick={handleTable}>Tablita</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={drawer} onClose={closeDrawer}>
        <div className={classes.zIndezModal}
          tabIndex={0}
          className={classes.list}
          role="button"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}>
          <List>
            <ListItem button onClick={() => history.push('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={t('mapTitle')} />  
            </ListItem>
          </List>
          <List>
            <ListItem button disabled>
              <ListItemText primary={t('settingsUser')} />
            </ListItem>
            <ListItem button>
              <ListItemText primary={t('sharedDevice')} />
            </ListItem>
            <ListItem button>
              <ListItemText primary={t('settingsGroups')} />
            </ListItem>
            <ListItem button>
              <ListItemText primary={t('geozones')} />
            </ListItem>
            <ListItem button>
              <ListItemText primary={t('sharedNotifications')} />
            </ListItem>
            <ListItem button>
              <ListItemText primary={t('sharedCalendars')} />
            </ListItem>
            <ListItem button>
              <ListItemText primary={t('sharedMaintenance')} />
            </ListItem>
            <Divider />
            <ListItem>
              <Button color="inherit" onClick={handleLogout}>{t('loginLogout')}</Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <PopupInfo open={openPopup} handleDialog={handleDialog}></PopupInfo>
      <Tabla open={openTable} handleTable={handleTable}></Tabla>
    </>
  );
}

export default MainToolbar;
