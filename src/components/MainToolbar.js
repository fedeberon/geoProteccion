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
    width: 150,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menu: {
    margin: 30
  }

}));

const MainToolbar = ({ history, visible }) => {
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(true);
  const classes = useStyles();
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
    visible ?
    <>
      <Drawer open={drawer} onClose={closeDrawer} variant={"permanent"} >
        <div className={classes.zIndezModal}
          tabIndex={0}
          className={classes.list}
          role="button"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}>
          <List>
            <ListItem button onClick={() => history.push('/')}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={t('mapTitle')} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={() => history.push('/account')}>
              <ListItemText primary={t('settingsUser')} />
            </ListItem>
            <ListItem button onClick={() => history.push('/device/list')}>
              <ListItemText primary={t('sharedDevice')} />
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
      <PopupInfo open={openPopup} handleDialog={handleDialog}></PopupInfo>
      <Tabla open={openTable} handleTable={handleTable}></Tabla>
    </>
    :
    <>
    </>
  );
}

export default MainToolbar;
