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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import * as service from "../utils/serviceManager";

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },  
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const ITEM_HEIGHT = 48;

const useStyles = deviceSearchStyles;

function DeviceSearch() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const enableIcon = useSelector(state => state.devices.selectEnable);
  const devicesRedux = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const [groups, setGroups] = useState();
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedStatus, setSelectedStatus] = useState('');
  let upIcon = document.getElementById("searchbox-up");
  const [inputSearch, setInputSearch] = useState();
  const [deviceList, setDeviceList] = useState(devicesRedux);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const selectedItems = useSelector((state) => state.positions.selectedItems);
  const [filterOption, setFilterOption] = React.useState(null);
  const [groupsOptionsList, setGroupsOptionsList] = React.useState(null);
  const [statusOptionsList, setStatusOptionsList] = React.useState(null);
  const openGroup = Boolean(groupsOptionsList);
  const openStatus = Boolean(statusOptionsList);
  const listFiltered = useSelector(state => state.positions.listFiltered, shallowEqual);

  const handleClickGroupsOptionsList = (event) => {
    setGroupsOptionsList(event.currentTarget);
  };

  const handleCloseGroupsOptionsList = () => {
    setGroupsOptionsList(null);
    setFilterOption(null);
  };

  const handleClickStatusOptionsList = (event) => {
    setStatusOptionsList(event.currentTarget);
  };

  const handleCloseStatusOptionsList = () => {
    setStatusOptionsList(null);
    setFilterOption(null);
  };

  const handleClick = (event) => {
    setFilterOption(event.currentTarget);
  };

  const handleClose = () => {
    setFilterOption(null);
  };

  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  };

  const getGroups = async () => {
    let response = await service.getGroups();
    setGroups(response);
  }

  useEffect(()=> {
    getGroups();
  },[])

  // useEffect(()=> {
  //   console.log(selectedGroup);
  //   console.log(selectedStatus);
  // },[selectedStatus, selectedGroup])

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

  const filterDevicesMenu = () => {
    if(selectedGroup !== null){
      //do something
    } else if (selectedStatus !== null) {
      let filteredDevices = [];
      if (devicesRedux && devicesRedux.length > 0) {
        filteredDevices = devicesRedux.filter(
          (e) => e.status === selectedStatus
        );
      }   
      setDeviceList(filteredDevices);
      dispatch(positionsActions.listFiltered(true));
      filteredDevices.map(device => {
        dispatch(positionsActions.addSelectedDevice(device));
      })
    }
  
    // switch (option){
    //   case "asd":
    //     return null
    //   case "dsa":
    //     return null 
    //   default:
    //     return null
    // }
  }

  useEffect(()=> {
    if(selectedItems.length > 0){
      setDeviceList(selectedItems);
    }
  },[selectedItems])

  // useEffect(()=> {
  //   console.log(deviceList);
  // },[deviceList])

  const handleChangeGroup = (event) => {
    setSelectedGroup(event.target.innerText);
    setSelectedStatus(null);
    handleCloseGroupsOptionsList();
  }

  const handleChangeStatus = (event) => {
    // console.log(event.target.innerText);
    if(event.target.innerText === `${t("deviceStatusOffline")}`){
      setSelectedStatus("offline");
    } else {
      setSelectedStatus("unknown");
    }    
    setSelectedGroup(null);
    handleCloseStatusOptionsList();
  }

  useEffect(()=> {
    filterDevicesMenu();
  },[selectedGroup, selectedStatus]);

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

  const handleClearList = () => { 
    let nullArray = [];
    dispatch(positionsActions.resetSelectedItems(nullArray));
    dispatch(positionsActions.listFiltered(false));
  }

  // useEffect(() => {
  //   console.log(listFiltered)
  //   console.log(selectedItems);
  //   // if(selectedItems){
  //   //   console.log(selectedItems.includes('offline'))
  //   // }
  // },[listFiltered, selectedItems])

  // function GetBool (object) {
  //   if(selectedItems){
  //     console.log(selectedItems.includes(object.status === 'offline'))
  //   }
  //   // console.log(selectedItems)
  // }

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
          placeholder={selectedItems && selectedItems.length > 0 ? `${t('sharedShow')} ${selectedItems.length} ${t('sharedDevice').toLowerCase()}(s)` : listFiltered ? `${deviceList.length} ${t('sharedDevice').toLowerCase()}(s)` : devicesRedux && `${devicesRedux.length} ${t('sharedDevice').toLowerCase()}(s)`}     
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
          <i title={`Desplegar lista`} id="searchbox-down"onClick={() => toggleDeviceList()} className={`btn btn-searchbox fas fa-angle-down fa-lg ${classes.iconSearchbox}`}/>          
        )}
        <i title={`Filtrar lista`} onClick={handleClick} onClose={handleClose} className={`btn btn-searchbox fas fa-filter ${classes.iconFilterSearchbox}`}></i>
      </div>

      <div>
        {inputSearch && inputSearch.length > 0 || listFiltered ? 
          <div id="deviceListSearch" className={showDeviceList ? "device-list" : "display-none"}>
            <DeviceList enableIcon={enableIcon} list={deviceList} upIcon={upIcon} closing={toggleDeviceList}/>
          </div>
        :
          <div id="deviceListSearch" className={showDeviceList ? "device-list" : "display-none"}>
            <DeviceList enableIcon={enableIcon} list={devicesRedux} upIcon={upIcon} closing={toggleDeviceList} />
          </div>
        }
      </div>
      <div>
        <StyledMenu
          id="customized-menu"
          anchorEl={filterOption}
          
          open={Boolean(filterOption)}
          onClose={handleClose}
        >
          <List>
            <ListItem button
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"  
            onClick={handleClickStatusOptionsList}>
              <ListItemIcon>
                <GroupIcon/>
              </ListItemIcon>
              <ListItemText>
                Estado
              </ListItemText>
              <ListItemSecondaryAction>
                  <Menu                        
                  id="long-menu"
                  anchorEl={statusOptionsList}
                  keepMounted
                  open={openStatus}
                  onClose={handleCloseStatusOptionsList}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '20ch',
                    },
                  }}
                >
                  <MenuItem
                    // disabled={GetBool} 
                    onClick={handleChangeStatus}>
                      {t("deviceStatusOffline")}
                  </MenuItem>
                  <MenuItem 
                    disabled={deviceList.includes("unknown")} 
                    onClick={handleChangeStatus}>
                      {t("deviceStatusUnknown")}
                  </MenuItem>
                </Menu>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button 
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"  
              onClick={handleClickGroupsOptionsList}>
              <ListItemIcon>
                <GroupIcon/>
              </ListItemIcon>
              <ListItemText>
                Grupo
              </ListItemText>
              <ListItemSecondaryAction>
                  <Menu                        
                  id="long-menu"
                  anchorEl={groupsOptionsList}
                  keepMounted
                  open={openGroup}
                  value={selectedGroup} 
                  
                  onClose={handleCloseGroupsOptionsList}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '25ch',
                    },
                  }}
                >
                  {groups && groups.map((group) => (
                    <MenuItem disabled={true} onClick={handleChangeGroup} key={group.id}>
                      {group.name}
                    </MenuItem> 
                  ))}
                </Menu>
              </ListItemSecondaryAction>
            </ListItem>
            {listFiltered && 
            <ListItem button  
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"  
              onClick={handleClearList}
              >
              <ListItemIcon>
                <GroupIcon/>
              </ListItemIcon>
              <ListItemText>
                Eliminar filtro
              </ListItemText>
            </ListItem>
            }
          </List>                  
        </StyledMenu>
      </div>
    </Paper>
  );
}

export default DeviceSearch;
