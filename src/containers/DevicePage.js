import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as service from '../utils/serviceManager';
import t from '../common/localization';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Divider from "@material-ui/core/Divider";
import { getCourse, getOriginalAttributes, getDateTime } from '../utils/functions';
import AddIcon from "@material-ui/icons/Add";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Typography} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import CloseIcon from "@material-ui/icons/Close";
import DeviceConfigFull from "../components/DeviceConfigFull";
import {devicesActions} from "../store";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    height: '60%',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
  DivicePageSize: {
    float: 'right',
    width: '70%',
    marginRight: '10%',
    marginTop: '6%',
  },
  table: {
    minWidth: 700,
  },
  tablerow: {
    height: '20px',

    [theme.breakpoints.up('md')]: {
    },
  },
  devicesTable: {
    width: 'auto',
    height: '100%',
    overflow: 'auto',
    marginLeft: '5%',
    overflowY: 'scroll',
    display: 'inherit',
    flexWrap: 'wrap',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingBottom: '20%',
    },
  },
  root: {
    width: '95%',
    height: 'auto',
    display: 'grid',
    borderRadius: '30px',
    margin: '3% 0 3% 1%',
    boxShadow: '0px 0px 10px 1px rgba(102, 97, 102, 0.8)',
    mozBoxShadow: '0px 0px 10px 1px rgba(102, 97, 102, 0.8)',
    webkitBoxShadow: '0px 0px 10px 1px rgba(102, 97, 102, 0.8)',
    [theme.breakpoints.up('md')]: {
      width: '29%',
      display: 'inline-grid',
      height: 'auto',
      margin: '2%',
    },
  },
  media: {
    height: '160px',
    display: 'list-item',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#7093f5',
  },
  devicesPage: {
    width: '100%',
    textAlign: 'left',
    marginLeft: '6%',
    padding: '1%',
    [theme.breakpoints.up('md')]: {
      marginLeft: '16%',

    },
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    maxHeight: '170px',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  MuiHeaderRoot: {
    padding: '10px',
  },
  MuiContentRoot: {
    padding: '0',
    overflowY: "scroll",

  },
  cardItemText: {
    color: 'black',
    fontSize: '12px',
    [theme.breakpoints.up('md')]: {
      fontSize: '13px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const DevicePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {id} = useParams();
  const devices = useSelector(state => Object.values(state.devices.items), shallowEqual);
  const positions = useSelector(state => state.positions.items, shallowEqual);
  const userId = useSelector((state) => state.session.user.id);
  const [ moreInfo, setMoreInfo ] = useState(false);
  const [ anchorEl, setAnchorEl ] = useState(false);
  const [ openedMenu, setOpenedMenu ] = useState(null);
  const [ openModalAdd, setOpenModalAdd ] = useState(false);
  const [ openModalEdit, setOpenModalEdit ] = useState(false);
  const [ openModalAttributes, setOpenModalAttributes ] = useState(false);
  const [ extraData, setExtraData ] = useState(false);
  const [ radioValue, setRadioValue ] = useState(false);
  const [ deviceId, setDeviceId ] = useState('');
  const [ openModalCommand, setOpenModalCommand ] = useState(false);
  const [ radioValueCommand, setRadioValueCommand ] = useState(false);
  const [ availableTypesByDeviceId, setAvailableTypesByDeviceId ] = useState([]);
  const [ openFullDialog, setOpenFullDialog ] = useState(false);
  const [ type, setType ] = useState('');
  const [ newDevice, setNewDevice ] = useState({ id: null, name: '', uniqueId: '', status: '', disabled: true, lastUpdate: null, positionId: null, groupId: null, phone: '', model: '', contact: '', category: '', geofenceIds: [], attributes: {}});
  const [ attributes, setAttributes ] = useState({});
  const [ newAttribute, setNewAttribute ] = useState({ name: null, value: null });
  const [ groups, setGroups ] = useState([]);
  const [ selectedDevice, setSelectedDevice ] = useState({});
  const [ categories, setCategories ] = useState([
    'Arrow',
    'Default',
    'Animal',
    'Bicycle',
    'Boat',
    'Bus',
    'Car',
    'Crane',
    'Helicopter',
    'Motorcycle',
    'Offroad',
    'Person',
    'Pickup',
    'Plane',
    'Ship',
    'Tractor',
    'Train',
    'Tram',
    'Trolleybus',
    'Truck',
    'Van',
    'Scooter'
  ]);
  const variable = {
    geocerca: 'sharedGeofences',
    notification: 'sharedNotifications',
    atrCalculados: 'sharedComputeAttributes',
    comGuardados: 'sharedSavedCommands',
    mantenimiento: 'sharedMaintenance'
  };

  const handleOpenFullDialog = (parametro) => {
    setOpenFullDialog(true);
    setType(parametro);
    handleCloseMenuMore();
  }

  const handleCloseFullDialog = () => {
    setOpenFullDialog(false);
  }

  const handleClickCommand = (idDevice) => {
    setOpenModalCommand(!openModalCommand);
    setDeviceId(idDevice);
    getCommandTypes(idDevice);
    handleCloseMenuMore();
  }

  const handleCloseModalCommand = () => {
    setOpenModalCommand(false);
    setAvailableTypesByDeviceId([]);
  }

  const showExtraData = () => {
    setExtraData(!extraData);
  }

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
    setSelectedDevice({...selectedDevice, attributes: attributes});
    setNewDevice({...newDevice, attributes: attributes});
    let originalAttributes = getOriginalAttributes(selectedDevice.attributes);
    setAttributes(originalAttributes);
  }

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
  };

  const [open, setOpen] = React.useState(false);

  const handleClickList = () => {
  setOpen(!open);
  };

  const [openG, setOpenG] = React.useState(false);

  const handleClickListG = () => {
    setOpenG(!openG);
  };

  const getCommandTypes = async (idDevice) => {
    const response = await service.getCommandTypes(idDevice);
    if(response.ok){
      setAvailableTypesByDeviceId(response);
    }
  }

   const handleSave = (id = null) => {
     let device = id ? {...selectedDevice} : {...newDevice};
     device.lastUpdate = new Date();
     let request;

     if (id) {
       request = fetch(`/api/devices/${id}`, {
         method: 'PUT',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(device),
       });
     } else {
       request = fetch('/api/devices', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(device),
       });
     }
     request.then(response => {
       if (response.ok) {

         const getDevices = async (userId) => {
           let response = await service.getDeviceByUserId(userId);
           dispatch(devicesActions.update(response));
         }
        getDevices(userId);
       }
     });
     if(openModalEdit){
     handleClickEdit();
     } else if(openModalAdd){
       handleClickAdd();
     }
   }

  const handleRemove = (deviceId) => {
    handleCloseMenuMore();
    let option = confirm('¿Eliminar Device N°' + deviceId + '?');
    if (option) {
      fetch(`/api/devices/${deviceId}`, {method: 'DELETE'}).then(response => {
        if (response.ok) {
          const getDevices = async (userId) => {
            let response = await service.getDeviceByUserId(userId);
            dispatch(devicesActions.update(response));
          }
          getDevices(userId);
        }
      });
    }
  }

  const showMore = () => {
    setMoreInfo(!moreInfo);
  }

  useEffect(() => {
    const getGroups = async () => {
      let response = await service.getGroups();
      setGroups(response);
    }
    getGroups();
  }, [])

  return (
    <>
      <div style={{marginTop: '5%'}} className="title-section">
        <h2>{t('deviceTitle')}</h2>
        <Divider/>
      </div>
      <Container>
        <Button
          style={{margin: '10px 0px'}}
          type="button"
          color="primary"
          variant="outlined"
          onClick={handleClickAdd}
        >
          <AddIcon color="primary"/>
          {t('sharedAdd')}
        </Button>
        <Divider/>
      </Container>

      <div className={classes.devicesTable}>
        {devices.map((device, index) => (

          <Card key={index} className={classes.root}>
            <CardMedia
              className={classes.media}
              image="http://164.68.101.162:8093/img/Tesla-maps.jpg"
              title="Tesla"
            />
            <CardHeader className={classes.MuiHeaderRoot}
                        avatar={
                          <Avatar aria-label="recipe"
                                  className={classes.avatar}>
                            <i className="fas fa-truck-moving" />
                          </Avatar>
                        }
                        action={
                          <div>
                            <IconButton
                              className={clsx(classes.expand, {
                                [classes.expandOpen]: collapsedIndex === index,
                              })}
                              onClick={() => {handleExpandClick(index)}}
                              aria-expanded={collapsedIndex === index}
                              aria-label="show more"
                            >
                              <ExpandMoreIcon/>
                            </IconButton>
                            <IconButton value={device.id} aria-label="settings" onClick={handleClickMenuMore}>
                              <MoreVertIcon/>
                            </IconButton>
                          </div>
                        }
                        title={`${device.attributes.carPlate} - ${device.name}`}
                        subheader={getDateTime(device.lastUpdate)}
            />
            <Menu
              id={device.id}
              anchorEl={anchorEl}
              open={parseInt(openedMenu) === device.id}
              onClose={handleCloseMenuMore}
            >
              <MenuItem onClick={() => handleRemove(device.id)}>{t('sharedRemove')}</MenuItem>
              <MenuItem onClick={() => handleClickEdit(device)}>{t('sharedEdit')}</MenuItem>
              <MenuItem onClick={() => handleClickCommand(device.id)}>{t('deviceCommand')}</MenuItem>
              <MenuItem onClick={() => handleOpenFullDialog(variable.geocerca)}>{t('sharedGeofences')}</MenuItem>
              <MenuItem onClick={() => handleOpenFullDialog(variable.notification)}>{t('sharedNotifications')}</MenuItem>
              <MenuItem onClick={handleCloseMenuMore}>{t('sharedComputedAttributes')}</MenuItem>
              <MenuItem onClick={handleCloseMenuMore}>{t('sharedSavedCommands')}</MenuItem>
              <MenuItem onClick={handleCloseMenuMore}>{t('sharedMaintenance')}</MenuItem>
              <MenuItem onClick={handleCloseMenuMore}>{t('sharedDeviceAccumulators')}</MenuItem>
            </Menu>
            <Collapse in={collapsedIndex === index} timeout="auto" unmountOnExit>
              <CardContent className={classes.MuiContentRoot}>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  className={classes.list}>

                  <ListItem>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-map-marker-alt"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t('positionLatitude')}:&nbsp;</strong>
                     {positions && positions[device.id] ? positions[device.id].latitude : 'Undefined'}°</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-map-marker-alt"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t('positionLongitude')}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].longitude : 'Undefined'}°</ListItemText>
                  </ListItem>
                  <ListItem button onClick={handleClickListG}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="far fa-map"/>
                    </ListItemIcon>
                    <ListItemText style={{maxWidth: '100%'}}><strong className={classes.cardItemText}>{t('sharedGeofence')}:</strong></ListItemText>
                    {openG ? <ExpandLess/> : <ExpandMore/>}
                  </ListItem>
                  <Collapse in={openG} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/*{Object.entries(device.geofenceIds).map(([index]) =>*/}
                      <ListItem button className={classes.nested}>
                        <ListItemIcon style={{minWidth: '30px'}}>
                          <StarBorder style={{fontSize: '17px'}}/>
                        </ListItemIcon>
                        <ListItemText primary={index} secondary="Value"/>
                      </ListItem>
                      {/*)}*/}
                    </List>
                  </Collapse>
                  <ListItem button onClick={handleClickList}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-list"/>
                    </ListItemIcon>
                    <ListItemText style={{maxWidth: '100%'}}><strong className={classes.cardItemText}>{t('sharedAttributes')}:</strong></ListItemText>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.entries(device.attributes).map(([key, value]) =>
                        <ListItem key={key} className={classes.nested}>
                          <ListItemIcon style={{minWidth: '30px'}}>
                            <StarBorder style={{fontSize: '17px'}}/>
                          </ListItemIcon>
                          <ListItemText primary={key} secondary={value}/>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>

                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-clock"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("sharedHour")}:&nbsp;</strong>
                      {positions && positions[device.id] ? getDateTime(positions[device.id].deviceTime) : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-clipboard-check"/>
                    </ListItemIcon>
                    <ListItemText style={{fontSize: '12px'}}>
                      <strong  className={classes.cardItemText}>{t("positionValid")}:&nbsp;</strong>
                      {positions && positions[device.id] ? `${t(`${Boolean(positions[device.id].valid).toString()}`)}` : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-map-marker"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionAccuracy")}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].accuracy : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-level-up-alt"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionAltitude")}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].altitude : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-tachometer-alt"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionSpeed")}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].speed : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-arrows-alt"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionCourse")}:&nbsp;</strong>
                      {positions && positions[device.id] ? getCourse(positions[device.id].course) : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-clock"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("currentAddress")}:&nbsp;</strong>
                      Unknown</ListItemText>

                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-map-marked"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionProtocol")}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].protocol : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-key"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionIgnition")}:&nbsp;</strong>
                      {positions && positions[device.id] ? `${t(`${Boolean(positions[device.id].ignition).toString()}`)}` : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-info"/>
                    </ListItemIcon>
                    <ListItemText className={`status-${device.status}`}>
                      <strong  className={classes.cardItemText}>{t("positionStatus")}:&nbsp;</strong>
                      {device.status}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-expand-alt"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionDistance")}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].attributes.distance : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-route"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("deviceTotalDistance")}:&nbsp;</strong>
                      {positions && positions[device.id] ? positions[device.id].attributes.totalDistance : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-location-arrow"/>
                    </ListItemIcon>
                    <ListItemText>
                      <strong  className={classes.cardItemText}>{t("positionMotion")}:&nbsp;</strong>
                      {positions && positions[device.id] ? `${t(`${Boolean(positions[device.id].attributes.motion).toString()}`)}` : 'Undefined'}</ListItemText>
                  </ListItem>

                  <ListItem style={{justifyContent: 'center'}} button onClick={() => showMore()}>
                    <ListItemText  style={{textAlign: 'center'}}>
                      <strong  className={classes.cardItemText}>{`${moreInfo ? `${t('showLess')}` : `${t('showMore')}`}`}</strong>
                    </ListItemText>
                  </ListItem>

                </List>
              </CardContent>
            </Collapse>
          </Card>
        ))}

        {/*MODAL ADD DEVICE*/}
        <div style={{height: '500px'}}>
          <Dialog
            open={openModalAdd}
            onClose={handleClickAdd}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t('sharedAdd')}
              <IconButton aria-label="close" className={classes.closeButton}
                          onClick={handleClickAdd}>
                <CloseIcon/>
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Container maxWidth='xs' className={classes.container}>
                <form>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.name}
                    onChange={(event) => setNewDevice({...newDevice, name: event.target.value})}
                    label={t('sharedName')}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.uniqueId}
                    onChange={(event) => setNewDevice({...newDevice, uniqueId: event.target.value})}
                    label={t('deviceIdentifier')}
                    variant="outlined"
                  />
                </form>
                <Button style={{margin: '10px 0px'}} onClick={handleClickAttributes} fullWidth={true} variant="outlined" color="primary">
                  {t('sharedAttributes')}
                </Button>
                <Button style={{margin: '10px 0px'}} onClick={showExtraData} fullWidth={true} variant="outlined" color="primary">
                  {t('sharedExtra')}
                </Button>
                <form style={{display: `${extraData ? 'block' : 'none'}`}}>
                  <Select
                    native
                    fullWidth
                    value={newDevice.groupId}
                    onChange={(event) => setNewDevice({...newDevice, groupId: event.target.value})}
                    label={t('groupDialog')}
                    name="name"
                    type="text"
                    variant="outlined"
                    inputlabelprops={{
                      shrink: true,
                    }}
                  >
                    <option aria-label="none" value="0" />
                    {groups.map((group, index) =>
                      <option key={index} value={group.id}>{group.name}</option>
                    )}
                  </Select>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.phone}
                    onChange={(event) => setNewDevice({...newDevice, phone: event.target.value})}
                    label={t('sharedPhone')}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.model}
                    onChange={(event) => setNewDevice({...newDevice, model: event.target.value})}
                    label={t('deviceModel')}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={newDevice.contact}
                    onChange={(event) => setNewDevice({...newDevice, contact: event.target.value})}
                    label={t('deviceContact')}
                    variant="outlined"
                  />
                  <Select
                    native
                    fullWidth
                    value={newDevice.category}
                    onChange={(event) => setNewDevice({...newDevice, category: event.target.value})}
                    label={t('groupCategory')}
                    name="name"
                    type="text"
                    variant="outlined"
                    inputlabelprops={{
                      shrink: true,
                    }}
                  >
                    <option aria-label="none" value="0" />
                    {categories.map((category, index) =>
                      <option key={index} value={category}>{category}</option>
                    )}
                  </Select>
                  <Typography>
                    {t('sharedDisabled')}:
                    <Radio
                      checked={radioValue === true}
                      onClick={handleChangeRadio}
                      color="primary"
                      value={true}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'A' }}
                    /> {t('reportYes')}
                    <Radio
                      checked={radioValue === false}
                      onChange={handleChangeRadio}
                      color="primary"
                      value={false}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'B' }}
                    /> {t('reportNo')}
                  </Typography>
                </form>

              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickAdd} color="primary">
                {t('sharedCancel')}
              </Button>
              <Button onClick={() => handleSave()} color="primary" autoFocus>
                {t('sharedSave')}
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
              {t('sharedEdit')}
              <IconButton aria-label="close" className={classes.closeButton}
                          onClick={handleClickEdit}>
                <CloseIcon/>
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Container maxWidth='xs' className={classes.container}>
                <form>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.name}
                    onChange={(event) => setSelectedDevice({...selectedDevice, name: event.target.value})}
                    label={t('sharedName')}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.uniqueId}
                    onChange={(event) => setSelectedDevice({...selectedDevice, uniqueId: event.target.value})}
                    label={t('deviceIdentifier')}
                    variant="outlined"
                  />
                </form>
                <Button style={{margin: '10px 0px'}} onClick={handleClickAttributes} fullWidth={true} variant="outlined" color="primary">
                  {t('sharedAttributes')}
                </Button>
                <Button style={{margin: '10px 0px'}} onClick={showExtraData} fullWidth={true} variant="outlined" color="primary">
                  {t('sharedExtra')}
                </Button>
                <form style={{display: `${extraData ? 'block' : 'none'}`}}>
                  <Select
                    native
                    fullWidth
                    value={selectedDevice.groupId}
                    onChange={(event) => setSelectedDevice({...selectedDevice, groupId: event.target.value})}
                    label={t('groupDialog')}
                    name="name"
                    type="text"
                    variant="outlined"
                    inputlabelprops={{
                      shrink: true,
                    }}
                  >
                    <option aria-label="none" value="0" />
                    {groups.map((group, index) =>
                      <option key={index} value={group.id}>{group.name}</option>
                    )}
                  </Select>
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.phone}
                    onChange={(event) => setSelectedDevice({...selectedDevice, phone: event.target.value})}
                    label={t('sharedPhone')}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.model}
                    onChange={(event) => setSelectedDevice({...selectedDevice, model: event.target.value})}
                    label={t('deviceModel')}
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    value={selectedDevice.contact}
                    onChange={(event) => setSelectedDevice({...selectedDevice, contact: event.target.value})}
                    label={t('deviceContact')}
                    variant="outlined"
                  />
                  <Select
                    native
                    fullWidth
                    value={selectedDevice.category}
                    onChange={(event) => setSelectedDevice({...selectedDevice, category: event.target.value})}
                    label={t('groupCategory')}
                    name="name"
                    type="text"
                    variant="outlined"
                    inputlabelprops={{
                      shrink: true,
                    }}
                  >
                    <option aria-label="none" value="0" />
                    {categories.map((category, index) =>
                      <option key={index} value={category}>{category}</option>
                    )}
                  </Select>
                  <Typography>
                    {t('sharedDisabled')}:
                    <Radio
                      checked={radioValue === true}
                      onClick={handleChangeRadio}
                      color="primary"
                      value={true}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'A' }}
                    /> {t('reportYes')}
                    <Radio
                      checked={radioValue === false}
                      onChange={handleChangeRadio}
                      color="primary"
                      value={false}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'B' }}
                    /> {t('reportNo')}
                  </Typography>
                </form>

              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickEdit} color="primary">
                {t('sharedCancel')}
              </Button>
              <Button onClick={() => handleSave(selectedDevice.id)} color="primary" autoFocus>
                {t('sharedSave')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*Modal Attributes*/}
        <div>
          <Dialog
            open={openModalAttributes}
            onClose={handleClickAttributes}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{t("sharedAttributes")}
              <IconButton aria-label="close" className={classes.closeButton}
                          onClick={handleClickAttributes}>
                <CloseIcon/>
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <form>
                <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
                  <TextField
                    label="Name"
                    margin="normal"
                    fullWidth
                    value={newAttribute.name}
                    name="name"
                    onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                    type="text"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <TextField
                  label="Value"
                  margin="normal"
                  fullWidth
                  value={newAttribute.value}
                  name="value"
                  onChange={(e) => setNewAttribute({...newAttribute, value: e.target.value})}
                  type="text"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
              <Table fullWidth style={{border: '1px solid', height: '200px',
                overflowY: 'scroll',}}>
                <TableHead>
                  <TableRow className={classes.tablerow}>
                    <TableCell style={{padding: '14px',fontSize: '12px'}}>
                      {t('sharedName')}
                    </TableCell>
                    <TableCell style={{padding: '14px',fontSize: '12px'}}>
                      {t('stateValue')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(attributes).map((attribute, index) =>
                    <TableRow>
                      <TableCell>
                        <TextField
                          label="Value"
                          margin="normal"
                          fullWidth
                          name="key"
                          placeholder={attribute[0]}
                          onBlur={(e) => { if (e.target.value !== '') { let { [attribute[0]]: value, ...rest } = attributes; setAttributes({...rest, [e.target.value]: attribute[1]}) }; e.target.value = '' }}
                          type="text"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Value"
                          margin="normal"
                          fullWidth
                          value={attribute[1]}
                          name="value"
                          onChange={(e) => setAttributes({...attributes, [attribute[0]]: e.target.value})}
                          type="text"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAttributes({...attributes, [newAttribute.name]: newAttribute.value})} color="primary">
                {t('sharedAdd')}
              </Button>
              <Button onClick={handleClickAttributes} color="primary" autoFocus>
                {t('sharedSave')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*SEND A COMMAND*/}
        <div>
          <Dialog
            open={openModalCommand}
            onClose={handleClickCommand}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
              <form>
              <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">{t('deviceCommand')}</InputLabel>
                <Select
                  native
                  fullWidth
                  // value={key}
                  // onChange={handleChange}
                  label={t('deviceCommand')}
                  name="name"
                  type="text"
                  variant="outlined"
                  inputlabelprops={{
                    shrink: true,
                  }}
                >

                  <option aria-label="None" value="" />
                  <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option>
                </Select>
              </FormControl>
                <Typography>
                  {t('commandSendSms')}:
                  <Radio
                    checked={radioValueCommand === true}
                    onClick={handleChangeRadioCommand}
                    color="primary"
                    value={true}
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                  /> {t('reportYes')}
                  <Radio
                    checked={radioValueCommand === false}
                    onChange={handleChangeRadioCommand}
                    color="primary"
                    value={false}
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'B' }}
                  /> {t('reportNo')}
                </Typography>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModalCommand} color="primary">
                Disagree
              </Button>
              <Button onClick={handleClickCommand} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <DeviceConfigFull open={openFullDialog} close={handleCloseFullDialog} type={type} deviceId={deviceId}/>
        </div>
      </div>
    </>
  );
}

export default DevicePage;

