import { Avatar, Divider, IconButton, InputBase, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Paper } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
  },
  listItem: {
    maxHeight: '80px',
    fontSize: '10px',
  },
}));

function DeviceSearch() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const devices = useSelector(state => Object.values(state.devices.items), shallowEqual);
  const positions = useSelector(state => state.positions.items, shallowEqual);
  const [ deviceList, setDeviceList ] = useState([]);
  const [ showDeviceList, setShowDeviceList ] = useState(false);


  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  }

  const filterDevices = (value = '') => {
    const regex = new RegExp(`${value !== '' ? value : '.+' }`, 'gi');
    let filteredDevices = [];
    if (devices.length > 0) {
      filteredDevices = devices.filter(e => regex.test(e.name) || regex.test(e.attributes.carPlate));
    }
    setDeviceList(filteredDevices);
  }

  // useEffect(() => {
  //   filterDevices();
  // });

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
          onChange={event => filterDevices( event.target.value )}
        />
      </div>
      <div style={{display: 'flex', width: '100%', cursor: 'pointer'}} onClick={() => toggleDeviceList()}>
        { showDeviceList ?
          <i className="fas fa-angle-up fa-lg" style={{ margin: '0 auto'}}/>
          :
          <i className="fas fa-angle-down fa-lg" style={{ margin: '0 auto'}}/>
        }
      </div>
      <div className={showDeviceList ? 'device-list' : 'display-none'}>
        {deviceList.map((device, index, list) => (
            <Fragment key={device.id}>
              <ListItem className={classes.listItem} button key={device.id} onClick={() => dispatch(devicesActions.select(device))}>
                <ListItemAvatar>
                    <Avatar>
                      <i className="fas fa-truck-moving" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <p><strong> {device.attributes.carPlate} </strong>- {device.name}</p>
                    <div style={{display: 'inline-flex'}}>{device.lastUpdate} <p className={`status-${device.status}`}> {device.status} </p></div>
                  </div>
                </ListItemText>

                <div style={{display: 'contents'}}>
                  <p>{positions && positions[device.id] ? positions[device.id].speed : '0'} Km/h</p>
                  <i className={`far fa-circle fa-2x device-icon-${device.status} status-${device.status}`} />
                </div>

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
