import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import {sessionActions} from "../store";
import Divider from "@material-ui/core/Divider";
import { getCourse } from '../utils/functions';

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
  devicesTable: {
    width: 'auto',
    height: '100%',
    overflow: 'auto',
    marginLeft: '5%',
    overflowY: 'scroll',
    display: 'inherit',
    flexWrap: 'wrap',
    [theme.breakpoints.up('md')]: {
      width: '85%',
      marginLeft: '15%',

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
      width: '28%',
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

}));

const DevicePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {id} = useParams();
  const [device, setDevice] = useState();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const devices = useSelector(state => Object.values(state.devices.items), shallowEqual);
  const positions = useSelector(state => state.positions.items, shallowEqual);
  const [moreInfo, setMoreInfo] = useState(false);

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

  const handleLogout = () => {
    fetch('/api/session', { method: 'DELETE' }).then(response => {
      if (response.ok) {
        dispatch(sessionActions.authenticated(false));
        history.push('/login');
      }
    })
  }

  const handleSave = () => {
    const updatedDevice = id ? device : {};
    updatedDevice.name = name || updatedDevice.name;
    updatedDevice.uniqueId = uniqueId || updatedDevice.uniqueId;

    let request;
    if (id) {
      request = fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedDevice),
      });
    } else {
      request = fetch('/api/devices', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedDevice),
      });
    }

    request.then(response => {
      if (response.ok) {

        history.refresh();
      }
    });
  }

  const showMore = () => {
    setMoreInfo(!moreInfo);
  }

  return (
    <>
      <div style={{marginTop: '5%'}} className="title-section">
        <h2>{t('deviceTitle')}</h2>
        <Divider/>
      </div>
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
                          <IconButton aria-label="settings">
                            <MoreVertIcon/>
                          </IconButton>
                        }
                        title={`${device.attributes.carPlate} - ${device.name}`}
                        subheader={device.lastUpdate}/>
             <CardActions disableSpacing>
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
            </CardActions>
            <Collapse in={collapsedIndex === index} timeout="auto" unmountOnExit>
              <CardContent className={classes.MuiContentRoot}>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  className={classes.list}>

                  <ListItem>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-map-marker-alt"></i>
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
                      <i style={{fontSize: '17px'}} className="fas fa-list"></i>
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
                      {positions && positions[device.id] ? positions[device.id].deviceTime : 'Undefined'}</ListItemText>
                  </ListItem>
                  <ListItem style={{display: `${moreInfo ? 'flex' : 'none'}`}}>
                    <ListItemIcon style={{minWidth: '30px'}}>
                      <i style={{fontSize: '17px'}} className="fas fa-clipboard-check"></i>
                    </ListItemIcon>
                    <ListItemText style={{fontSize: '12px'}}>
                      <strong  className={classes.cardItemText}>{t("positionValid")}:&nbsp;</strong>
                      {positions && positions[device.id] ? Boolean(positions[device.id].valid) : 'Undefined'}</ListItemText>
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
                      Null</ListItemText>



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
                      {positions && positions[device.id] ? Boolean(positions[device.id].ignition) : 'Undefined'}</ListItemText>
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
                      {positions && positions[device.id] ? Boolean(positions[device.id].attributes.motion) : 'Undefined'}</ListItemText>
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

        <Container maxWidth='xs' className={classes.container}>
          <form>
            {(!id || device) &&
            <TextField
              margin="normal"
              fullWidth
              defaultValue={device && device.name}
              onChange={(event) => setName(event.target.value)}
              label={t('sharedName')}
              variant="filled"/>
            }
            {(!id || device) &&
            <TextField
              margin="normal"
              fullWidth
              defaultValue={device && device.uniqueId}
              onChange={(event) => setUniqueId(event.target.value)}
              label={t('deviceIdentifier')}
              variant="filled"/>
            }
            <FormControl fullWidth margin="normal">
              <div className={classes.buttons}>
                <Button type="button" color="primary" variant="outlined"
                        onClick={() => history.goBack()}>
                  {t('sharedCancel')}
                </Button>
                <Button type="button" color="primary" variant="contained"
                        onClick={handleSave}>
                  {t('sharedSave')}
                </Button>
              </div>
            </FormControl>
          </form>
        </Container>
      </div>
    </>
  );
}

export default DevicePage;
