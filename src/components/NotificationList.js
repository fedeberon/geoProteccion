import {
  Avatar,
  Divider,
  IconButton,
  InputBase,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { Fragment, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { notificationActions } from "../store";
import t from "../common/localization";
import notificationListStyles from "./styles/NotificationListStyles";

const useStyles = notificationListStyles;

function NotificationList() {
  const classes = useStyles();
  const devices = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const notifications = useSelector((state) => state.notification.items);

  return (
    <Paper component="form" className={classes.paper + " scrollbar"}>
      <div>
        {notifications &&
          notifications.map((notification, index, list) => (
            <Fragment key={index}>
              <ListItem className={classes.listItem} button key={index}>
                <ListItemText>
                  <div className={classes.devsearchSt}>
                    <p className={classes.devsearchStP}>
                      {devices &&
                        devices.find((e) => e.id === notification.deviceId)
                          .name}
                    </p>
                  </div>
                </ListItemText>
                <ListItemSecondaryAction>
                  <div className={classes.devsearchSpeed}>
                    <p className={classes.devsearchSpeedP}>
                      {t(notification.type)}
                    </p>
                  </div>
                </ListItemSecondaryAction>
              </ListItem>
              {index < list.length - 1 ? <Divider /> : null}
            </Fragment>
          ))}
      </div>
    </Paper>
  );
}

export default NotificationList;
