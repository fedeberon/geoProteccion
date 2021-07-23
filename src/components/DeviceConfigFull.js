import React, { useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import t from "../common/localization";
import * as service from "../utils/serviceManager";
import deviceConfigFullStyles from "./styles/DeviceConfigFullStyles";
import { devicesActions } from "../store";
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Divider from "@material-ui/core/Divider";

const useStyles = deviceConfigFullStyles;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCellssharedGeofences = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedName")}`,
  },
];

const headCellssharedDevices = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedName")}`,
  },
  {
    id: "uniqueId",
    numeric: true,
    disablePadding: true,
    label: `${t("deviceIdentifier")}`
  }
];

const headCellssharedGroups = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedName")}`,
  },
];

const headCellssharedUsers = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("settingsUsers")}`,
  }
];

const headCellssharedNotifications = [
  {
    id: "type",
    numeric: false,
    disablePadding: true,
    label: `${t("notificationType")}`,
  },
  {
    id: "always",
    numeric: false,
    disablePadding: false,
    label: `${t("notificationAlways")}`,
  },
  {
    id: "notificators",
    numeric: false,
    disablePadding: false,
    label: `${t("notificationNotificators")}`,
  },
];

const headCellssharedComputedAttributes = [
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedDescription")}`,
  },
  {
    id: "attribute",
    numeric: false,
    disablePadding: false,
    label: `${t("sharedAttribute")}`,
  },
];
const headCellssharedSavedCommands = [
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedDescription")}`,
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: `${t("sharedType")}`,
  },
  {
    id: "sendSms",
    numeric: false,
    disablePadding: false,
    label: `${t("commandSendSms")}`,
  },
];
const headCellssharedMaintenance = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedName")}`,
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: `${t("sharedType")}`,
  },
  {
    id: "start",
    numeric: true,
    disablePadding: false,
    label: `${t("maintenanceStart")}`,
  },
  {
    id: "period",
    numeric: true,
    disablePadding: false,
    label: `${t("maintenancePeriod")}`,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeviceConfigFull = ({ open, close, type, deviceId, groupId, groupAssignment, userId, currentUserId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [devicesByUserId, setDevicesByUserId] = useState([]);
  const [groupsByUserId, setGroupsByUserId] = useState([]);
  const [notificationsByUserId, setNotificationsByUserId] = useState([]);
  const [openFull, setOpenFull] = useState(false);
  const [usersByUserId, setUsersByUserId] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [arrayToMap, setArrayToMap] = useState([]);
  const [allData, setAllData] = useState([]);
  const [geofencesByUserId, setGeofencesByUserId] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [inputSearch, setInputSearch] = useState();

  useEffect(() => {
    setOpenFull(open);
  }, [open]);

  useEffect(() => {
    if (type === "sharedGeofences"){
      if(groupAssignment){
             
        getGeozonesByGroup();

        const getGeozones = async () => {
          const response = await service.getGeozonesByUserId(currentUserId);
          setArrayToMap(response);
        };
        getGeozones(); 
      } else if (deviceId) {

          getGeozonesByDeviceId();

          const getGeozones = async () => {
            const response = await service.getGeozonesByUserId(currentUserId);
            setArrayToMap(response);
          };
          getGeozones();     
      } else if (userId){

          fetch(`api/geofences?all=true`, { method: "GET" })
          .catch(function (error) {
            console.log("setGeofences error: ", error);
          })
          .then((response) => response.json())
          .then((data) => setAllData(data));

          getGeozones();
      }    
    } else if(type === "deviceTitle") {

          fetch(`api/devices?all=true`, { method: "GET" })
          .catch(function (error) {
            console.log("setDevices error: ", error);
          })
          .then((response) => response.json())
          .then((data) => setAllData(data));

          getDevicesByUser(); 

    } else if(type === 'settingsGroups') {

          fetch(`api/groups?all=true`, { method: "GET" })
          .catch(function (error) {
            console.log("setDevices error: ", error);
          })
          .then((response) => response.json())
          .then((data) => setAllData(data));

          getGroupsByUser(); 

    } else if(type === 'settingsUsers') {

      fetch(`api/users`, { method: "GET" })
      .catch(function (error) {
        console.log("setUsers error: ", error);
      })
      .then((response) => response.json())
      .then((data) => setAllData(data));

      getUsersByUserSelected(); 

    } else if (type === "sharedNotifications") {      
      if (groupAssignment) {
              
        getNotificationsByGroupId();

        const getNotifications = async () => {
          const response = await service.getNotificationsByUserId(currentUserId);
          setArrayToMap(response);
        };
        getNotifications();  

      } else if(deviceId) {
             
        getNotificationsByDeviceId();

        const getNotifications = async () => {
          const response = await service.getNotificationsByUserId(currentUserId);
          setArrayToMap(response);
        };
        getNotifications(); 

      } else if(userId) {
        fetch(`api/notifications?all=true`, { method: "GET" })
          .catch(function (error) {
            console.log("setNotifications error: ", error);
          })
          .then((response) => response.json())
          .then((data) => setAllData(data));

          getNotificationsByUser();
      }   
    } else if (type === "sharedComputedAttributes") {
        if(groupAssignment){
          
          getComputedAttributesByGroup();

          const getComputedAttributes = async () => {
            const response = await service.getComputedAttributes(currentUserId);
            setArrayToMap(response);
          }
          getComputedAttributes();
        } else if (deviceId) {
          
          getComputedAttributesByDeviceId();

          const getComputedAttributes = async () => {
            const response = await service.getComputedAttributes(currentUserId);
            setArrayToMap(response);
          }
          getComputedAttributes();
        } else if (userId) {
          fetch(`api/attributes/computed?all=true`, { method: "GET" })
          .catch(function (error) {
            console.log("setNotifications error: ", error);
          })
          .then((response) => response.json())
          .then((data) => setAllData(data));

          getComputedAttributesByUserId();
        }      
    } else if (type === "sharedSavedCommands") {
        if (groupAssignment) {

          getSavedCommandsByGroup();

          const getSavedCommands = async() => {
            const response = await service.getCommands();            
            setArrayToMap(response);
          }
          getSavedCommands();

        } else if (userId) {
          fetch(`api/commands?all=true`, { method: "GET" })
          .catch(function (error) {
            console.log("setCommands error: ", error);
          })
          .then((response) => response.json())
          .then((data) => setAllData(data));

          getCommandsByUserId();
        }
      } 
    }, [open===true, type, deviceId, groupAssignment]);

  //Funcion solo para configuracion desde UserConfig
  const getGeozones = () => {
    setSelected([]);
    fetch(`api/geofences?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setGeofences error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
        settingSelectedItems(data);
        setGeofencesByUserId(data);  
    });  
  }

  //Funcion solo para configuracion desde GroupPage
  const getGeozonesByGroup = async() => {
    let data = await service.getGeozonesByGroupId(groupId);
    settingSelectedItems(data);
  };

  const getComputedAttributesByGroup = async() => {
    let data = await service.getComputedAttributesByGroupId(groupId);
    settingSelectedItems(data);
  };

  const getSavedCommandsByGroup = async() => {
    let data = await service.getSavedCommandsByGroupId(groupId);
    settingSelectedItems(data);
  };

  const getNotificationsByGroupId = async() => {
    let data = await service.getNotificationsByGroupId(groupId);
    settingSelectedItems(data);
  };

  //Funcion solo para configuracion desde DevicesPage
  const getGeozonesByDeviceId = async() => {
    await fetch(`api/geofences?deviceId=${deviceId}`, {method: 'GET'})
    .catch(function (error) {console.log('setGeofencesByDeviceIderror: ' + error)})
    .then(response => response.json())
    .then((data) => {
      settingSelectedItems(data);
    })   
  };

  //Funcion solo para configuracion desde DevicesPage
  const getNotificationsByDeviceId = async() => {
    let data = await service.getNotificationsByDeviceId(deviceId);
    settingSelectedItems(data);
  };

  //Funcion solo para configuracion desde DevicesPage
  const getComputedAttributesByDeviceId = async() => {
    let data = await service.getComputedAttributesByDeviceId(deviceId);
    settingSelectedItems(data);
  } 

  //Funcion solo para configuracion desde UserConfig
  const getDevicesByUser = () => {
    fetch(`api/devices?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setDevices error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
      settingSelectedItems(data);
      setDevicesByUserId(data);
      dispatch(devicesActions.update(data));
    });
  };

  const getGroupsByUser = () => {
    fetch(`api/groups?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setGroups error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
      settingSelectedItems(data);
      setGroupsByUserId(data);
    });
  };

  //Funcion solo para configuracion desde UserConfig
  const getNotificationsByUser = () => {

    fetch(`api/notifications?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setNotifications error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
        settingSelectedItems(data);
        setNotificationsByUserId(data);
    });
  };


  const getUsersByUserSelected = () => {
    // setSelected([]);
    fetch(`api/users?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setUsers error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
      settingSelectedItems(data);
      setUsersByUserId(data);
    });
  };

  const getComputedAttributesByUserId = () => {
    // setSelected([]);
    fetch(`api/attributes/computed?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setComputedAttributes error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
      settingSelectedItems(data);
    });
  };

  const getCommandsByUserId = () => {
    fetch(`api/commands?userId=${userId.id}`, { method: "GET" })
    .catch(function (error) {
      console.log("setSavedCommands error: ", error);
    })
    .then((response) => response.json())
    .then((data) => {
      settingSelectedItems(data);
    });
  };

  // const getCalendarsByUserId = () => {
  //   fetch(`api/calendars?userId=${userId.id}`, { method: "GET" })
  //   .catch(function (error) {
  //     console.log("setCalendars error: ", error);
  //   })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     settingSelectedItems(data);
  //   });
  // };

  const settingSelectedItems = (data) => {
    let arrayAux = [];
    data.map((el)=>{
      if(type==='sharedNotifications'){
        arrayAux.push(el.type); 
      } else if(type ==='sharedComputedAttributes' || type ==='sharedSavedCommands'){
        arrayAux.push(el.description);
      } else {
        arrayAux.push(el.name); 
      }             
    })
    setSelected(arrayAux);
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (name) => {
    let selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  //Agregar permisos
  const handleSetSelectedItem = async (id, name) => {

    let permission = {};

    if(groupAssignment){
      permission.groupId = groupId;
      if(type === 'sharedGeofences'){
      permission.geofenceId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      } else if (type === "sharedSavedCommands"){
        permission.commandId = id;
      }
    } else if (deviceId) { //Asiggnments from Devices Page 
      permission.deviceId = deviceId;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      }
    } else if (userId) {  //Asiggnments from UserManagement 
      permission.userId = userId.id;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === 'deviceTitle') {
        permission.deviceId = id;
      } else if(type === 'settingsGroups') {
        permission.groupId = id;
      } else if(type === "settingsUsers"){
        permission.managedUserId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      } else if(type === "sharedSavedCommands"){
        permission.commandId = id;
      }
    }

      await fetch(`api/permissions`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(permission),
    }).then(response => response)
      .then(response => {
        handleClick(name);
      })
  }

  //Eliminar permisos
  const handleDeleteSelectedItem = async (id, name) => {
    let permission = {};
    
    if(groupAssignment){
      permission.groupId = groupId;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      } else if(type === "sharedSavedCommands"){
        permission.commandId = id;
      }
    } else if (deviceId) { //Asiggnments from Devices Page 
      permission.deviceId = deviceId;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      }
    } else if (userId) { //Asiggnments from UserManagement
      permission.userId = userId.id;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === 'deviceTitle') {
        permission.deviceId = id;
      } else if(type === 'settingsGroups') {
        permission.groupId = id;
      } else if(type === "settingsUsers"){
        permission.managedUserId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      } else if(type === "sharedSavedCommands"){
        permission.commandId = id;
      }
    }  

    await fetch(`api/permissions`, {
      method: 'DELETE',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(permission),
    }).then(response => response)
      .then(data => {
        handleClick(name);                 
      })
  }

  const isSelected = (name) => selected.includes(name);

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleClose = () => {
    setArrayToMap([]);
    setAllData([]);
    setSelected([]);
    setGeofencesByUserId([]);
    setDevicesByUserId([]);
    setGroupsByUserId([]);
    setNotificationsByUserId([]);
    setUsersByUserId([]);
    close();
  };

  function EnhancedTableHead(props) {
    const {
      classes,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    switch (type) {
      case "sharedGeofences":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedGeofences" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">                
              </TableCell>
              {headCellssharedGeofences.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "deviceTitle":
          return (
            <TableHead
              style={{
                display: `${
                  type === "deviceTitle" ? "table-header-group" : "none"
                }`,
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">                
                </TableCell>
                {headCellssharedDevices.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={"left"}
                    padding={headCell.disablePadding ? "none" : "default"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          );

      case "settingsGroups":
          return (
            <TableHead
              style={{
                display: `${
                  type === "settingsGroups" ? "table-header-group" : "none"
                }`,
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">                
                </TableCell>
                {headCellssharedGroups.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "default"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          );

      case "settingsUsers":
          return (
            <TableHead
              style={{
                display: `${
                  type === "settingsUsers" ? "table-header-group" : "none"
                }`,
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">                
                </TableCell>
                {headCellssharedUsers.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "default"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          );

      case "sharedNotifications":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedNotifications" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">              
              </TableCell>

              {headCellssharedNotifications.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "sharedComputedAttributes":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedComputedAttributes"
                  ? "table-header-group"
                  : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
              </TableCell>

              {headCellssharedComputedAttributes.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "sharedSavedCommands":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedSavedCommands" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
              </TableCell>

              {headCellssharedSavedCommands.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "sharedMaintenance":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedMaintenance" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>

              {headCellssharedMaintenance.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "left" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      default:
        break;
    }
  }

  function EnhancedTableBody() {
    switch (type) {
      case "sharedGeofences":

        return (  
           
          <TableBody>    
            {stableSort(arrayToMap.length > 0 ? arrayToMap : allData , getComparator(order, orderBy)).map(
              (row, index) => {                
                let isItemSelected = isSelected(row.name);
                let labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={function () {  
                      // handleToggleBackdrop();                    
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id, row.name);
                      } else {
                        handleDeleteSelectedItem(row.id, row.name);
                      };                      
                    }}                    
                    role="checkbox"                  
                    tabIndex={-1}
                    key={index}                    
                  >
                    <TableCell padding="checkbox">
                      <Checkbox                     
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                  </TableRow>
                );
            }
            )}
          </TableBody>
        );
        case "deviceTitle":

          return (  
             
            <TableBody>    
              {stableSort(arrayToMap.length > 0 ? arrayToMap : inputSearch && inputSearch.length > 0 ? dataArray : allData , getComparator(order, orderBy)).map(
                (row, index) => {                
                  let isItemSelected = isSelected(row.name);
                  let labelId = `enhanced-table-checkbox-${index}`;
  
                  return (
                    <TableRow
                      // hover
                      onClick={function () {                   
                        if(!isItemSelected){              
                          handleSetSelectedItem(row.id, row.name);
                        } else {
                          handleDeleteSelectedItem(row.id, row.name);
                        };                      
                      }}                    
                      role="checkbox"                  
                      tabIndex={-1}
                      key={index}                    
                    >
                      <TableCell padding="checkbox">
                        <Checkbox                     
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="inherit">
                        {row.uniqueId}
                      </TableCell>
                    </TableRow>
                  );
              }
              )}
            </TableBody>
          );

      case "settingsGroups":

          return (  
             
            <TableBody>    
              {stableSort(arrayToMap.length > 0 ? arrayToMap : allData , getComparator(order, orderBy)).map(
                (row, index) => {                
                  let isItemSelected = isSelected(row.name);
                  let labelId = `enhanced-table-checkbox-${index}`;
  
                  return (
                    <TableRow
                      onClick={function () {                      
                        if(!isItemSelected){              
                          handleSetSelectedItem(row.id, row.name);
                        } else {
                          handleDeleteSelectedItem(row.id, row.name);
                        };                      
                      }}                    
                      role="checkbox"                  
                      tabIndex={-1}
                      key={index}                    
                    >
                      <TableCell padding="checkbox">
                        <Checkbox                     
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                    </TableRow>
                  );
              }
              )}
            </TableBody>
          );
      case "settingsUsers":

        return (  
            
          <TableBody>    
            {stableSort(arrayToMap.length > 0 ? arrayToMap : allData , getComparator(order, orderBy)).map(
              (row, index) => {                
                let isItemSelected = isSelected(row.name);
                let labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow                   
                    onClick={function () {                      
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id, row.name);
                      } else {
                        handleDeleteSelectedItem(row.id, row.name);
                      };                      
                    }}                    
                    role="checkbox"                  
                    tabIndex={-1}
                    key={index}                    
                  >
                    <TableCell padding="checkbox">
                      <Checkbox                     
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                  </TableRow>
                );
            }
            )}
          </TableBody>
        );
      case "sharedNotifications":
        return (
          <TableBody>
            {stableSort(arrayToMap.length > 0 ? arrayToMap : allData, getComparator(order, orderBy)).map(
              (row, index) => {
                let isItemSelected = isSelected(row.type);
                let labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    onClick={function () {
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id, row.type);
                      } else {
                        handleDeleteSelectedItem(row.id, row.type);
                      }
                    }}   
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      id={index}
                    >
                      {row.type === 'IgnitionOn' ? `${t('eventIgnitionOn')}` : `${t(`${row.type}`)}`}
                    </TableCell>
                    <TableCell align="inherit">
                      {t(`${Boolean(row.always)}`)}
                    </TableCell>
                    <TableCell align="inherit">{row.notificators}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        );
        case "sharedComputedAttributes":
        return (
          <TableBody>
            {stableSort(arrayToMap.length > 0 ? arrayToMap : allData, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.description);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    onClick={function () {
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id, row.description);
                      } else {
                        handleDeleteSelectedItem(row.id, row.description);
                      }
                    }}  
                    role="checkbox"
                    tabIndex={-1}
                    key={row.description}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.description ? row.description : "Undefined"}
                    </TableCell>
                    <TableCell align="inherit">
                      {row.attribute}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        );
        case "sharedSavedCommands":
        return (
          <TableBody>
            {stableSort(arrayToMap.length > 0 ? arrayToMap : allData, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.description);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={function () {
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id, row.description);
                      } else {
                        handleDeleteSelectedItem(row.id, row.description);
                      }
                    }} 
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.description}
                    </TableCell>
                    <TableCell align="inherit">
                      {row.type}
                    </TableCell>
                    <TableCell align="inherit">
                      {t(`${Boolean(row.textChannel)}`)}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        );
        case "sharedMaintenance":
        return (
          <TableBody>
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="inherit">
                      {row.type}
                    </TableCell>
                    <TableCell align="inherit">
                      {row.start}
                    </TableCell>
                    <TableCell align="inherit">
                      {row.period}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        );
      default:
        break;
    }
  }

  const filterData = (value = "") => {
    setInputSearch(value);
    if(value.length > 0){
    const regex = new RegExp(`${value !== "" ? value : ".+"}`, "gi");
    let dataFiltered = [];
    if (allData && allData.length > 0) {
      dataFiltered = allData.filter(
        (e) => regex.test(e.name) || regex.test(e.email)
      );
    }
      setDataArray(dataFiltered);
    } else {
      setDataArray(allData);
    }
  };

  return (
    <Fragment>
      <Dialog
        fullScreen
        open={openFull}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>          
            <Typography variant="h6" className={classes.title}>
              {userId ? `${t('settingsUsers')}` : `${t('deviceTitle')}`}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography
                className={classes.title}
                align="center"
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {t(`${type}`)}
              </Typography>
            </Toolbar>
            {type === "deviceTitle" &&
            <Paper component="form" className={classes.rootSearch}>
                <InputBase
                  onChange={(event) => filterData(event.target.value)}
                  className={classes.inputSearch}
                  placeholder={`${t('sharedSearch')}`}
                  inputProps={{ 'aria-label': 'search google maps' }}
                />
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton className={classes.iconButtonSeach} aria-label="search">
                  <SearchIcon />
                </IconButton>            
            </Paper>
            }
            
            <TableContainer style={{overflowY: "scroll" , height: `${type === 'deviceTitle' ? '74' : '81'}vh`}}>               
              <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="small"
              aria-label="enhanced table"
              >              
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected && selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={arrayToMap ? arrayToMap.length : allData.length }
                />
                <EnhancedTableBody/>              
              </Table>             
            </TableContainer>
          </Paper>
        </div>
      </Dialog>
    </Fragment>    
  );
};
export default DeviceConfigFull;
