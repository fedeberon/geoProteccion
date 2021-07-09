import {
  IconButton,
  InputBase,
  Paper,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState, } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { devicesActions, positionsActions } from "../store";
import deviceSearchStyles from "./styles/DeviceSearchStyles";
import DeviceList from "./DeviceList.js";
import t from "../common/localization";

const useStyles = deviceSearchStyles;

function DeviceSearch() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const enableIcon = useSelector(state => state.devices.selectEnable);
  const devicesRedux = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  let upIcon = document.getElementById("searchbox-up");
  const [inputSearch, setInputSearch] = useState();
  const [deviceList, setDeviceList] = useState(devicesRedux);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const selectedItems = useSelector((state) => state.positions.selectedItems);

  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  };

  const dispatchDevice = (device) => {
    dispatch(devicesActions.select(device));
    dispatch(devicesActions.selectedDevice(device));
    if(selectedItems.findIndex(elem => elem.id === device.id) === -1){
      handleSetItems(device);
    }
    toggleDeviceList(); 
    
    setTimeout(()=> {
      dispatch(devicesActions.select(""));
    },750);
  };

  const handleSetItems = (device) => {
    let icon = document.getElementById(`show-${device.id}`);
    if(selectedItems.findIndex(elem => elem.id === device.id) === -1){      
      dispatch(positionsActions.addSelectedDevice(device));
      icon.style.color = "chartreuse";
    } else {
      dispatch(positionsActions.removeSelectedDevice(device));
      dispatch(positionsActions.lastRemoved(device.id));
      icon.style.color = "rgb(134, 128, 187)";
    }    
  }

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
          placeholder={selectedItems && selectedItems.length > 0 ? `${t('sharedShow')} ${selectedItems.length} ${t('sharedDevice').toLowerCase()}(s)` : devicesRedux && `${devicesRedux.length} ${t('sharedDevice').toLowerCase()}(s)`}     
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
          <i id="searchbox-down"onClick={() => toggleDeviceList()} className={`btn btn-searchbox fas fa-angle-down fa-lg ${classes.iconSearchbox}`}/>          
        )}
      </div>

      <div>
        {inputSearch && inputSearch.length > 0 ? 
          <div id="deviceListSearch" className={showDeviceList ? "device-list" : "display-none"}>
            <DeviceList enableIcon={enableIcon} list={deviceList} upIcon={upIcon} closing={toggleDeviceList}/>
          </div>
        :
          <div id="deviceListSearch" className={showDeviceList ? "device-list" : "display-none"}>
            <DeviceList enableIcon={enableIcon} list={devicesRedux} upIcon={upIcon} closing={toggleDeviceList}/>
          </div>
        }
      </div>
    </Paper>
  );
}

export default DeviceSearch;
