import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import t from "../common/localization";
import { useDispatch, useSelector } from "react-redux";
import DeviceSearch from "./DeviceSearch";
import Badge from "@material-ui/core/Badge";
import { notificationActions } from "../store";
import shortcutsMenuStyles from "./styles/ShortcutsMenuStyles";

const useStyles = shortcutsMenuStyles;

export default function ShortcutsMenu({
  toggleGeozones,
  showReportDialog,
  setDeviceFollow,
  showNotificationsDialog,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop
  );
  const notifications = useSelector((state) => state.notification.items);
  const [showShortcutMenu, setShowShortcutMenu] = useState(isViewportDesktop);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [onFollow, setOnFollow] = useState(false);
  const deviceSelected = useSelector((state) => state.devices.selectedDevice);

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
            icon={<i style={{color: onFollow ? '#ff2121' : ''}} className="fas fa-search-location fa-lg"></i>}
            direction={isViewportDesktop ? "down" : "up"}
            open={false}            
            onClick={() => {
              if(deviceSelected !== null){
                setOnFollow(!onFollow);
                setDeviceFollow(deviceSelected, onFollow);
              } else {
              }             
            }}
          />
          <SpeedDial
            ariaLabel="Reports"
            title={t("reportTitle")}
            className={classes.speedDial}
            icon={<i className="fas fa-align-left fa-lg" />}
            direction={isViewportDesktop ? "down" : "up"}
            open={false}
            onClick={() => showReportDialog()}
          />
          <SpeedDial
            ariaLabel="Geofences"
            title={t("geozones")}
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
}
