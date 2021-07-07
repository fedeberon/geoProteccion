import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import * as service from "../utils/serviceManager";
import t from "../common/localization";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Divider from "@material-ui/core/Divider";
import { speedConverter, getCourse, getOriginalAttributes, getDateTime, getDateTimeDevices } from "../utils/functions";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { Typography } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import CloseIcon from "@material-ui/icons/Close";
import DeviceConfigFull from "../components/DeviceConfigFull";
import devicePageStyle from "./styles/DevicePageStyle";
import { devicesActions } from "../store";
import Avatar from '@material-ui/core/Avatar';
import AttributesDialog from '../components/AttributesDialog';
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

const useStyles = devicePageStyle;

const DevicePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();
  const storageDevices = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const server = useSelector((state) => state.session.server);
  const [devicesAux, setDevicesAux] = useState([]);
  const userId = useSelector((state) => state.session.user.id);
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const [moreInfo, setMoreInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [devices, setDevices] = useState([]);
  const [openedMenu, setOpenedMenu] = useState(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalAttributes, setOpenModalAttributes] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [radioValue, setRadioValue] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [openModalCommand, setOpenModalCommand] = useState(false);
  const [radioValueCommand, setRadioValueCommand] = useState(false);
  const [availableTypesByDeviceId, setAvailableTypesByDeviceId] = useState([]);
  const [openFullDialog, setOpenFullDialog] = useState(false);
  const [type, setType] = useState("");
  const [unitTime, setUnitTime] = useState();
  const [flag, setFlag] = useState();
  const [commandToSend, setCommandToSend] = useState({
    attributes: {},
    description: `${t('sharedNew')}`,
    deviceId: 0,
    id: 0,
    textChannel: false,
    type: '',
  });
  const [openG, setOpenG] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [commandData, setCommandData] = useState("");
  const [openModalAcumulators, setOpenModalAcumulators] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [positionHours, setPositionHours] = useState(0);
  const [addressFound, setAddressFound] = useState('');
  const [dialogAttributes, setDialogAttributes] = useState(false);
  const [newDevice, setNewDevice] = useState({
    id: null,
    name: "",
    uniqueId: "",
    status: "",
    disabled: false,
    lastUpdate: null,
    positionId: null,
    groupId: "",
    phone: "",
    model: "",
    contact: "",
    category: "default",
    geofenceIds: [],
    attributes: {},
  });
  const [attributes, setAttributes] = useState({});
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" });
  const [groups, setGroups] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState({});
  const [categories, setCategories] = useState([
    "categoryArrow",
    "categoryDefault",
    // "categoryAnimal",
    // "categoryBicycle",
    // "categoryBoat",
    // "categoryBus",
    // "categoryCar",
    // "categoryCrane",
    // "categoryHelicopter",
    // "categoryMotorcycle",
    // "categoryOffroad",
    // "categoryPerson",
    // "categoryPickup",
    // "categoryPlane",
    // "categoryShip",
    // "categoryTractor",
    // "categoryTrain",
    // "categoryTram",
    // "categoryTrolleybus",
    // "categoryTruck",
    // "categoryVan",
    // "categoryScooter",
  ]);
  const variable = {
    geocerca: "sharedGeofences",
    notification: "sharedNotifications",
    atrCalculados: "sharedComputedAttributes",
    comGuardados: "sharedSavedCommands",
    mantenimiento: "sharedMaintenance",
  };

  const handleOpenFullDialog = (parametro, deviceId) => {
    setOpenFullDialog(true);
    setType(parametro);
    if (deviceId) {
      setDeviceId(deviceId);
    }
    handleCloseMenuMore();
  };

  const handleCloseFullDialog = () => {
    setOpenFullDialog(false);
    setDeviceId("");
  };

  const showExtraData = () => {
    setExtraData(!extraData);
  };

  const handleChangeRadio = () => {
    setRadioValue(!radioValue);
  };

  const handleChangeRadioCommand = () => {
    setRadioValueCommand(!radioValueCommand);
  };

  const handleClickAdd = () => {
    setOpenModalAdd(!openModalAdd);
  };

  const handleClickEdit = (device) => {
    setOpenModalEdit(!openModalEdit);
    setSelectedDevice(device);
    handleCloseMenuMore();
  };

  const handleClickAttributes = () => {
    setOpenModalAttributes(!openModalAttributes);
    setSelectedDevice({ ...selectedDevice, attributes: selectedDevice.attributes });
    setNewDevice({ ...newDevice, attributes: attributes });
    let originalAttributes = getOriginalAttributes(selectedDevice.attributes);
    setAttributes(originalAttributes);
    setNewAttribute({ name: "", value: "" });    
  };

  const handleClickMenuMore = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenedMenu(event.currentTarget.value);
  };

  const handleCloseMenuMore = () => {
    setAnchorEl(null);
    setOpenedMenu(null);
  };

  const [collapsedIndex, setCollapsedIndex] = useState(-1);

  const handleExpandClick = (index) => {
    setCollapsedIndex(collapsedIndex === index ? -1 : index);
    setAddressFound('');
  };
  
  const handleClickList = () => {
    setOpen(!open);
  };

  const handleClickListG = () => {
    setOpenG(!openG);
  };

  const handleOpenAcumulators = (id) => {
    setOpenModalAcumulators(!openModalAcumulators);
    setDeviceId(id);
    setTotalDistance(((positions[id].attributes.totalDistance) / 1000).toFixed(5));
    setPositionHours((positions[id].attributes.hours) / 3600000);
    handleCloseMenuMore();
  }

  const handleCloseAcumulators = () => {
    setOpenModalAcumulators(!openModalAcumulators);
    setDeviceId('');
  }

  const handleChangeTotalDistance = (event) => {
    setTotalDistance(event.target.value);
  }

  //Send Commands Functions
  const changeUnitTime = (e) => {
    setFlag(true);
    setUnitTime(e.target.value);
  };

  const setAttributePositionPeriod = (e) => {
    e.preventDefault();
    setFlag(false);
    setCommandToSend({
      ...commandToSend,
      attributes: {
        [getCommandKey(commandToSend.type)]: (Number(e.target.value) * unitTime)
      },
    })
  };

  const handleChangeCommandToSend = (event) => {
    setCommandToSend({
      ...commandToSend,
      attributes: {},
      type: event.target.value,
      deviceId: deviceId,
    })
  }

  const handleChangeCommandData = (event) => {
    setCommandToSend({
      ...commandToSend,
      attributes: {
        [getCommandKey(commandToSend.type)]: event.target.value
      }
    })
  }

  const handleClickCommand = (deviceId) => {
    setOpenModalCommand(!openModalCommand);
    setDeviceId(deviceId);
    getCommandTypes(deviceId);
    handleCloseMenuMore();
  };

  const handleCloseModalCommand = () => {
    setOpenModalCommand(false);
    setAvailableTypesByDeviceId([]);
    setRadioValueCommand(false);
    setCommandData("");
    setCommandToSend("");
    setDeviceId("");
  };

  const handleSendCommand = () => {

    const response = fetch(`api/commands/send?deviceId=${deviceId}`, {
      method: 'POST',
      body: commandToSend,
    }).then(response => response)

    handleCloseModalCommand();
  }
  //End Send Commands Functions

  const getCommandTypes = async (idDevice) => {
    const response = await service.getCommandTypes(idDevice);
    setAvailableTypesByDeviceId(response);
  };

  const handleSave = (id) => {
    let device = id ? { ...selectedDevice } : { ...newDevice };
    device.lastUpdate = new Date();
    let request;

    if (id) {
      request = fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
    } else {
      request = fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
    }
    request.catch(function (error) {console.log('savingDeviceerror: ', error);})
    .then(response => {
      if (response.ok) {
        const getDevicesByUser = async (userId) => {
          let response = await service.getDeviceByUserId(userId);
          dispatch(devicesActions.update(response));
          getDevices();
        }
        getDevicesByUser(userId);
      }
    });
    if (openModalEdit) {
      setOpenModalEdit(!openModalEdit);
      setSelectedDevice({});
    } else if (openModalAdd) {
      handleClickAdd();
      setNewDevice({id: null,
        name: "",
        uniqueId: "",
        status: "",
        disabled: false,
        lastUpdate: null,
        positionId: null,
        groupId: "",
        phone: "",
        model: "",
        contact: "",
        category: "default",
        geofenceIds: [],
        attributes: {},
      });
    };
    setNewAttribute({ name: null, value: null });
  };

  const handleRemove = (deviceId) => {
    handleCloseMenuMore();
    let option = confirm("¿Eliminar Device N°" + deviceId + "?");
    if (option) {
      fetch(`/api/devices/${deviceId}`, { method: 'DELETE' }).then(response => {
        if (response.ok) {
          const getDevicesByUser = async (userId) => {
            let response = await service.getDeviceByUserId(userId);
            dispatch(devicesActions.update(response));
            getDevices();
          }
          getDevicesByUser(userId);
        }
      });
    }
  }

  const showMore = () => {
    setMoreInfo(!moreInfo);
  };

  const getGroups = async () => {
    let response = await service.getGroups();
    setGroups(response);
  };
  
  useEffect(() => {
    getGroups();
  }, []);

  const showAddress = async (latitude, longitude) => {   
    let response = await fetch(`api/server/geocode?latitude=${latitude}&longitude=${longitude}`, {method: 'GET'})
      .catch(function (error) { console.log('setCurrentAddress error: ', error)})
      .then(response => response.text());

    setAddressFound(response);
  }

  const getDevices = async () => {
    const response = await service.getDeviceByUserId(userId);
    setDevices(response);
    setDevicesAux(response);    
  };

  useEffect(()=> {    
    getDevices();
  },[])

  const handleOpenDialogAttributes = () => {
    setDialogAttributes(true);
  }

  const handleCloseDialogAttributes = () => {
    setDialogAttributes(false);
  }

  const savingAttributes = (objeto) => {    
    if(openModalEdit){
      setSelectedDevice({
        ...selectedDevice,
        attributes: objeto,
      })
    } else {
      setNewDevice({
        ...newDevice,
        attributes: objeto,
      })
    }      
  };

  const filterDevices = (value = "") => {

    if(value.length > 0){
    const regex = new RegExp(`${value !== "" ? value : ".+"}`, "gi");
    let filteredDevices = [];
    if (devices.length > 0) {
      filteredDevices = devices.filter(
        (e) => regex.test(e.name) || regex.test(e.attributes.carPlate)
      );
    }
    setDevices(filteredDevices);
    } else {
      setDevices(devicesAux);
    }
  };

  useEffect(() => {
    filterDevices();
  }, [devices.length > 0]);

  const getCommandKey = (type) => {
    let object = command.find((elem) => elem.type === type);
    if(object)
    return object.key
  };
  
  const command = [
    {
      type: "engineStop",
      name: "commandEngineStop"
    },{
        type: "custom",
        key: "data",
        name: "commandCustom",
        valueType: "string"        
    }, {
        type: "deviceIdentification",
        name: "commandDeviceIdentification"
    },{
        type: "positionPeriodic",    
        key: "frequency",
        name: "commandPositionPeriodic",
        valueType: "number",
        allowDecimals: false,
        minValue: 0,
        dataType: "frequency"        
    }, {
        type: "positionSingle",
        name: "commandPositionSingle"
    }, {
        type: "requestPhoto",
        name: "commandRequestPhoto"
    }, {
        type: "alarmArm",
        name: "commandAlarmArm"
    }, {
        type: "alarmDisarm",
        name: "commandAlarmDisarm"
    }, {
        type: "positionStop",
        name: "commandPositionStop"
    },{
        type: "engineResume",
        name: "commandEngineResume"
    }, 
  ];

  const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };  

  return (
    <>
      <div className="title-section">
        <h2>{t("deviceTitle")}</h2>
        <Divider />
      </div>
      <Container style={{paddingBottom: '10px', display: `${window.innerWidth < 767 ? 'block' : 'inline-flex'}`, justifyContent: 'center'}}>
        <Button
          className={classes.buttonAddNewDevice}
          type="button"
          color="primary"
          variant="outlined"
          onClick={handleClickAdd}
        >
          <AddIcon color="primary" />
          {t("sharedAdd")}
        </Button>
        <Paper component="form" className={classes.rootSearch}>
          <InputBase
            onChange={(event) => filterDevices(event.target.value)}
            className={classes.inputSearch}
            placeholder={`${t('sharedSearch')}`}
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton className={classes.iconButtonSeach} aria-label="search">
            <SearchIcon />
          </IconButton>            
        </Paper>
        <Divider />
      </Container>

      <div className={classes.devicesTable}>
        {/* <div style={{backgroundColor: "red", width: "100%", height: "100%"}}>
          <AutoSizer>
              {({height, width}) => (
                <FixedSizeList
                  className="ListDevices"
                  height={height}
                  itemCount={devices.length}
                  itemSize={100}
                  width={width}
                >
                  {Row}                    
                </FixedSizeList>                 
              )}
          </AutoSizer>
        </div> */}
        {devices.map((device, index) => (
          <Card key={index} className={classes.root}>
            {/* <CardMedia
              className={classes.media}
              // image="images/Tesla-maps.jpg"
              title="Tesla"
            /> */}
            <CardHeader
              className={classes.MuiHeaderRoot}
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  <img src={`./web/images/${device.category}.svg`}></img>
                </Avatar>
              }
              action={
                <div style={{display: "contents"}}>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: collapsedIndex === index,
                    })}
                    onClick={() => {
                      handleExpandClick(index);
                    }}
                    aria-expanded={collapsedIndex === index}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon style={{color: "#a5b2ea"}}/>
                  </IconButton>
                  <IconButton
                    value={device.id}
                    aria-label="settings"
                    onClick={handleClickMenuMore}
                  >
                    <MoreVertIcon style={{color: "#a5b2ea"}}/>
                  </IconButton>
                </div>
              } //${device.attributes.PATENTE} - 
              title={`${device.name}`}
              subheader={getDateTimeDevices(device.lastUpdate)}
            />
            <Menu
              id={device.id}
              anchorEl={anchorEl}
              open={parseInt(openedMenu) === device.id}
              onClose={handleCloseMenuMore}
            >
              <MenuItem onClick={() => handleRemove(device.id)}>
                {t("sharedRemove")}
              </MenuItem>
              <MenuItem onClick={() => handleClickEdit(device)}>
                {t("sharedEdit")}
              </MenuItem>
              <MenuItem onClick={() => handleClickCommand(device.id)}>
                {t("deviceCommand")}
              </MenuItem>
              <MenuItem onClick={() => handleOpenFullDialog(variable.geocerca, device.id)}>
                {t("sharedGeofences")}
              </MenuItem>
              <MenuItem onClick={() => handleOpenFullDialog(variable.notification, device.id)}>
                {t("sharedNotifications")}
              </MenuItem>
              <MenuItem onClick={() => handleOpenFullDialog(variable.atrCalculados, device.id)}>
                {t("sharedComputedAttributes")}
              </MenuItem>
              <MenuItem style={{display: 'none'}} onClick={() => handleOpenFullDialog(variable.comGuardados, device.id)}>
                {t("sharedSavedCommands")}
              </MenuItem>
              <MenuItem style={{display: 'none'}} onClick={() => handleOpenFullDialog(variable.mantenimiento, device.id)}>
                {t("sharedMaintenance")}
              </MenuItem>
              <MenuItem style={{display: 'none'}}  onClick={() => handleOpenAcumulators(device.id)}>
                {t("sharedDeviceAccumulators")}
              </MenuItem>
            </Menu>
            <Collapse
              in={collapsedIndex === index}
              timeout="auto"
              unmountOnExit
            >
              <CardContent className={classes.MuiContentRoot}>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  className={classes.list}
                >
                  <ListItem style={{minWidth: "100% !important"}}>
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-map-marker-alt"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionLatitude")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? positions[device.id].latitude
                        : "Undefined"}
                      °
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-map-marker-alt"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionLongitude")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? positions[device.id].longitude
                        : "Undefined"}
                      °
                    </ListItemText>
                  </ListItem>
                  <ListItem button onClick={handleClickListG}>
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i style={{ fontSize: "17px" }} className="far fa-map" />
                    </ListItemIcon>
                    <ListItemText style={{ maxWidth: "100%" }}>
                      <strong className={classes.cardItemText}>
                        {t("sharedGeofence")}:
                      </strong>
                    </ListItemText>
                    {openG ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openG} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/*{Object.entries(device.geofenceIds).map(([index]) =>*/}
                      <ListItem button className={classes.nested}>
                        <ListItemIcon style={{ minWidth: "30px" }}>
                          <StarBorder style={{ fontSize: "17px" }} />
                        </ListItemIcon>
                        <ListItemText primary={index} secondary="Value" />
                      </ListItem>
                      {/*)}*/}
                    </List>
                  </Collapse>
                  <ListItem button onClick={handleClickList}>
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i style={{ fontSize: "17px" }} className="fas fa-list" />
                    </ListItemIcon>
                    <ListItemText style={{ maxWidth: "100%" }}>
                      <strong className={classes.cardItemText}>
                        {t("sharedAttributes")}:
                      </strong>
                    </ListItemText>
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.entries(device.attributes).map(([key, value]) => (
                        <ListItem key={key} className={classes.nested}>
                          <ListItemIcon style={{ minWidth: "30px" }}>
                            <StarBorder style={{ fontSize: "17px" }} />
                          </ListItemIcon>
                          <ListItemText primary={key} secondary={value} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>

                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-clock"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("sharedHour")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? getDateTimeDevices(positions[device.id].deviceTime)
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-clipboard-check"
                      />
                    </ListItemIcon>
                    <ListItemText style={{ fontSize: "12px" }}>
                      <strong className={classes.cardItemText}>
                        {t("positionValid")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${t(`${Boolean(positions[device.id].valid).toString()}`)}`
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-map-marker"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionAccuracy")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${Math.expm1((positions[device.id].accuracy)/1000).toFixed(2) } Km`      
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-level-up-alt"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionAltitude")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? positions[device.id].altitude
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-tachometer-alt"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionSpeed")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${(positions[device.id].speed * speedConverter(server && server.attributes?.speedUnit)).toFixed(0)} ${server && server.attributes?.speedUnit}`
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-arrows-alt"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionCourse")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? getCourse(positions[device.id].course)
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-clock"
                      />
                    </ListItemIcon>
                    <ListItemText id="addressdevices">
                      <strong className={classes.cardItemText}>
                        {t("currentAddress")}:&nbsp;
                      </strong>
                      <Button 
                        className={classes.showAddressButton}
                        disabled={addressFound !== ""}
                        size="small" 
                        color="primary" 
                        onClick={() => showAddress(positions[device.id].latitude, positions[device.id].longitude)} 
                      >
                      <p                      
                        style={{display: 'inline', color: 'cadetblue'}}
                        id={`devicepage-${device.id}`}
                      >                        
                        {`${addressFound === "" ? `${t("sharedShowAddress")}` : `${addressFound}`}`}
                      </p>
                      </Button>
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-map-marked"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionProtocol")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? positions[device.id].protocol
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i style={{ fontSize: "17px" }} className="fas fa-key" />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionIgnition")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${t(`${Boolean(positions[device.id].ignition).toString()}`)}`
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i style={{ fontSize: "17px" }} className="fas fa-info" />
                    </ListItemIcon>
                    <ListItemText className={`status-${device.status}`}>
                      <strong className={classes.cardItemText}>
                        {t("positionStatus")}:&nbsp;
                      </strong>
                      {device.status}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-expand-alt"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionDistance")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${positions[device.id].attributes.distance} ${server && server.attributes?.distanceUnit}`
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-route"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("deviceTotalDistance")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${(Math.round((positions[device.id].attributes.totalDistance.toFixed(2)) / 10)) / 100} ${server && server.attributes?.distanceUnit}`
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    style={{ display: `${moreInfo ? "flex" : "none"}` }}
                  >
                    <ListItemIcon style={{ minWidth: "30px" }}>
                      <i
                        style={{ fontSize: "17px" }}
                        className="fas fa-location-arrow"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong className={classes.cardItemText}>
                        {t("positionMotion")}:&nbsp;
                      </strong>
                      {positions && positions[device.id]
                        ? `${t(`${Boolean(positions[device.id].attributes.motion).toString()}`)}`
                        : "Undefined"}
                    </ListItemText>
                  </ListItem>

                  <ListItem
                    style={{ justifyContent: "center"}}
                    button
                    onClick={() => showMore()}
                  >
                    <ListItemText style={{ textAlign: "center" }}>
                      <strong className={classes.cardItemText}>{`${moreInfo ? `${t("showLess")}` : `${t("showMore")}`
                        }`}</strong>
                    </ListItemText>
                  </ListItem>
                </List>
              </CardContent>
            </Collapse>
          </Card>
        ))}

        {/*MODAL ADD DEVICE*/}
        <div>
          <Dialog
            open={openModalAdd}
            onClose={handleClickAdd}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t("sharedAdd")}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClickAdd}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Container maxWidth="xs" className={classes.container}>
                <form>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.name}
                    onChange={(event) =>
                      setNewDevice({ ...newDevice, name: event.target.value })
                    }
                    label={t("sharedName")}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.uniqueId}
                    onChange={(event) =>
                      setNewDevice({
                        ...newDevice,
                        uniqueId: event.target.value,
                      })
                    }
                    label={t("deviceIdentifier")}
                    variant="outlined"
                  />
                </form>
                <Button
                  style={{ margin: "10px 0px" }}
                  onClick={() => handleOpenDialogAttributes()}
                  fullWidth={true}
                  variant="outlined"
                  color="primary"
                >
                  {t('sharedAttributes')}
                </Button>
                <Button
                  style={{ margin: "10px 0px" }}
                  onClick={showExtraData}
                  fullWidth={true}
                  variant="outlined"
                  color="primary"
                >
                  {t('sharedExtra')}
                </Button>
                <form style={{ display: `${extraData ? "block" : "none"}` }}>
                  <Select
                    native
                    fullWidth
                    value={newDevice.groupId}
                    onChange={(event) =>
                      setNewDevice({
                        ...newDevice,
                        groupId: event.target.value,
                      })
                    }
                    name="groupid"
                    type="text"
                    variant="outlined"
                  >
                    <option aria-label="none" value="0" />
                    {groups.map((group, index) => (
                      <option key={index} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.phone}
                    onChange={(event) =>
                      setNewDevice({ ...newDevice, phone: event.target.value })
                    }
                    label={t("sharedPhone")}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.model}
                    onChange={(event) =>
                      setNewDevice({ ...newDevice, model: event.target.value })
                    }
                    label={t("deviceModel")}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.contact}
                    onChange={(event) =>
                      setNewDevice({
                        ...newDevice,
                        contact: event.target.value,
                      })
                    }
                    label={t("deviceContact")}
                    variant="outlined"
                  />
                  <Select
                    style={{marginTop: '16px', marginBottom: '16px', height: '55px'}} 
                    fullWidth
                    value={newDevice.category ? newDevice.category : ''}
                    onChange={(event) =>
                      setNewDevice({
                        ...newDevice,
                        category: event.target.value,
                      })
                    }
                    name="category"
                    type="text"
                    variant="outlined"                  
                  >
                    {categories.map((category, index) => (
                      <MenuItem 
                      key={index} value={category.slice(8).toLocaleLowerCase()} >
                        <ListItemIcon>
                          <Avatar aria-label="recipe" className={classes.avatar}>
                            <img alt="" src={`./web/images/${category.substring(8).toLocaleLowerCase()}.svg`}></img>
                          </Avatar>
                        </ListItemIcon>
                        <Typography variant="inherit">{t(`${category}`)}</Typography>
                      </MenuItem>
                    ))}

                  </Select>                 
                  
                    {t('sharedDisabled')}:
                    <Radio
                      checked={newDevice.disabled === true}
                      onChange={() => setNewDevice({
                        ...newDevice,
                        disabled: true,
                      })}
                      color="primary"
                      value={true}
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "A" }}
                    />
                    {t('reportYes')}
                    <Radio
                      checked={newDevice.disabled === false}
                      onChange={() => setNewDevice({
                        ...newDevice,
                        disabled: false,
                      })}
                      color="primary"
                      value={false}
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "B" }}
                    />
                    {t('reportNo')}
                  
                </form>
              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickAdd} color="primary">
                {t("sharedCancel")}
              </Button>
              <Button onClick={() => handleSave()} color="primary" autoFocus>
                {t("sharedSave")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*Modal Edit Device*/}
        <div>
          <Dialog
            open={openModalEdit}
            onClose={handleClickEdit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t("sharedEdit")}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClickEdit}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Container maxWidth="xs" className={classes.container}>
                <form>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.name}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        name: event.target.value,
                      })
                    }
                    label={t("sharedName")}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.uniqueId}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        uniqueId: event.target.value,
                      })
                    }
                    label={t("deviceIdentifier")}
                    variant="outlined"
                  />
                </form>
                <Button
                  style={{ margin: "10px 0px" }}
                  onClick={() => handleOpenDialogAttributes()}
                  fullWidth={true}
                  variant="outlined"
                  color="primary"
                >
                  {t('sharedAttributes')}
                </Button>
                <Button
                  style={{ margin: "10px 0px" }}
                  onClick={showExtraData}
                  fullWidth={true}
                  variant="outlined"
                  color="primary"
                >
                  {t('sharedExtra')}
                </Button>
                <form style={{ display: `${extraData ? "block" : "none"}` }}>
                  <Select
                    native
                    fullWidth
                    value={selectedDevice.groupId}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        groupId: event.target.value,
                      })
                    }
                    name="name"
                    type="text"
                    variant="outlined"
                  >
                    <option aria-label="none" value="0" />
                    {groups.map((group, index) => (
                      <option key={index} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.phone}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        phone: event.target.value,
                      })
                    }
                    label={t("sharedPhone")}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.model}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        model: event.target.value,
                      })
                    }
                    label={t("deviceModel")}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.contact}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        contact: event.target.value,
                      })
                    }
                    label={t("deviceContact")}
                    variant="outlined"
                  />
                  <Select
                    style={{marginTop: '16px', marginBottom: '16px',height: '55px'}} 
                    fullWidth
                    value={selectedDevice.category}
                    onChange={(event) =>
                      setSelectedDevice({
                        ...selectedDevice,
                        category: event.target.value,
                      })
                    }
                    label={t("groupCategory")}
                    name="category"
                    type="text"
                    variant="outlined"
                    
                  >
                    {categories.map((category, index) => (
                      <MenuItem 
                      key={index} value={category.slice(8).toLocaleLowerCase()} >
                        <ListItemIcon>
                          <Avatar aria-label="recipe" className={classes.avatar}>
                            <img alt="" src={`./web/images/${category.substring(8).toLocaleLowerCase()}.svg`}></img>
                          </Avatar>
                        </ListItemIcon>
                        <Typography variant="inherit">{t(`${category}`)}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                    {t('sharedDisabled')}:
                    <Radio
                      checked={selectedDevice.disabled === true}
                      onChange={() => setSelectedDevice({
                        ...selectedDevice,
                        disabled: true,
                      })}
                      color="primary"
                      value={true}
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "A" }}
                    />
                    {t('reportYes')}
                    <Radio
                      checked={selectedDevice.disabled === false}
                      onChange={() => setSelectedDevice({
                        ...newDevice,
                        disabled: false,
                      })}
                      color="primary"
                      value={false}
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "B" }}
                    />
                    {t('reportNo')}
                </form>
              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickEdit} color="primary">
                {t("sharedCancel")}
              </Button>
              <Button
                onClick={() => handleSave(selectedDevice.id)}
                color="primary"
                autoFocus
              >
                {t("sharedSave")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*Modal Attributes*/}
        <div>
          <AttributesDialog             
            data={selectedDevice.attributes ? selectedDevice.attributes : newDevice.attributes} //If exist, send attributes.
            savingAttributes={savingAttributes} 
            open={dialogAttributes} 
            close={handleCloseDialogAttributes}
          />
        </div>

        {/*SEND A COMMAND*/}
        <div>
          <Dialog
            open={openModalCommand}
            onClose={handleClickCommand}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t("deviceCommand")}
              <IconButton aria-label="close" className={classes.closeButton}
                onClick={handleClickCommand}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <form>
                <FormControl
                  variant="outlined"
                  fullWidth={true}
                  style={{marginBottom: '15px'}}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="outlined-age-native-simple">
                    {t("sharedType")}
                  </InputLabel>
                  <Select
                    native
                    fullWidth
                    value={commandToSend.type}
                    onChange={handleChangeCommandToSend}
                    label={t("sharedType")}
                    name="name"
                    type="text"
                    variant="outlined"
                    inputlabelprops={{
                      shrink: true,
                    }}
                  >
                    <option aria-label="None" value="" />
                    {availableTypesByDeviceId.map((type) => (
                      <option key={type.type} value={type.type}>
                        {t(`command${capitalize(type.type)}`)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <TextField style={{ display: `${commandToSend.type === 'custom' ? 'block' : 'none'}` }}
                  label={t("commandData")}
                  fullWidth
                  autoComplete="off"
                  value={commandToSend.value}
                  name="commandData"
                  onChange={handleChangeCommandData}
                  type="text"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField style={{width: '75%',
                  display: `${commandToSend.type === 'positionPeriodic' ? 'inline-flex' : 'none'}`}}
                  label={t(`commandFrequency`)}
                  name="reportPeriod"
                  InputProps={{ 
                    inputProps: { 
                      min: 0
                    }
                  }}                                
                  type="number"
                  //value={(e) => e.target.value}
                  variant="outlined"
                  error={flag}
                  disabled={!unitTime}
                  onChange={(e) => setAttributePositionPeriod(e)}
                />             
                <Select style={{width: '23%', float: 'right',
                  display: `${commandToSend.type === 'positionPeriodic' ? 'flex' : 'none'}`}}
                    native
                    value={unitTime}
                    onChange={(e) => changeUnitTime(e)}                   
                    name="type"
                    type="text"
                    variant="outlined"
                  >
                    <option value=""/>
                    <option value={1}>s</option>
                    <option value={60}>m</option>
                    <option value={3600}>h</option>
                </Select>          
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModalCommand} color="primary">
                {t("sharedCancel")}
              </Button>
              <Button onClick={handleSendCommand} color="primary" autoFocus>
                {t("commandSend")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <Dialog
            open={openModalAcumulators}
            onClose={handleCloseAcumulators}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t("sharedDeviceAccumulators")}
              <IconButton aria-label="close" className={classes.closeButton}
                onClick={handleCloseAcumulators}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <form>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ padding: 0 }}>
                        <TextField style={{ width: '95%' }}
                          label={t("deviceTotalDistance")}
                          margin="normal"
                          value={totalDistance}
                          name="totalDistance"
                          onChange={handleChangeTotalDistance}
                          type="number"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ padding: 0 }}>{server && server.attributes?.distanceUnit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ padding: 0 }}>
                        <TextField style={{ width: '95%' }}
                          label={t("positionHours")}
                          margin="normal"
                          value={positionHours}
                          name="commandData"
                          onChange={handleChangeCommandData}
                          type="number"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ padding: 0 }}>Hs</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </form>
            </DialogContent>
            <DialogActions>
              <Button disabled onClick={handleCloseAcumulators} color="primary">
                {t("sharedSet")}
              </Button>
              <Button onClick={handleCloseAcumulators} color="primary" autoFocus>
                {t("sharedCancel")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <DeviceConfigFull
            open={openFullDialog}
            close={handleCloseFullDialog}
            type={type}
            deviceId={deviceId}
            currentUserId={userId}
          />
        </div>
      </div>
    </>
  );
};

export default DevicePage;
