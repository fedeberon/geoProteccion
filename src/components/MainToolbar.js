import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useDispatch} from 'react-redux';
import {sessionActions} from '../store';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import t from '../common/localization';
import { useHistory } from 'react-router-dom';
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles(theme => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  list: {
    width: 150,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menu: {
    margin: 30
  },
  titlePage: {
    backgroundColor: 'cadetblue',
    backgroundImage: 'linear-gradient(25deg, #2dc6d4 0%, #1c2939 100%)',
    boxShadow: 'rgba(102, 97, 102, 0.8) 0px 0px 15px 5px',
    display: 'inline-flex', justifyContent: 'space-between',
    position: 'absolute',
    bottom: '0',
    zIndex: '2',
    width: '100%',
    padding: '2%',
    [theme.breakpoints.up('md')]: {
      top: 0,
      height: 'fit-content',
      padding: '10px',
    },
  },
}));

const MainToolbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(true);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const closeDrawer = () => { setAnchorEl(false) }

  const handleLogout = () => {
    fetch('/api/session', { method: 'DELETE' }).then(response => {
      if (response.ok) {
        dispatch(sessionActions.authenticated(false));
        history.push('/login');
      }
    })
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={classes.titlePage}>
        <div style={{display: 'flex'}}>
          <Button style={{display: 'contents'}}
                  variant="contained"
                  onClick={() => history.push('/')}
                  color="primary"
                  size="small"
                  className={classes.button}
                  startIcon={<MapIcon />}>Ir a Mapa
          </Button>
        </div>
        <div style={{display: 'flex'}}>
          <Button
            aria-controls="fade-menu"
            aria-haspopup="true"
            onClick={handleClick}
            style={{display: 'contents'}}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<HomeIcon />}>
            Menu
          </Button>
        </div>
      </div>
      <Drawer anchor={"right"}
              open={openMenu}
              onClose={closeDrawer}
              variant={"temporary"}
              anchorEl={anchorEl}>
        <div
          tabIndex={0}
          className={classes.list}
          role="button"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
          style={{color: 'white'}}>
          <List>
            <ListItem button onClick={() => history.push('/account')}>
              <ListItemText primary={t('settingsUser')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/device/list')}>
              <ListItemText primary={t('deviceTitle')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/groups')}>
              <ListItemText primary={t('settingsGroups')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/geozones')}>
              <ListItemText primary={t('geozones')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/notifications')}>
              <ListItemText primary={t('sharedNotifications')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/calendars')}>
              <ListItemText primary={t('sharedCalendars')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/maintenance')}>
              <ListItemText primary={t('sharedMaintenance')} />
            </ListItem>
            <Divider />
            <ListItem>
              <Button color="inherit" onClick={handleLogout}>{t('loginLogout')}</Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default MainToolbar;
