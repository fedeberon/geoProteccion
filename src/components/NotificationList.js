import {
  Divider,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import React, { memo, Fragment } from "react";
import { shallowEqual, useSelector } from "react-redux";
import t from "../common/localization";
import notificationListStyles from "./styles/NotificationListStyles";

const useStyles = notificationListStyles;

const NotificationList = memo(function NotificationList({devices}) {
  const classes = useStyles();
  const notifications = useSelector((state) => state.notification.items, shallowEqual);

  return (
    <Paper component="form" className={classes.paper + " scrollbar"}>
      <div>
        {notifications &&
          notifications.map((notification, index, list) => (
            <Fragment key={index}>
              <ListItem className={classes.listItem} button key={index}>
                <ListItemText>
                  <div className={classes.devsearchSt}>
                    <p className={classes.notificationTitle}><strong>
                      {devices &&
                        devices.find((e) => e.id === notification.deviceId)
                          .name}
                    </strong></p>
                  </div>
                </ListItemText>
                <ListItemSecondaryAction>
                  <div className={classes.devsearchSpeed}>
                    <p className={classes.notificationEvent}>
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
});

export default memo(NotificationList);
