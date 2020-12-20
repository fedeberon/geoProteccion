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
import { devicesActions } from "../store";
import t from "../common/localization";
import { useHistory } from "react-router-dom";
import deviceSearchStyles from "./styles/DeviceSearchStyles";
import { getDateTime } from '../utils/functions';

const useStyles = deviceSearchStyles;

function DeviceSearch(deviceId) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const devices = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const [deviceList, setDeviceList] = useState([]);
  const [showDeviceList, setShowDeviceList] = useState(false);

  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  };

  const dispatchDevice = (device) => {
    dispatch(devicesActions.select(device));
    toggleDeviceList();  
    
    setTimeout(()=> {
      dispatch(devicesActions.select(""));
    },1500);
  };

  const filterDevices = (value = "") => {
    if(value.length > 0){
      setShowDeviceList(true)
      let object = document.getElementById("deviceListSearch");
      object.style.height = 'auto';
    } else {
      setShowDeviceList(false)      
    }

    const regex = new RegExp(`${value !== "" ? value : ".+"}`, "gi");
    let filteredDevices = [];
    if (devices.length > 0) {
      filteredDevices = devices.filter(
        (e) => regex.test(e.name) || regex.test(e.attributes.carPlate)
      );
    }
    setDeviceList(filteredDevices);
  };

  useEffect(() => {
    filterDevices();
  }, [devices.length > 0]);

  const goSearch = (e) => {
    let value;
    devices.map((el) =>{
      if(el.name.toString().toLocaleLowerCase().includes(e.toLocaleLowerCase())){
        value = el;        
      }      
    })
    if(value){
      dispatchDevice(value);    
    }
    setTimeout(()=> {
      dispatch(devicesActions.select(""));
    },1500);
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
          onChange={(event) => filterDevices(event.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? goSearch(e.target.value) : ""}
        />
        {showDeviceList ? (
          <i onClick={() => toggleDeviceList()} className="fas fa-angle-up fa-lg" 
          style={{ marginTop: "14px", position: 'absolute', right: '8%'}} />
        ) : (
          <i onClick={() => toggleDeviceList()} className="fas fa-angle-down fa-lg" 
          style={{ marginTop: "14px", position: 'absolute', right: '8%'}} />
        )}
      </div>
      {/* <div
        style={{ display: "flex", width: "100%", cursor: "pointer" }}
        onClick={() => toggleDeviceList()}
      >
        
      </div> */}
      <div id="deviceListSearch"className={showDeviceList ? "device-list" : "display-none"}>
        {deviceList.map((device, index, list) => (
          <Fragment key={device.id}>
            <ListItem
              className={classes.listItem}
              button
              key={device.id}
              onClick={() => dispatchDevice(device)}
            >
              <ListItemAvatar>
                <Avatar className={classes.MuiAvatarRoot}>
                  <i className="fas fa-truck-moving" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <div className={classes.devsearchSt}>
                  <p className={classes.devsearchStP}>
                    <strong> {device.attributes.carPlate} </strong>-{" "}
                    {device.name}
                  </p>
                  <div className={classes.devsearchSd}>
                    {getDateTime(device.lastUpdate)}
                    <p
                      className={`status-${device.status} ${classes.devsearchSdP}`}
                    >
                      {" "}
                      {device.status}{" "}
                    </p>
                  </div>
                </div>
              </ListItemText>

              <div className={classes.devsearchSpeed}>
                <p className={classes.devsearchSpeedP}>
                  {positions && positions[device.id]
                    ? positions[device.id].speed.toFixed(0)
                    : "0"}{" "}
                  Km/h
                </p>
                <i
                  className={`far fa-circle fa-2x device-icon-${device.status} status-${device.status}`}
                  style={{
                    paddingRight: "0px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </div>

              <ListItemSecondaryAction>
                <IconButton
                  style={{ color: "#1d193e" }}
                  title={t("sharedInfoTitle")}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/device/${device.id}`);
                  }}
                >
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
