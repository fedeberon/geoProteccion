import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import SaveIcon from "@material-ui/icons/Save";
import PrintIcon from "@material-ui/icons/Print";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import t from "../common/localization";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: "absolute",
    bottom: "1%",
    left: "50vw",
    right: "50vw",
    [theme.breakpoints.up("md")]: {
      top: "47%",
      left: "1%",
      right: "auto",
      bottom: "auto",
    },
  },
}));

export default function Menu({ layout }) {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop
  );

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Menu"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon icon={<MenuIcon />} openIcon={<CloseIcon />} />}
        open={open}
        direction={isViewportDesktop ? "down" : "up"}
        onClick={handleOpen}
      >
        <SpeedDialAction
          key="account"
          icon={<i className="fas fa-user-circle fa-lg" />}
          tooltipTitle={t("settingsUser")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/account");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "right"}
        />

        <SpeedDialAction
          key="devices"
          icon={<i className="fas fa-map-marker-alt fa-lg" />}
          tooltipTitle={t("deviceTitle")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/device/list");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "right"}
        />

        <SpeedDialAction
          key="groups"
          icon={<i className="fas fa-object-group fa-lg" />}
          tooltipTitle={t("settingsGroups")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/groups");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "right"}
        />

        <SpeedDialAction
          key="notifications"
          icon={<i className="fas fa-bell fa-lg" />}
          tooltipTitle={t("sharedNotifications")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/notifications");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "top"}
        />

        <SpeedDialAction
          key="geozones"
          icon={<i className="fas fa-draw-polygon fa-lg" />}
          tooltipTitle={t("geozones")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/geozones");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "top"}
        />

        <SpeedDialAction
          key="calendars"
          icon={<i className="fas fa-calendar-alt fa-lg" />}
          tooltipTitle={t("sharedCalendars")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/calendars");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "left"}
        />

        <SpeedDialAction
          key="maintenance"
          icon={<i className="fas fa-tools fa-lg" />}
          tooltipTitle={t("sharedMaintenance")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/maintenance");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "left"}
        />

        <SpeedDialAction
          key="logout"
          icon={<i className="fas fa-sign-out-alt fa-lg" />}
          tooltipTitle={t("loginLogout")}
          tooltipOpen={!isViewportDesktop}
          onClick={(e) => {
            e.stopPropagation();
            history.push("/logout");
          }}
          tooltipPlacement={isViewportDesktop ? "right" : "left"}
        />
      </SpeedDial>
    </div>
  );
}
