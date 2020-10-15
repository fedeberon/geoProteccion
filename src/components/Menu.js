import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import t from '../common/localization';

import {modalsActions} from "../store";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    bottom: '1%',
    left: '50vw',
    right: '50vw',
    [theme.breakpoints.up('md')]: {
      top: '1%',
      left: '1%',
      right: 'auto',
      bottom: 'auto'
    },
  }
}));

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <FavoriteIcon />, name: 'Like' },
];

export default function Menu() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);

  const handleVisibilityModal = (name) => {
    dispatch(modalsActions.show(name));
  }

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Menu"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon icon={<MenuIcon/>} openIcon={<CloseIcon/>}/>}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction={isViewportDesktop ? 'down' : 'up'}
      >

        <SpeedDialAction
          key='account'
          icon={<i class="fas fa-user-circle fa-lg"/>}
          tooltipTitle={t('settingsUser')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/account');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='devices'
          icon={<i class="fas fa-map-marker-alt fa-lg"/>}
          tooltipTitle={t('deviceTitle')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/device/list');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='groups'
          icon={<i class="fas fa-object-group fa-lg"/>}
          tooltipTitle={t('settingsGroups')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/groups');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='geozones'
          icon={<i class="fas fa-draw-polygon fa-lg"/>}
          tooltipTitle={t('geozones')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/geozones');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='notifications'
          icon={<i class="fas fa-bell fa-lg"/>}
          tooltipTitle={t('sharedNotifications')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/notifications');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='calendars'
          icon={<i class="fas fa-calendar-alt fa-lg"/>}
          tooltipTitle={t('sharedCalendars')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/calendars');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='maintenance'
          icon={<i class="fas fa-tools fa-lg"/>}
          tooltipTitle={t('sharedMaintenance')}
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            history.push('/maintenance');
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />
      </SpeedDial>
    </div>
  );
}
