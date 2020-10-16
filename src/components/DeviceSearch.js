import { Avatar, Divider, IconButton, InputBase, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Paper } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { devicesActions } from '../store';
import t from "../common/localization";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "4px 4px",
    display: "grid",
    alignItems: "center",
    width: '76%',
    height: 'auto',
    marginTop: '3%',
    marginLeft: '3%',
    position: 'fixed',
    left: '0px',
    [theme.breakpoints.up('md')]: {
      position: 'unset',
      marginTop: '1%',
    },
  },
  iconButton: {
    padding: 10
  },
  div: {
    display: 'flex'
  },
  input: {
    [theme.breakpoints.up('md')]: {
      width: '460px'
    }
  }
}));

function DeviceSearch() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const devices = useSelector(state => Object.values(state.devices.items));
  const [ showDeviceList, setShowDeviceList ] = useState(false);

  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  }

  return (
    <Paper component="form" className={classes.paper}>
      <div className={classes.div}>
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder={t("sharedSearch")}
          inputProps={{ "aria-label": "search google maps" }}
        />
      </div>
      <div style={{display: 'flex', width: '100%', cursor: 'pointer'}} onClick={() => toggleDeviceList()}>
        { showDeviceList ?
          <i className="fas fa-angle-up fa-lg" style={{ margin: '0 auto'}}/>
          :
          <i className="fas fa-angle-down fa-lg" style={{ margin: '0 auto'}}/>
        }
      </div>
      <div className={showDeviceList ? '' : 'display-none'}>
        {devices.map((device, index, list) => (
            <Fragment key={device.id}>
              <ListItem button key={device.id} onClick={() => dispatch(devicesActions.select(device))}>
              <ListItemAvatar>
                  <Avatar>
                    <i className="fas fa-truck-moving" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={device.name} secondary={device.uniqueId} />

                <Avatar src={require('../../public/images/gps.gif')}/>

                <ListItemSecondaryAction>
                  <IconButton>
                  <i className="fas fa-info-circle" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < list.length - 1 ? <Divider /> : null}
            </Fragment>
          ))}
        </div>
    </Paper>
  );
}

export default DeviceSearch;
