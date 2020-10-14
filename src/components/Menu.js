import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MoreIcon from '@material-ui/icons/More';

import {modalsActions} from "../store";
import {useDispatch, useSelector} from "react-redux";
import { isWidthUp } from '@material-ui/core';
import { getBreakpointFromWidth } from '../utils/functions';

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
          key='search'
          icon={<MoreIcon/>}
          tooltipTitle='Menu'
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            handleVisibilityModal('menu')
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

        <SpeedDialAction
          key='devices'
          icon={<LocationOnIcon/>}
          tooltipTitle='Devices'
          tooltipOpen
          onClick={e => {
            e.stopPropagation();
            handleVisibilityModal('search')
          }}
          tooltipPlacement={isViewportDesktop ? 'right' : 'left'}
        />

      </SpeedDial>
    </div>
  );
}
