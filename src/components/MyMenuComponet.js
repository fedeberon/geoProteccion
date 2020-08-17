import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import { useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../store';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import t from '../common/localization';

const useStyles = makeStyles(theme => ({
  floatingButton: {
    position: 'absolute',
    zIndex: '1',
  },

  positionMenu: {
    position: 'relative',
    top: '160px',
    maxWidth: '14vw',
  },
  fixedDiv: {
    position: 'fixed',
  }

}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);




const MyMenuComponet = () => {


  const [openMenu, setOpenMenu] = useState(true);
  const [anchorEl, setAnchorEl] = useState();

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setOpenMenu(true);
    setAnchorEl(event.currentTarget);
  }

  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  const handleLogout = () => {
    fetch('/api/session', { method: 'DELETE' }).then(response => {
      if (response.ok) {
        dispatch(sessionActions.authenticated(false));
        history.push('/login');
      }
    })
  }

  return (
    <>
      <Fab variant="extended" aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenu} className={classes.floatingButton}>
        <MenuIcon />

      </Fab>
      <div className={classes.fixedDiv}>

      </div>
      <StyledMenu
        className={classes.positionMenu}
        id="simple-menu"
        keepMounted
        open={openMenu}
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
      >
        <StyledMenuItem onClick={handleCloseMenu}>
          <ListItemText primary={t('settingsUser')} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenu} >
          {t('sharedDevice')}
        </StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenu}>
          <ListItemText primary={t('settingsGroups')} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenu}>
          <ListItemText primary={t('geozones')} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenu}>
          <ListItemText primary={t('sharedNotifications')} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenu}>
          <ListItemText primary={t('sharedCalendars')} />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleCloseMenu}>
          <ListItemText primary={t('sharedMaintenance')} />
        </StyledMenuItem>
        <ListItem>
          <Button color="inherit" onClick={handleLogout}>{t('loginLogout')}</Button>
        </ListItem>
      </StyledMenu>
    </>
  );
}
export default MyMenuComponet;