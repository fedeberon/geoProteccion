import { Avatar, Divider, IconButton, InputBase, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Paper } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import React, { Fragment, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { notificationActions } from '../store';
import t from "../common/localization";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "4px 4px",
    display: "grid",
    alignItems: "center",
    width: '60%',
    height: 'auto',
    margin: '17px 8px',
    position: 'absolute',
    top: '12%',
    left: '8%',
    maxHeight: '200px',
    overflowY: 'scroll',
    borderRadius: '40px',
    webkitBoxShadow: '0px 0px 20px 1px rgba(102, 97, 102, 0.8)',
    mozBoxShadow: '0px 0px 20px 1px rgba(102, 97, 102, 0.8)',
    boxShadow: '0px 0px 20px 1px rgba(102, 97, 102, 0.8)',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      margin: '0px 15px 0px 10px',
      width: '50%'
    },
  },
  iconButton: {
    padding: 8
  },
  div: {
    paddingLeft: '5%',
    display: 'flex'
  },
  input: {
    [theme.breakpoints.up('md')]: {
      width: '460px',
      height: '37px,'
    }
  },
  listItem: {
    maxHeight: '75px',
    fontSize: '10px',
    [theme.breakpoints.up('md')]: {
      maxHeight: '80px',
    },
  },
  MuiAvatarRoot: {
    width: '25px',
    height: '25px',
    fontSize: '12px',
    display: 'inline-flex',
    left: '-10px',
       [theme.breakpoints.up('md')]: {
         width: '40px',
         height: '40px',
         fontSize: '1.25rem',
         display: 'flex',
    },
  },

  devsearchSpeed: {
    display: 'grid',
    [theme.breakpoints.up('md')]: {
      display: 'contents',
    },
  },

  devsearchSpeedP: {
    fontSize: '10px',
    display: 'contents',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      fontSize: '15px',
      padding: '0 5px 0 0',
    },
  },

  devsearchSt: {
    fontSize: '8px',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '12px',
    },
  },
  devsearchStP: {
    fontSize: '12px',
    margin: '3px 0',
    [theme.breakpoints.up('md')]: {
      fontSize: '15px',
      margin: 0,
    },
  },

  devsearchSd: {
    [theme.breakpoints.up('md')]: {
      display: 'inline-flex',
    },
  },

  devsearchSdP: {
    margin: '3px 0',
    fontSize: '10px',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '10px',
      margin: 0,
    },
  },

}));

function NotificationList() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const devices = useSelector(state => Object.values(state.devices.items), shallowEqual);
  const notifications = useSelector(state => state.notification.items);

  return (
    <Paper component="form" className={classes.paper}>
      <div>
        {notifications && notifications.map((notification, index, list) => (
            <Fragment key={index}>
              <ListItem className={classes.listItem} button key={index}>
                <ListItemText>
                    <div className={classes.devsearchSt}>
                        <p className={classes.devsearchStP}>{devices && devices.find(e => e.id === notification.deviceId).name}</p>
                    </div>
                </ListItemText>
                <ListItemSecondaryAction>
                    <div className={classes.devsearchSpeed}>
                        <p className={classes.devsearchSpeedP}>{t(notification.type)}</p>
                    </div>
                </ListItemSecondaryAction>
              </ListItem>
              {index < list.length - 1 ? <Divider /> : null}
            </Fragment>
          ))}
          {notifications.length === 0 &&
            <p>  </p>
          }
        </div>
    </Paper>
  );
}

export default NotificationList;

