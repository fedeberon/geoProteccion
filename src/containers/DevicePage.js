import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as service from '../utils/serviceManager';
import t from '../common/localization';
import {useSelector} from "react-redux";

import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

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
    width: '85%',
    height: '100%',
    overflow: 'auto',
    marginLeft: '15%',
    overflowY: 'scroll',
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    width: '45%',
    display: 'grid',
    borderRadius: '30px',
    margin: '1%',
    boxShadow: '0px 0px 10px 2px #b5bcc1, 0px 0px 0px 0px rgb(146 146 150), 0px 0px 11px 1px rgb(155 155 156)',
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
    backgroundColor: red[500],
  },
  devicesPage: {
    width: '100%',
    textAlign: 'left',
    marginLeft: '15%',
    padding: '1%',
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
    padding: '8px',
    overflowY: "scroll",
  },

}));

const DevicePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const [device, setDevice] = useState();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const userId = useSelector((state) => state.session.user.id)
  const [devices, setDevices] = useState([])
  const rows = useSelector(state => state.devices.items);

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

  useEffect(() => {
    const getDevices = async (userId) => {
      const response = await service.getDeviceByUserId(userId);
      console.log(response);
      setDevices(response);
    }
    getDevices(userId);
  }, [userId]);

  function createData(field, deviceData,) {
    deviceData = deviceData != undefined ? deviceData.toString() : 'Sin datos';
    return {field, deviceData,};
  }

  // useEffect(()=>{
  //   fetch(`/api/devices/${id}`).then(response => {
  //     if (response.ok) {
  //       response.json().then(setDevice);
  //     }
  //   });
  // })

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
        history.goBack();
      }
    });
  }

  return (
    <>
      <div className={classes.devicesPage}>
        <h1>Información de dispositivos</h1>
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
                            R
                          </Avatar>
                        }
                        action={
                          <IconButton aria-label="settings">
                            <MoreVertIcon/>
                          </IconButton>
                        }
                        title={`Dispositivo #${index + 1} - ${device.name}`}
                        subheader="September 14, 2016"/>
             <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon/>
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon/>
              </IconButton>
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
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    {/*<ListItemText primary={`UserId:  ${row.id}`}/>*/}
                    <li>{`UserId:  ${device.id}`}</li>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <li>{`UniqueId:  ${device.uniqueId}`}</li>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Status"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Disable"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="LastUpdate"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="PositionId"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="GroupId"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Phone"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Model"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Category"/>
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <DraftsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Drafts"/>
                  </ListItem>
                  <ListItem button onClick={handleClickListG}>
                    <ListItemIcon>
                      <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Geofences"/>
                    {openG ? <ExpandLess/> : <ExpandMore/>}
                  </ListItem>
                  <Collapse in={openG} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/*mapeo de geofences aca*/}
                      <ListItem button className={classes.nested}>
                        <ListItemIcon>
                          <StarBorder/>
                        </ListItemIcon>
                        <ListItemText primary="Zona 1"/>
                      </ListItem>
                    </List>
                  </Collapse>
                  <ListItem button onClick={handleClickList}>
                    <ListItemIcon>
                      <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Attributes"/>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.entries(device.attributes).map(([key, value]) =>
                        <ListItem className={classes.nested}>
                          <ListItemIcon>
                            <StarBorder/>
                          </ListItemIcon>
                          <ListItemText primary={key} secondary={value}/>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </List>
              </CardContent>
            </Collapse>
          </Card>
        ))}

        {/*<TableContainer component={Paper}>*/}
        {/*  <Table className={classes.table}>*/}
        {/*    <TableHead>*/}
        {/*      <TableRow>*/}
        {/*        <TableCell>UserID</TableCell>*/}
        {/*        <TableCell>Names</TableCell>*/}
        {/*        <TableCell>UniqueID</TableCell>*/}
        {/*        <TableCell>Status</TableCell>*/}
        {/*        <TableCell>Disable</TableCell>*/}
        {/*        <TableCell>LastUpdate</TableCell>*/}
        {/*        <TableCell>PositionID</TableCell>*/}
        {/*        <TableCell>GroupID</TableCell>*/}
        {/*        <TableCell>Phone</TableCell>*/}
        {/*        <TableCell>Model</TableCell>*/}
        {/*        <TableCell>Category</TableCell>*/}
        {/*        <TableCell>GeoFenceIds</TableCell>*/}
        {/*        <TableCell>Attributes</TableCell>*/}
        {/*      </TableRow>*/}
        {/*    </TableHead>*/}
        {/*    <TableBody>*/}
        {/*      {devices.map((row, index) => (*/}
        {/*        <TableRow key={index}>*/}
        {/*          <TableCell>{row.id}</TableCell>*/}
        {/*          <TableCell>{row.name}</TableCell>*/}
        {/*          <TableCell>{row.uniqueId}</TableCell>*/}
        {/*          <TableCell>{row.status}</TableCell>*/}
        {/*          <TableCell>{row.disabled}</TableCell>*/}
        {/*          <TableCell>{row.lastUpdate}</TableCell>*/}
        {/*          <TableCell>{row.positionId}</TableCell>*/}
        {/*          <TableCell>{row.phone}</TableCell>*/}
        {/*          <TableCell>{row.model}</TableCell>*/}
        {/*          <TableCell>{row.contact}</TableCell>*/}
        {/*          <TableCell>{row.category}</TableCell>*/}
        {/*          <TableCell>{row.geofencesIds}</TableCell>*/}
        {/*        </TableRow>*/}
        {/*      ))}*/}
        {/*    </TableBody>*/}
        {/*  </Table>*/}
        {/*</TableContainer>*/}

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
