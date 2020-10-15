import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Notifications from '@material-ui/icons/Notifications';
import DescriptionIcon from "@material-ui/icons/Description";
import GeofenceIcon from "@material-ui/icons/BlurCircular";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import {useDispatch, useSelector} from "react-redux";
import DeviceSearch from './DeviceSearch';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '0%',
    left: 'auto',
    right: '3%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      top: '1%',
      right: '1%',
      left: 'auto',
      flexDirection: 'unset',
    },
  },
  speedDial: {
    marginLeft: '8px',
  },
  speedDialOpen: {
    marginLeft: '8px',
    opacity: '60%'
  },
}));

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <FavoriteIcon />, name: 'Like' },
];

export default function ShortcutsMenu() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);
  const [ showShortcutMenu, setShowShortcutMenu ] = useState(isViewportDesktop);

  const handleShowShortcutMenu = () => {
    setShowShortcutMenu(!showShortcutMenu);
  }

  return (
    <div className={classes.root}>
      { showShortcutMenu &&
        <>
          <Backdrop open={false}/>
          <SpeedDial
            ariaLabel="Notifications"
            title="notifications"
            className={classes.speedDial}
            icon={<i class="fas fa-bell fa-lg"/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <SpeedDial
            ariaLabel="Forms"
            title="forms"
            className={classes.speedDial}
            icon={<i class="fas fa-align-left fa-lg"/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <SpeedDial
            ariaLabel="Geofences"
            title="geofences"
            className={classes.speedDial}
            icon={<i class="fas fa-draw-polygon fa-lg"/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <DeviceSearch/>
        </>
      }

      { !isViewportDesktop &&
        <SpeedDial
          ariaLabel="Notifications"
          title="notifications"
          className={!showShortcutMenu ? classes.speedDial : classes.speedDialOpen }
          icon={<SpeedDialIcon icon={!showShortcutMenu ? <ArrowDownIcon/> : <ArrowUpIcon/>}/>}
          direction={isViewportDesktop ? 'down' : 'up'}
          onClick={() => handleShowShortcutMenu()}
        />
      }
    </div>
  );
}
