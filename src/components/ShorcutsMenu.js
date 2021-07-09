import React, { memo, useState, useEffect } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import t from "../common/localization";
import { useDispatch, useSelector, shallowEqual} from "react-redux";
import DeviceSearch from "./DeviceSearch";
import Badge from "@material-ui/core/Badge";
import { notificationActions } from "../store";
import shortcutsMenuStyles from "./styles/ShortcutsMenuStyles";

const useStyles = shortcutsMenuStyles;

const ShortcutsMenu = memo(({toggleGeozones,showReportDialog,setDeviceFollow,showNotificationsDialog}) => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop, shallowEqual
  );
  const notifications = useSelector((state) => state.notification.items, shallowEqual);
  const [showShortcutMenu, setShowShortcutMenu] = useState(isViewportDesktop);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [onFollow, setOnFollow] = useState(false);
  const deviceSelected = useSelector((state) => state.devices.selectedDevice, shallowEqual);

  const handleShowShortcutMenu = () => {
    setShowShortcutMenu(!showShortcutMenu);
  };

  const handleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isNotificationOpen) {
      dispatch(notificationActions.remove());
    }
  };

  return (
    <div className={classes.root}>
      {showShortcutMenu && (
        <>
          <Backdrop open={false} />
          {notifications.length > 0 ? (
            <Badge badgeContent={notifications.length} color="secondary">
              <SpeedDial
                ariaLabel="Notifications"
                title={t("sharedNotifications")}
                style={{maxHeight: '80px'}}
                className={classes.speedDial}
                icon={<i className="fas fa-bell fa-lg" />}
                direction={isViewportDesktop ? "down" : "up"}
                open={false}
                onClick={() => {
                  showNotificationsDialog();
                  handleNotifications();
                }}
              />
            </Badge>
          ) : (
            <SpeedDial
              ariaLabel="Notifications"
              title={t("sharedNotifications")}
              style={{maxHeight: '80px'}}
              className={classes.speedDialOpen}
              icon={<i className="fas fa-bell fa-lg" />}
              direction={isViewportDesktop ? "down" : "up"}
              open={false}
            />
          )}
          <SpeedDial
            ariaLabel="deviceFollow"
            title={onFollow ? t("") : t("deviceFollow")}
            className={classes.speedDial}
            style={{maxHeight: '80px'}}
            icon={<i style={{color: onFollow ? '#ff2121' : ''}} className="fas fa-search-location fa-lg"></i>}
            direction={isViewportDesktop ? "down" : "up"}
            open={false}            
            onClick={() => {
              if(deviceSelected !== null){
                setOnFollow(!onFollow);
                setDeviceFollow(deviceSelected, onFollow);
              }           
            }}
          />
          <SpeedDial
            ariaLabel="Reports"
            title={t("reportTitle")}
            style={{maxHeight: '80px'}}
            className={classes.speedDial}
            icon={<i className="fas fa-align-left fa-lg" />}
            direction={isViewportDesktop ? "down" : "up"}
            open={false}
            onClick={() => showReportDialog()}
          />
          <SpeedDial
            id="showGeozones"
            title={t("geozones")}
            ariaLabel="Geozones"
            style={{maxHeight: '80px'}}
            className={classes.speedDial}
            icon={<i className="fas fa-draw-polygon fa-lg" />}
            direction={isViewportDesktop ? "down" : "up"}
            open={false}
            onClick={() => toggleGeozones()}
          />
          <DeviceSearch />
        </>
      )}

      {!isViewportDesktop && (
        <SpeedDial
          id="showShortcut"
          open={false}
          ariaLabel="Notifications"
          title={t("sharedNotifications")}
          className={
            !showShortcutMenu ? classes.speedDial : classes.speedDialOpen
          }
          icon={
            !showShortcutMenu ? (
              <i className="fas fa-angle-down fa-lg" />
            ) : (
              <i className="fas fa-angle-up fa-lg" />
            )
          }
          direction={isViewportDesktop ? "down" : "up"}
          onClick={() => handleShowShortcutMenu()}
        />
      )}
    </div>
  );
});

export default ShortcutsMenu;
