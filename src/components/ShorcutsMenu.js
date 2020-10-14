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
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from "@material-ui/icons/Search";
import DescriptionIcon from "@material-ui/icons/Description";
import GeofenceIcon from "@material-ui/icons/BlurCircular";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import {modalsActions} from "../store";
import {useDispatch, useSelector} from "react-redux";
import { IconButton, InputBase, isWidthUp, Paper } from '@material-ui/core';
import { getBreakpointFromWidth } from '../utils/functions';

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
  paper: {
    padding: "4px 4px",
    display: "flex",
    alignItems: "center",
    width: '76%',
    height: '50px',
    marginTop: '3%',
    marginLeft: '3%',
    position: 'fixed',
    left: '0px',
    [theme.breakpoints.up('md')]: {
      position: 'unset',
      marginTop: '1%',
    },
  },
  speedDial: {
    marginLeft: '8px',
  },
  speedDialOpen: {
    marginLeft: '8px',
    opacity: '60%'
  },
  iconButton: {
    padding: 10
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
            icon={<SpeedDialIcon icon={<Notifications/>}/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <SpeedDial
            ariaLabel="Forms"
            title="forms"
            className={classes.speedDial}
            icon={<SpeedDialIcon icon={<DescriptionIcon/>}/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <SpeedDial
            ariaLabel="Geofences"
            title="geofences"
            className={classes.speedDial}
            icon={<SpeedDialIcon icon={<GeofenceIcon/>}/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <Paper component="form" className={classes.paper}>
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="Buscar"
              inputProps={{ "aria-label": "search google maps" }}
            />
          </Paper>
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
