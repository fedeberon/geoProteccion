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
import MenuItem from '@material-ui/core/MenuItem';
import {useHistory, useParams} from 'react-router-dom';
import {sessionActions} from "../store";
import {geofencesActions} from "../store/geofences";

const useStyles = makeStyles((theme) => ({
    //Todos los estilos corresponden a Desktop (Falta hacer mobile)
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

export default function GeozonesPages() {

  const classes = useStyles();
  const [geozones, setGeozones] = useState([]);
  const userId = useSelector((state) => state.session.user.id);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const {id} = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

    let request;
    if (id) {
      request = fetch(`api/geofences`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(addGeozone),
      });
    }
    handleClose();
  }

  const handleDelete = (id) => {
    fetch(`/api/geofences/${id}`, { method: 'DELETE' }).then(response => {
      console.log(response);
      if (response.ok) {
        history.goBack();
      }
    })
  }

  return (

    <div className={classes.root}>
      <h2>Información de Geozonas</h2>
      <Container>
        <Button type="button" color="primary" variant="outlined"
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
                className={classes.heading}><strong>Nombre</strong></Typography>
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
                className={classes.heading}><strong>Área</strong></Typography>
              <ListItemText className={classes.heading}>{geozone.area}</ListItemText>
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
            <Fab style={{height: '25px'}} size="small" variant="extended"
                 color="default" aria-label="edit">
              <EditIcon className={classes.extendedIcon}/>Editar
            </Fab>
            <Fab style={{height: '25px'}} size="small" variant="extended"
                 color="default" aria-label="edit">
              <AddIcon style={{transform: 'rotateZ(45deg)'}}
                       className={classes.extendedIcon} onClick={() => handleDelete(geozone.id)}/>Eliminar
            </Fab>
          </AccordionActions>
        </Accordion>
      ))}

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
                       id="outlined-basic"
                       name="name" label="Nombre" variant="outlined"/><br/>
            <TextField onChange={(event) => setDescription(event.target.value)}
                       id="outline)d-basic"
                       name="description" label="Descripcion"
                       variant="outlined"/><br/>
            <Button style={{width: '150px', height: '50px'}}
                    variant="outlined" label="Area" variant="outlined"
            >Área</Button><br/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

