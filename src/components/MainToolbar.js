import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sessionActions } from "../store";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MapIcon from "@material-ui/icons/Map";
import t from "../common/localization";
import { useHistory } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import mainToolbarStyles from "./styles/MainToolbarStyles";

const useStyles = mainToolbarStyles;

const MainToolbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(true);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(undefined);
  const openMenu = Boolean(anchorEl);

  const closeDrawer = () => {
    setAnchorEl(undefined);
  };

  const handleLogout = () => {
    fetch("/api/session", { method: "DELETE" }).then((response) => {
      if (response.ok) {
        dispatch(sessionActions.authenticated(false));
        history.push("/login");
      }
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <>
      <div className={classes.titlePage}>
        <div style={{ display: "flex" }}>
          <Button
            style={{ display: "contents" }}
            variant="contained"
            onClick={() => history.push("/")}
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<MapIcon />}
          >
            Ir a Mapa
          </Button>
        </div>
        <div style={{ display: "flex" }}>
          <Button
            aria-controls="fade-menu"
            aria-haspopup="true"
            onClick={handleClick}
            style={{ display: "contents" }}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<HomeIcon />}
          >
            Menu
          </Button>
        </div>
      </div>
      <Drawer
        anchor={"right"}
        open={openMenu}
        onClose={closeDrawer}
        variant={"temporary"}
        anchorel={anchorEl}
      >
        <div
          tabIndex={0}
          className={classes.list}
          role="button"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
          style={{ color: "white" }}
        >
          <List>
            <ListItem button onClick={() => history.push("/account")}>
              <ListItemText primary={t("settingsUser")} />
            </ListItem>
            <ListItem button onClick={() => history.push("/device/list")}>
              <ListItemText primary={t("deviceTitle")} />
            </ListItem>
            <ListItem button onClick={() => history.push("/groups")}>
              <ListItemText primary={t("settingsGroups")} />
            </ListItem>
            <ListItem button onClick={() => history.push("/geozones")}>
              <ListItemText primary={t("geozones")} />
            </ListItem>
            <ListItem button onClick={() => history.push("/notifications")}>
              <ListItemText primary={t("sharedNotifications")} />
            </ListItem>
            <ListItem button onClick={() => history.push("/calendars")}>
              <ListItemText primary={t("sharedCalendars")} />
            </ListItem>
            <ListItem button onClick={() => history.push("/maintenance")}>
              <ListItemText primary={t("sharedMaintenance")} />
            </ListItem>
            <Divider />
            <ListItem>
              <Button color="inherit" onClick={handleLogout}>
                {t("loginLogout")}
              </Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default MainToolbar;
