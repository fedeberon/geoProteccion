import {
  IconButton,
  InputBase,
  Paper,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { Fragment, useEffect, useState, useLayoutEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { devicesActions, positionsActions } from "../store";
import { useHistory } from "react-router-dom";
import deviceSearchStyles from "./styles/DeviceSearchStyles";
import DeviceList from "./DeviceList.js";

const useStyles = deviceSearchStyles;

function DeviceSearch() {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const server = useSelector((state) => state.session.server);
  const enableIcon = useSelector(state => state.devices.selectEnable);
  const devicesRedux = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  let upIcon = document.getElementById("searchbox-up");
  const [inputSearch, setInputSearch] = useState();
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const [deviceList, setDeviceList] = useState(devicesRedux);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const selectedItems = useSelector((state) => state.positions.selectedItems);

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
    let object = document.getElementById("deviceListSearch");

    const regex = new RegExp(`${value !== "" ? value : ".+"}`, "gi");
    let filteredDevices = [];
    if (devicesRedux && devicesRedux.length > 0) {
      filteredDevices = devicesRedux.filter(
        (e) => regex.test(e.name) || regex.test(e.attributes.PATENTE)
      );
    }    
    if(value.length > 0){
      setShowDeviceList(true)
      object.style.height = `${65 * filteredDevices.length}px`;
    } else {
      setShowDeviceList(false);
      object.style.height = null;
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
    },1000);
  }

  return (<Paper component="form" className={classes.paper}>
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
          // placeholder={t("sharedSearch")}       
          placeholder={selectedItems && selectedItems.length > 0 ? `Mostrando ${selectedItems.length} dispositivo(s)` : devicesRedux && `${devicesRedux.length} dispositivos`}     
          onChange={(event) => filterDevices(event.target.value)}
          onKeyPress={function (event) {
            if(event.key === 'Enter'){
              event.preventDefault();
              goSearch(event.target.value)
            }                      
          }}
        />
        {showDeviceList ? (
          <i id="searchbox-up" onClick={() => toggleDeviceList()} className={`btn btn-searchbox fas fa-angle-up fa-lg ${classes.iconSearchbox}`}/>
        ) : (
          <i onClick={() => toggleDeviceList()} className={`btn btn-searchbox fas fa-angle-down fa-lg ${classes.iconSearchbox}`}/>          
        )}
      </div>

      <div>
        {inputSearch && inputSearch.length > 0 ? 
          <div id="deviceListSearch" className={showDeviceList ? "device-list" : "display-none"}>
            <DeviceList enableIcon={enableIcon} list={deviceList} upIcon={upIcon}/>
          </div>
        :
          <div id="deviceListSearch" className={showDeviceList ? "device-list" : "display-none"}>
            <DeviceList enableIcon={enableIcon} list={devicesRedux} upIcon={upIcon}/>
          </div>
        }
      </div>
    </Paper>
  );
}

export default DeviceSearch;
