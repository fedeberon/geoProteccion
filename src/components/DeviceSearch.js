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
import React, { Fragment, useEffect, useState, useLayoutEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../store";
import t from "../common/localization";
import { useHistory } from "react-router-dom";
import deviceSearchStyles from "./styles/DeviceSearchStyles";
import { getDateTimeDevices, speedConverter } from '../utils/functions';
import { getSVG } from '../utils/svgGetter';
import * as service from "../utils/serviceManager";

const useStyles = deviceSearchStyles;

function DeviceSearch(deviceId) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const server = useSelector((state) => state.session.server);
  const [valueColor, setValueColor] = useState('#ffa2ad');
  const devicesRedux = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const [inputSearch, setInputSearch] = useState();
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const [deviceList, setDeviceList] = useState(devicesRedux);
  const [showDeviceList, setShowDeviceList] = useState(false);

  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  };

  const dispatchDevice = (device) => {
    dispatch(devicesActions.select(device));
    dispatch(devicesActions.selectedDevice(device));
    toggleDeviceList();  
    
    setTimeout(()=> {
      dispatch(devicesActions.select(""));
    },750);
  };

  const filterDevices = (value = "") => {
    setInputSearch(value);
    if(value.length > 0){
      setShowDeviceList(true)
      let object = document.getElementById("deviceListSearch");
      object.style.height = 'auto';
    } else {
      setShowDeviceList(false)      
    }

    const regex = new RegExp(`${value !== "" ? value : ".+"}`, "gi");
    let filteredDevices = [];
    if (devicesRedux && devicesRedux.length > 0) {
      filteredDevices = devicesRedux.filter(
        (e) => regex.test(e.name) || regex.test(e.attributes.carPlate)
      );
    }
    setDeviceList(filteredDevices);
  };

  const goSearch = (event) => {
    let value;
    devicesRedux.map((el) =>{
      if(el.name.toString().toLocaleLowerCase().includes(event.toLocaleLowerCase())){
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
          type="text"
          className={classes.input}
          placeholder={t("sharedSearch")}          
          onChange={(event) => filterDevices(event.target.value)}
          onKeyPress={function (event) {
            if(event.key === 'Enter'){
              event.preventDefault();
              goSearch(event.target.value)
            }                      
          }}
        />
        {showDeviceList ? (
          <i onClick={() => toggleDeviceList()} className={`btn btn-searchbox fas fa-angle-up fa-lg ${classes.iconSearchbox}`}/>
        ) : (
          <i onClick={() => toggleDeviceList()} className={`btn btn-searchbox fas fa-angle-down fa-lg ${classes.iconSearchbox}`}/>          
        )}
      </div>
      {/* <div
        style={{ display: "flex", width: "100%", cursor: "pointer" }}
        onClick={() => toggleDeviceList()}
      >
        
      </div> */}
      {inputSearch && inputSearch.length > 0 ?
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
                  {/* <img src={`./web/images/${device.category}.svg`}></img>*/}
                  {getSVG(device.category, device.status)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <div className={classes.devsearchSt}>
                  <p className={classes.devsearchStP}>
                    <strong> {device.attributes.carPlate} </strong>-{" "}
                    {device.name}
                  </p>
                  <div className={classes.devsearchSd}>
                    {getDateTimeDevices(device.lastUpdate)}
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
                  {server && `${server.attributes?.speedUnit}`}
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
                  id={`device-info-${device.id}`}
                  style={{ color: "#8680bb" }}
                  title={t("sharedInfoTitle")}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/device/${device.id}`);
                  }}
                >
                  <i className="fas fa-upload"></i>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < list.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </div>
      :
      <div id="deviceListSearch"className={showDeviceList ? "device-list" : "display-none"}>
        {devicesRedux.map((device, index, list) => (
          <Fragment key={device.id}>
            <ListItem
              className={classes.listItem}
              button
              key={device.id}
              onClick={() => dispatchDevice(device)}
            >
              <ListItemAvatar>
                <Avatar className={classes.MuiAvatarRoot}>
                  {/* <img src={`./web/images/${device.category}.svg`}></img>*/}
                  {getSVG(device.category, device.status)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <div className={classes.devsearchSt}>
                  <p className={classes.devsearchStP}>
                    <strong> {device.attributes.carPlate} </strong>-{" "}
                    {device.name}
                  </p>
                  <div className={classes.devsearchSd}>
                    {getDateTimeDevices(device.lastUpdate)}
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
                    ? (positions[device.id].speed * speedConverter(server.attributes?.speedUnit)).toFixed(0)
                    : "0"}{" "}
                  {server && `${server.attributes?.speedUnit}`}
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
                  id={`device-info-${device.id}`}
                  style={{ color: "#8680bb" }}
                  title={t("sharedInfoTitle")}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/device/${device.id}`);
                  }}
                >
                  <i className="fas fa-upload"></i>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < list.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </div>
      }
      
    </Paper>
  );
}

export default DeviceSearch;
