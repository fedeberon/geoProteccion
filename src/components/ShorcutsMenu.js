import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import t from '../common/localization';

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

export default function ShortcutsMenu() {
  const classes = useStyles();
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
            title={t("sharedNotifications")}
            className={classes.speedDial}
            icon={<i className="fas fa-bell fa-lg"/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <SpeedDial
            ariaLabel="Reports"
            title={t("reportTitle")}
            className={classes.speedDial}
            icon={<i className="fas fa-align-left fa-lg"/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <SpeedDial
            ariaLabel="Geofences"
            title={t("geozones")}
            className={classes.speedDial}
            icon={<i className="fas fa-draw-polygon fa-lg"/>}
            direction={isViewportDesktop ? 'down' : 'up'}
            open={false}
          />
          <DeviceSearch/>
        </>
      }

      { !isViewportDesktop &&
        <SpeedDial
          ariaLabel="Notifications"
          title={t("sharedNotifications")}
          className={!showShortcutMenu ? classes.speedDial : classes.speedDialOpen }
          icon={!showShortcutMenu ? <i className="fas fa-angle-down fa-lg"/> : <i className="fas fa-angle-up fa-lg"/>}
          direction={isViewportDesktop ? 'down' : 'up'}
          onClick={() => handleShowShortcutMenu()}
        />
      }
    </div>
  );
}
