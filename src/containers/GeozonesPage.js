import React, {useEffect, useState} from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import t from "../common/localization";
import Container from "@material-ui/core/Container";
import * as service from "../utils/serviceManager";
import {useDispatch, useSelector} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import StarBorder from "@material-ui/icons/StarBorder";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {useHistory, useParams} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import DrawableMap from '../components/DrawableMap';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {CirclePicker} from 'react-color';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles((theme) => ({

    root: {
      overflowY: 'scroll',
      height: '100%',
      overflowX: 'hidden',
      paddingBottom: '15%',
      [theme.breakpoints.up('md')]: {
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        paddingTop: '5%',
        paddingRight: '15%',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '90%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    appBar: {},
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    title: {},
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    imgItem: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      height: '100px',
      display: 'block',
    },
    accordionStyle: {
      margin: '10px 0px',
    },
    [theme.breakpoints.up('md')]: {
      margin: '15px 0px',
      width: '50%',
    },
    heading: {
      fontSize: '12px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    attributesStyles: {
      fontSize: '11px',
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '50.33%',
    },
      [theme.breakpoints.up('md')]: {
      flexBasis: '33.33%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: '0px 16px',
      paddingLeft: '2%',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    extendedIcon: {
      marginRight: '1px',
    },
    rootmodal: {
      '& > *': {
        width: '250px',
        margin: theme.spacing(1),
      },
      [theme.breakpoints.up('md')]: {
        '& > *': {
          width: '500px',
        },
      },
    },
    //Estilos modal map
    rootMap: {
      display: 'flex',
    },
    appBarMap: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawerMap: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaperMap: {
      width: drawerWidth,
    },
    drawerContainerMap: {
      overflow: 'auto',
      marginTop: '5%',
    },
    contentMap: {
      flexGrow: 1,
      height: '100vh',
    },
    //Fin estilos modal map

    //Persistent Drawer Mobile
    rootPersistent: {
      display: 'flex',
    },
    appBarPersistent: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    contentPer: {
      flexGrow: 1,
      height: '100vh',
      width: '100vh',
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    //Persistent Drawer Mobile
  }
));
const styles = (theme) => ({
  root2: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root2} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton}
                    onClick={onClose}>
          <CloseIcon/>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const drawerWidth = 240;

export default function GeozonesPages() {

  const classes = useStyles();
  const [geozones, setGeozones] = useState([]);
  const theme = useTheme();
  const userId = useSelector((state) => state.session.user.id);
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false)
  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);
  const [openModalMap, setOpenModalMap] = useState(false);
  const [geozoneType, setGeozoneType] = useState('0');
  const [color, setColor] = useState('#000000');
  const [openPer, setOpenPer] = React.useState(true);
  const [geozone, setGeozone] = useState({ id: null, name: '', description: '', area: '', attributes: {} })

  const handleDrawerShow = () => {
    setOpenPer(!openPer);
  };

  const handleChangeGeozoneType = (event) => {
    setGeozoneType(event.target.value);
  };

  const handleClickOpenModalMap = () => {
    setOpenModalMap(true);
  };

  const handleCloseModalMap = () => {
    setOpenModalMap(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setGeozone({ id: null, name: '', description: '', area: '', attributes: {} });
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false)
  };

  const handleClickOpenEditModal = (geozone) => {
    setOpenEditModal(true);
    setGeozone({ id: geozone.id, name: geozone.name, description: geozone.description, area: geozone.area, attributes: geozone.attributes });
  };

  useEffect(() => {
    const getGeozones = async (userId) => {
      const response = await service.getGeozonesByUserId(userId);
      setGeozones(response);
    }
    getGeozones(userId);
  }, [userId]);

  const handleAdd = () => {
    fetch(`api/geofences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: geozone.name,
        description: geozone.description,
        area: geozone.area,
        attributes: geozone.attributes
      })
    }).then(response => {
      if (response.ok) {
        const getGeozones = async (userId) => {
          const response = await service.getGeozonesByUserId(userId);
          setGeozones(response);
        }
        getGeozones(userId);
      }
    })
    handleClose();
  }


  const handleEdit = (id) => {
    fetch(`/api/geofences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id: geozone.id,
        name: geozone.name,
        description: geozone.description,
        area: geozone.area,
        attributes: geozone.attributes
      })
    }).then(response => {
      if (response.ok) {
        const getGeozones = async (userId) => {
          const response = await service.getGeozonesByUserId(userId);
          setGeozones(response);
        }
        getGeozones(userId);
      }
    })
    handleCloseModalMap();
    handleClose();
  }

  const handleRemove = (id) => {
    let option = confirm('¿Eliminar Geozona N°' + id + '?');
    if (option) {
      fetch(`/api/geofences/${id}`, {method: 'DELETE'}).then(response => {
        if (response.ok) {
          const getGeozones = async (userId) => {
            const response = await service.getGeozonesByUserId(userId);
            setGeozones(response);
          }
          getGeozones(userId);
        }
      })
    }
  }

  const handleGeozoneProperties = (property, data, attribute = false) => {
    let geozoneCopy = {...geozone};
    if (attribute) {
      geozoneCopy.attributes[property] = data;
    } else {
      geozoneCopy[property] = data;
    }
    setGeozone(geozoneCopy);
  }

  return (

    <div className={classes.root}>
      <div className="title-section">
        <h2>{t('sharedGeofences')}</h2>
        <Divider/>
      </div>

      <Container>
        <Button style={{margin: '10px 0px'}} type="button" color="primary"
                variant="outlined"
                onClick={handleClickOpen}>
          <AddIcon color="primary"/>
          {t('sharedAdd')}
        </Button>
      </Container>
      {geozones.map((geozone, index) => (
        <Accordion key={index} className={classes.accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <div className={classes.column}>
              <Typography
                className={classes.heading}><strong>{t('sharedName')}</strong></Typography>
              <Typography
                className={classes.heading}>#{geozone.id} {geozone.name}</Typography>
            </div>
            <div className={classes.column}>
              <Typography
                className={classes.heading}><strong>{t('sharedDescription')}</strong></Typography>
              <Typography className={classes.secondaryHeading}>
                {`${geozone.description ? geozone.description : 'Undefined'}`}
              </Typography>
            </div>
            <div className={classes.column}>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={clsx(classes.column, classes.helper)}>
              <Typography
                className={classes.heading}><strong>{t('sharedAttributes')}</strong>
              </Typography>
              <Typography variant="caption" className={classes.heading}>
                <List component="div" disablePadding>
                  {Object.entries(geozone.attributes).map(([key, value]) =>
                    <ListItem key={key} style={{paddingLeft: 0}} className={classes.nested}>
                      <ListItemIcon style={{minWidth: '30px'}}>
                        <StarBorder style={{fontSize: '15px'}}/>
                      </ListItemIcon>
                      <ListItemText disableTypography={true} className={classes.attributesStyles} primary={key}
                                    secondary={value}/>
                    </ListItem>
                  )}
                </List>
              </Typography>
            </div>
          </AccordionDetails>
          <Divider/>
          <AccordionActions>
            <Fab style={{height: '25px'}}
                 size="small"
                 variant="extended"
                 color="default"
                 aria-label="edit"
                 onClick={() => handleClickOpenEditModal(geozone)}>
              <EditIcon className={classes.extendedIcon}/>{t('sharedEdit')}
            </Fab>
            <Fab style={{height: '25px'}}
                 size="small"
                 variant="extended"
                 color="default"
                 aria-label="edit"
                 onClick={() => handleRemove(geozone.id)}>
              <AddIcon style={{transform: 'rotateZ(45deg)', fontSize: '33px'}}
                       className={classes.extendedIcon}/>{t('sharedRemove')}
            </Fab>
          </AccordionActions>
        </Accordion>
      ))}

      {/*Modal Add New Geozone*/}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title"
              open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {` Agregar nueva Geozona `}
        </DialogTitle>
        <DialogContent dividers>
          <form className={classes.rootmodal} noValidate autoComplete="off">
            <TextField id="outlined-basic" value={`${geozones.length + 1}`}
                       label="Id" name="id" variant="outlined" disabled
            /><br/>
            <TextField
              id="outlined-basic"
              value={geozone.name}
              name="name"
              label={t('sharedName')}
              variant="outlined"
              onChange={(event) => handleGeozoneProperties('name', event.target.value)}
            />
            <br/>
            <TextField
              id="outline)d-basic"
              value={geozone.description}
              name="description"
              label={t('sharedDescription')}
              variant="outlined"
              onChange={(event) => handleGeozoneProperties('description', event.target.value)}
            />
            <br/>
            <Button variant="outlined" color="default"
                    onClick={handleClickOpenModalMap}>
              {t('sharedArea')}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdd} disabled={ geozone.name !== '' && geozone.area !== '' ? false : true } autoFocus color="primary">
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>

      {/*Modal Edit Geozone*/}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title"
              open={openEditModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {t('sharedEdit')}
        </DialogTitle>
        <DialogContent dividers>
          <form className={classes.rootmodal} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              value={geozone.name}
              name="name"
              label={t('sharedName')}
              variant="outlined"
              onChange={(event) => handleGeozoneProperties('name', event.target.value)}
            />
            <br/>
            <TextField
              id="outline)d-basic"
              value={geozone.description}
              name="description"
              label={t('sharedDescription')}
              variant="outlined"
              onChange={(event) => handleGeozoneProperties('description', event.target.value)}
            />
            <br/>
            <Button variant="outlined" color="default"
                    onClick={handleClickOpenModalMap}>
              {t('sharedArea')}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleEdit(geozone.id)}
            autoFocus color="primary">
            {t('sharedEdit')}
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <Dialog
          fullScreen open={openModalMap}
          onClose={handleCloseModalMap}
          TransitionComponent={Transition}>
          <div>
            <div className={classes.rootMap}>
              <CssBaseline/>
              {isViewportDesktop ?
                <div>
                  <AppBar position="fixed" className={classes.appBarMap}>
                    <Toolbar>
                      <Typography variant="h6" className={classes.title}>
                        {t('sharedArea')}
                      </Typography>
                      <Button autoFocus style={{flex: '1'}} color="inherit"
                              onClick={() => handleEdit(geozone.id)}>
                        {t('sharedSave')}
                      </Button>
                      <IconButton edge="start" color="inherit"
                                  onClick={handleCloseModalMap}
                                  aria-label="close">
                        <CloseIcon/>
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                  <Drawer
                    className={classes.drawerMap}
                    variant="permanent"
                    classes={{
                      paper: classes.drawerPaperMap,
                    }}
                  >
                    <Toolbar/>
                    <div className={classes.drawerContainerMap}>
                      <FormControl variant="outlined"
                                   className={classes.formControl}>
                        <InputLabel
                          id="demo-simple-select-outlined-label">{t('reportChartType')}</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={geozoneType}
                          onChange={handleChangeGeozoneType}
                          label={t('reportChartType')}
                        >
                          <MenuItem
                            value={'0'}>{t('mapShapeCircle')}</MenuItem>
                          <MenuItem
                            value={'1'}>{t('mapShapePolygon')}</MenuItem>
                          <MenuItem
                            value={'2'}>{t('mapShapePolyline')}</MenuItem>
                        </Select>
                      </FormControl>
                      <Divider/>
                      <List>
                        <ListItem
                          style={{fontSize: '20px', color: 'cadetblue'}}>
                          <strong>Attributes</strong>
                        </ListItem>
                        <FormControl variant="outlined"
                                     className={classes.formControl}>
                          <InputLabel style={{top: `${color === '' ? '' : '-11%'}`}}
                            id="demo-simple-select-outlined-label">{t('attributeColor')}</InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={color}
                            style={{backgroundColor: color + '88'}}
                            label={t('attributeColor')}
                            defaultValue={'#000000'}
                          >
                            <MenuItem>
                              <CirclePicker
                                width="220px"
                                colors={["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333", "#800000", "#FF6600", "#808000", "#008000", "#008080", "#0000FF", "#666699", "#808080", "#FF0000", "#FF9900", "#99CC00", "#339966", "#33CCCC", "#3366FF", "#800080", "#969696", "#FF00FF", "#FFCC00", "#FFFF00", "#00FF00", "#00FFFF", "#00CCFF", "#993366", "#C0C0C0", "#FF99CC", "#FFCC99", "#FFFF99"]}
                                colorSize={35}
                                onChangeComplete={(color) => {
                                  setColor(color.hex);
                                  handleGeozoneProperties('color', color.hex, true);
                                }}
                              />
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <TextField style={{width: '187px'}}
                                   className={classes.formControl}
                                   id="outlined-number"
                                   label={t('attributeSpeedLimit')}
                                   type="number"
                                   InputLabelProps={{
                                     shrink: true,
                                   }}
                                   variant="outlined"
                                   onChange={(event) => handleGeozoneProperties('speedLimit', event.target.value, true)}
                        />
                        <TextField style={{width: '187px'}}
                                   className={classes.formControl}
                                   id="outlined-number"
                                   label={t('attributePolylineDistance')}
                                   type="number"
                                   InputLabelProps={{
                                     shrink: true,
                                   }}
                                   onChange={(event) => handleGeozoneProperties('polylineDistance', event.target.value, true)}
                                   variant="outlined"
                        />
                      </List>
                    </div>
                  </Drawer>

                </div> :

                <div style={{display: 'flex'}}>
                  <AppBar
                    position="fixed"
                    className={clsx(classes.appBarPersistent, {
                      [classes.appBarShift]: openPer,
                    })}>
                    <Toolbar>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerShow}
                        edge="start"
                        className={clsx(classes.menuButton, openPer && classes.hide)}
                      >
                        <MenuIcon/>
                      </IconButton>
                      <Typography style={{display: `${openPer ? 'none' : 'block'}`}} variant="h6" noWrap>
                        {t('sharedArea')}
                      </Typography>
                      <Button autoFocus style={{flex: '1',}} color="inherit"
                              onClick={handleCloseModalMap}>
                        {openPer ? '' : `${t('sharedSave')}`}
                      </Button>
                      <IconButton edge="start" color="inherit"
                                  onClick={handleCloseModalMap}
                                  aria-label="close">
                        <CloseIcon/>
                      </IconButton>
                    </Toolbar>
                  </AppBar>

                  <Drawer
                    className={classes.drawerMap}
                    variant="persistent"
                    anchor="left"
                    open={openPer}
                    classes={{
                      paper: classes.drawerPaperMap,}}>
                    <div className={classes.drawerHeader}>
                      <IconButton onClick={handleDrawerShow}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> :
                          <ChevronRightIcon/>}
                      </IconButton>
                      <Divider/>
                    </div>
                      <FormControl variant="outlined"
                                   className={classes.formControl}>
                        <InputLabel
                          id="demo-simple-select-outlined-label">{t('reportChartType')}</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={geozoneType}
                          onChange={handleChangeGeozoneType}
                          label={t('reportChartType')}
                        >
                          <MenuItem
                            value={'0'}>{t('mapShapeCircle')}</MenuItem>
                          <MenuItem
                            value={'1'}>{t('mapShapePolygon')}</MenuItem>
                          <MenuItem
                            value={'2'}>{t('mapShapePolyline')}</MenuItem>
                        </Select>
                      </FormControl>
                      <Divider/>
                      <List>
                        <ListItem
                          style={{fontSize: '20px', color: 'cadetblue'}}>
                          <strong>Attributes</strong>
                        </ListItem>
                        <FormControl variant="outlined"
                                     className={classes.formControl}>
                          <InputLabel style={{top: `${color === '' ? '' : '-11%'}`}}
                                      id="demo-simple-select-outlined-label">Color</InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={color}
                            style={{backgroundColor: color + '88'}}
                            label={t('attributeColor')}
                            defaultValue={'#000000'}
                          >
                            <MenuItem>
                              <CirclePicker
                                width="220px"
                                colors={["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333", "#800000", "#FF6600", "#808000", "#008000", "#008080", "#0000FF", "#666699", "#808080", "#FF0000", "#FF9900", "#99CC00", "#339966", "#33CCCC", "#3366FF", "#800080", "#969696", "#FF00FF", "#FFCC00", "#FFFF00", "#00FF00", "#00FFFF", "#00CCFF", "#993366", "#C0C0C0", "#FF99CC", "#FFCC99", "#FFFF99"]}
                                colorSize={35}
                                onChangeComplete={(color) => {
                                  setColor(color.hex)
                                }}
                              />
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <TextField style={{width: '187px'}}
                                   className={classes.formControl}
                                   id="outlined-number"
                                   label={t('attributeSpeedLimit')}
                                   type="number"
                                   InputLabelProps={{
                                     shrink: true,
                                   }}
                                   variant="outlined"
                        />
                        <TextField style={{width: '187px'}}
                                   className={classes.formControl}
                                   id="outlined-number"
                                   label={t('attributePolylineDistance')}
                                   type="number"
                                   InputLabelProps={{
                                     shrink: true,
                                   }}
                                   variant="outlined"
                        />
                      </List>
                  </Drawer>

                </div>
              }

              { isViewportDesktop ?
                <main className={classes.contentMap}>
                  { geozoneType &&
                    < DrawableMap geozoneType={geozoneType} color={color} addGeozoneProperty={handleGeozoneProperties} geozone={geozone}/>
                  }
                </main>
              :
                <div style={{display: 'flex',}}>
                <main
                  className={clsx(classes.contentPer, {
                    [classes.contentShift]: openPer,
                  })}>
                  {/*<div className={classes.drawerHeader}/>*/}
                  {geozoneType &&
                  < DrawableMap geozoneType={geozoneType} color={color} addGeozoneProperty={handleGeozoneProperties} geozone={geozone}/>
                  }
                </main>
                </div>
              }
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
