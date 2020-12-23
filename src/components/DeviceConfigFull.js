import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

const DeviceConfigFull = ({ open, close, type, deviceId, groupAssignment }) => {
  const classes = useStyles();
  const userId = useSelector((state) => state.session.user.id);
  const [openFull, setOpenFull] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [arrayToMap, setArrayToMap] = useState([]);
  const [geofencesByDeviceId, setGeofencesByDeviceId] = useState([]);
  const [geofencesByGroupId, setGeofencesByGroupId] = useState([]);
  const [notificationsByDeviceId, setNotificationsByDeviceId] = useState([]);
  const [notificationsByGroupId, setNotificationsByGroupId] = useState([]);
  const [computedAttributesByDeviceId, setComputedAttributesByDeviceId] = useState([]);
  const [computedAttributesByGroupId, setComputedAttributesByGroupId] = useState([]);
  let asd = [];

  useEffect(() => {
    if (type === "sharedGeofences") {      
      if(groupAssignment){
        const getGeozonesByGroup = async() => {
          const responseGeofences = await service.getGeozonesByGroupId(deviceId);
          setGeofencesByGroupId(responseGeofences);
        }      
        getGeozonesByGroup();
      } else {
        const getGeozonesByDevice = async() => {
          const responseGeofences = await service.getGeozonesByDeviceId(deviceId);
          setGeofencesByDeviceId(responseGeofences);
        }      
        getGeozonesByDevice();         
      }
      const getGeozones = async (userId) => {
        const response = await service.getGeozonesByUserId(userId);
        setArrayToMap(response);
      };
      getGeozones(userId);     
    } else if (type === "sharedNotifications") {      
      if(groupAssignment){
        const getNotificationsByGroupId = async() => {
          const responseNotifications = await service.getNotificationsByGroupId(deviceId);
          setNotificationsByGroupId(responseNotifications);
        }       
        getNotificationsByGroupId();
      } else {
        const getNotificationsByDeviceId = async() => {
          const responseNotifications = await service.getNotificationsByDeviceId(deviceId);
          setNotificationsByDeviceId(responseNotifications);
        }       
        getNotificationsByDeviceId();
      }
      const getNotifications = async (userId) => {
        const response = await service.getNotificationsByUserId(userId);
        setArrayToMap(response);
      };
      getNotifications(userId);    
    } else if (type === "sharedComputedAttributes") {
      if(groupAssignment){
        const getComputedAttributesByGroup = async() => {
          const responseNotifications = await service.getComputedAttributesByGroupId(deviceId);
          setComputedAttributesByGroupId(responseNotifications);
        } 
        getComputedAttributesByGroup();
      } else {
        const getComputedAttributesByDeviceId = async() => {
          const responseNotifications = await service.getComputedAttributesByDeviceId(deviceId);
          setComputedAttributesByDeviceId(responseNotifications);
        } 
        getComputedAttributesByDeviceId();
      }      
      const getComputedAttributes = async () => {
        const response = await service.getComputedAttributes();
        setArrayToMap(response);
      }
      getComputedAttributes();
    } else if (type === "sharedSavedCommands") {
      const getCommands = async () => {
        const response = await service.getCommands();
        setArrayToMap(response);
      }
      getCommands();

    } else if (type === "sharedMaintenance") {
      const getMaintenances = async () => {
        const response = await service.getMaintenance();
        setArrayToMap(response);
      }
      getMaintenances();
    }
  }, [open===true]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  useEffect(()=> {
    if(open){
      if(groupAssignment){
        geofencesByGroupId.map((el)=>{
          if(!(selected.some(el2 => el2.name === el.name))){
            selected.push(el.name);
          }             
        })
      } else {
        geofencesByDeviceId.map((el)=>{
          if(!(selected.some(el2 => el2.name === el.name))){
            selected.push(el.name);
          }             
        })
      }      
    }    
  },[geofencesByDeviceId, geofencesByGroupId])

  useEffect(()=> {
    if(open){
      if(groupAssignment){
        notificationsByGroupId.map((el)=>{
          if(!(selected.some(el2 => el2.type === el.type))){
            selected.push(el.type);
          }             
        })
      } else {
        notificationsByDeviceId.map((el)=>{
          if(!(selected.some(el2 => el2.type === el.type))){
            selected.push(el.type);
          }             
        })
      }      
    }    
  },[notificationsByDeviceId, notificationsByGroupId])

  useEffect(()=> {
    if(open){
      if(groupAssignment){
        computedAttributesByGroupId.map((el)=>{
          if(!(selected.some(el2 => el2.description === el.description))){
            selected.push(el.description);
          }             
        })
      } else {
        computedAttributesByDeviceId.map((el)=>{
          if(!(selected.some(el2 => el2.description === el.description))){
            selected.push(el.description);
          }             
        })
      }      
    }    
  },[computedAttributesByDeviceId, computedAttributesByGroupId])

  const handleSetSelectedItem = (id) => {
    let permission = {};

    if(groupAssignment){
      permission.groupId = deviceId;
    if(type === 'sharedGeofences'){
      permission.geofenceId = id;
    } else if(type === "sharedNotifications"){
      permission.notificationId = id;
    } else if(type === "sharedComputedAttributes"){
      permission.attributeId = id;
    }
    } else {
      permission.deviceId = deviceId;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      }
    }
    

    console.log(JSON.stringify(permission))

    fetch(`api/permissions`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(permission),
    }).then(response => console.log(response))
  }

  const handleDeleteSelectedItem = (id) => {
    let permission = {};
    
    if(groupAssignment){
      permission.groupId = deviceId;
    if(type === 'sharedGeofences'){
      permission.geofenceId = id;
    } else if(type === "sharedNotifications"){
      permission.notificationId = id;
    } else if(type === "sharedComputedAttributes"){
      permission.attributeId = id;
    }
    } else {
      permission.deviceId = deviceId;
      if(type === 'sharedGeofences'){
        permission.geofenceId = id;
      } else if(type === "sharedNotifications"){
        permission.notificationId = id;
      } else if(type === "sharedComputedAttributes"){
        permission.attributeId = id;
      }
    }    

    console.log(JSON.stringify(permission))
    fetch(`api/permissions`, {
      method: 'DELETE',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(permission),
    }).then(response => console.log(response))
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClose = () => {
    // setSelected([]);
    close();
  };

  useEffect(() => {
    setOpenFull(open);
  }, [open]);

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleClick = (name, type, id) => {
    const selectedIndex = selected.indexOf(name);
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
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
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
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {                
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={function () {
                      handleClick(row.name, row.id);
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id);
                      } else {
                        handleDeleteSelectedItem(row.id);
                      }
                    }}                    
                    role="checkbox"                  
                    tabIndex={-1}
                    key={index}                    
                  >
                    <TableCell padding="checkbox">
                      <Checkbox                     
                        checked={selected.includes(row.name) ? true : isItemSelected}
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
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.type);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={function () {
                      handleClick(row.type, row.id);
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id);
                      } else {
                        handleDeleteSelectedItem(row.id);
                      }
                    }}   
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.type) ? true : isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      id={index}
                    >
                      {t(`${row.type}`)}
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
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.description);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={function () {
                      handleClick(row.description, row.id);
                      if(!isItemSelected){              
                        handleSetSelectedItem(row.id);
                      } else {
                        handleDeleteSelectedItem(row.id);
                      }
                    }}  
                    role="checkbox"
                    tabIndex={-1}
                    key={row.description}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.description) ? true : isItemSelected}
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
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
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
                    hover
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

  return (
    <div>
      <Dialog
        fullScreen
        open={openFull}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>          
            <Typography variant="h6" className={classes.title}>
              {t("deviceTitle")}
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
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size="small"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={arrayToMap.length}
                />
                <EnhancedTableBody />
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </Dialog>
    </div>    
  );
};
export default DeviceConfigFull;
