import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
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
import { CirclePicker } from 'react-color';

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
    appBar: {

    },
      [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    title: {
    },
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
      width: '65%',
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
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '33.33%',
    },
      [theme.breakpoints.up('md')]: {
      flexBasis: '33.33%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
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
    },
    contentMap: {
      flexGrow: 1,
      height: '100vh',
    },
    //Fin estilos modal map
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
  const userId = useSelector((state) => state.session.user.id);
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false)
  const history = useHistory();
  const dispatch = useDispatch();
  const {id} = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [openModalMap, setOpenModalMap] = useState(false);
  const [geozoneType, setGeozoneType] = useState('');

  const handleChangeGeozoneType = (event) => {
    setGeozoneType(event.target.value);
  };

  const handleClickOpenModalMap = () => {
    setOpenModalMap(true);
  };

  const handleCloseModalMap = () => {
    setOpenModalMap(false);
  };


  let selectedItem = {
    id: '',
    name: '',
    description: '',
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false)
  };

  const handleClickOpenEditModal = (object) => {
    setOpenEditModal(true);
    selectedItem = object;
    console.log('object value:' + object)
    console.log('selectedItemvalue: ' + selectedItem)
  };

  useEffect(() => {
    const getGeozones = async (userId) => {
      const response = await service.getGeozonesByUserId(userId);
      setGeozones(response);
    }
    getGeozones(userId);
  }, [userId]);

  const handleAdd = () => {
    const addGeozone = id ? geozones : {};
    addGeozone.name = name || addGeozone.name;
    addGeozone.description = description || addGeozone.description;
    addGeozone.area = area || addGeozone.area

    fetch(`api/geofences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: "c3",
        description: "d2222",
        area: "POLYGON((-34.1554644022778 -70.7979463690622, -34.223456939830555 -70.7882760618276, -34.21546066305507 -70.56240531427665, -34.124592571218244 -70.59832359829086, -34.1554644022778 -70.7979463690622))",
      })
    }).then(response => {
        if (response.ok) {
          const getGeozones = async (userId) => {
            const response = await service.getGeozonesByUserId(userId);
            setGeozones(response);
            getGeozones(userId);
          }
        }
      })
    handleClose();
  }


  const handleEdit = (id) => {
    const editGeozone = geozones;
    editGeozone.name = name || editGeozone.name;
    editGeozone.description = description || editGeozone.name;

    fetch(`/api/geofences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(editGeozone)
    }).then(response => console.log(response))
      .then(data => setGeozones(data.json()))
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

  return (

    <div className={classes.root}>
      <div className="title-section">
        <h2>Información de Geozonas</h2>
        <Divider />
      </div>

      <Container>
        <Button style={{margin: '10px 0px'}} type="button" color="primary" variant="outlined"
                onClick={handleClickOpen}>
          <AddIcon color="primary"/>
          Crear nueva geozona
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
                className={classes.heading}><strong>Descripcion</strong></Typography>
              <Typography className={classes.secondaryHeading}>
                {`${geozone.description ? geozone.description : 'Undefined'}`}
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography
                className={classes.heading}><strong>Attributes</strong></Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <div className={classes.column}>
              <img className={classes.imgItem}
                   src="https://spin.atomicobject.com/wp-content/uploads/Screen-Shot-2015-07-11-at-10.06.33-AM.png"/>
            </div>
            <div className={classes.column}>
              {/*<Chip label="Santiago de Chile" onDelete={() => {*/}
              {/*}}/>*/}
              <Typography
                className={classes.heading}><strong>{t('sharedArea')}</strong></Typography>
              <ListItemText
                className={classes.heading}>{geozone.area}</ListItemText>
            </div>
            <div className={clsx(classes.column, classes.helper)}>
              <Typography variant="caption">
                <List component="div" disablePadding>
                  {Object.entries(geozone.attributes).map(([key, value]) =>
                    <ListItem key={key} className={classes.nested}>
                      <ListItemIcon style={{minWidth: '30px'}}>
                        <StarBorder style={{fontSize: '15px'}}/>
                      </ListItemIcon>
                      <ListItemText style={{fontSize: '12px'}} primary={key}
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
              <AddIcon style={{transform: 'rotateZ(45deg)'}}
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
            <TextField onChange={(event) => setName(event.target.value)}
                       id="outlined-basic" value={name}
                       name="name" label={t('sharedName')}
                       variant="outlined"/><br/>
            <TextField onChange={(event) => setDescription(event.target.value)}
                       id="outline)d-basic" value={description}
                       name="description" label={t('sharedDescription')}
                       variant="outlined"/><br/>
            <Button variant="outlined" color="default" onClick={handleClickOpenModalMap}>
              {t('sharedArea')}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdd} autoFocus color="primary">
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>

      {/*Modal Edit Geozone*/}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title"
              open={openEditModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {` Editar Geozona `}
        </DialogTitle>
        <DialogContent dividers>
          <form className={classes.rootmodal} noValidate autoComplete="off">
            <TextField id="outlined-basic"
                       value={`${selectedItem.id}`}
                       label={`${selectedItem.id}`}
                       name="id"
                       variant="outlined" disabled
            /><br/>
            <TextField onChange={(event) => setName(event.target.value)}
                       id="outlined-basic"
                       value={name}
                       name="name"
                       label={t('sharedName')}
                       variant="outlined"/><br/>
            <TextField onChange={(event) => setDescription(event.target.value)}
                       id="outline)d-basic"
                       value={description}
                       name="description"
                       label={t('sharedDescription')}
                       variant="outlined"/><br/>
            <Button style={{width: '150px', height: '50px'}}
                    variant="outlined" label="Area" variant="outlined"
            >{t('sharedArea')}</Button><br/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleEdit()}
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
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBarMap}>
                  <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleCloseModalMap} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                      {t('sharedArea')}
                    </Typography>
                    <Button autoFocus style={{flex: '1'}} color="inherit" onClick={handleCloseModalMap}>
                      {t('sharedSave')}
                    </Button>
                  </Toolbar>
                </AppBar>
                <Drawer
                  className={classes.drawerMap}
                  variant="permanent"
                  classes={{
                    paper: classes.drawerPaperMap,
                  }}
                >
                  <Toolbar />
                  <div className={classes.drawerContainerMap}>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">{t('reportChartType')}</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={geozoneType}
                        onChange={handleChangeGeozoneType}
                        label={t('reportChartType')}
                      >

                        <MenuItem value={10}>{t('sharedCircle')}</MenuItem>
                        <MenuItem value={20}>{t('sharedPolygon')}</MenuItem>
                        <MenuItem value={30}>{t('sharedPolyline')}</MenuItem>
                      </Select>
                    </FormControl>
                    <Divider />
                    <List>
                      <ListItem style={{fontSize: '20px', color: 'cadetblue'}}>
                        <strong>Attributes</strong>
                      </ListItem>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Color</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value=""
                          label="Color"
                        >
                          <MenuItem >
                            <CirclePicker
                             color={'#fff'}
                             colorSize={25}
                            />
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField style={{width: '187px'}} className={classes.formControl}
                                 id="outlined-number"
                                 label="Speed Limit"
                                 type="number"
                                 InputLabelProps={{
                                   shrink: true,
                                 }}
                                 variant="outlined"
                      />
                      <TextField style={{width: '187px'}} className={classes.formControl}
                                 id="outlined-number"
                                 label="Polyline Distance"
                                 type="number"
                                 InputLabelProps={{
                                   shrink: true,
                                 }}
                                 variant="outlined"
                      />
                    </List>
                  </div>
                </Drawer>
                <main className={classes.contentMap}>
                  < DrawableMap />
                </main>
              </div>
            </div>
          </Dialog>
      </div>
    </div>
  );
}

