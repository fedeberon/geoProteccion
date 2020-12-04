import React, {useEffect, useState} from 'react';
import {TableContainer} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as service from "../utils/serviceManager";
import {useSelector} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import InputLabel from "@material-ui/core/InputLabel";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import {DeleteTwoTone} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";



const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'scroll',
    height: '100%',
    overflowX: 'hidden',
    paddingBottom: '5%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
  formControl: {
    width: '229px',
    minWidth: 120,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  rootGrid: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demoGrid: {
    backgroundColor: theme.palette.background.paper,
  },

}))


const MaintenancePage = () => {

  const classes = useStyles();
  const [ maintenance, setMaintenance ] = useState([]);
  const userId = useSelector((state) => state.session.user.id);
  const [ showModal, setShowModal ] = useState(false);
  const [ elem, setElem ] = useState(false);
  const [ key, setKey ] = useState('');
  const [ value, setValue ] = useState('');
  const [ attributesList, setAttributesList ] = useState([]);
  const [ attributes, setAttributes] = useState({});
  const [state, setState] = useState({
    id: '',
    name: '',
    type: '',
    start: '',
    period: '',
    attributes: {},
  });
  const [openAttributes, setOpenAttributes] = useState(false);
  const [expanded, setExpanded] = useState('');


  const handleShowAttributes = () => {
    setOpenAttributes(!openAttributes);
  };


  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() =>{
    getMaintenance(userId);
  },[])

  const getMaintenance = async (userId) => {
    const response = await service.getMaintenanceByUserId(userId);
    setMaintenance(response);
  }

  const handleSaveAttributes = () => {
    attributesList.push({
      [`${key}`]:`${value}`
    })
    setKey('');
    setValue('');
  }

  const handleChangeAttributesKey = (event) => {
    setKey(event.target.value);
  };
  const handleChangeAttributesValue = (event) => {
    setValue(event.target.value);
  };

  const handleChangeSelects = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleShowModal = (elemento) => {
    setShowModal(!showModal);
    if(elemento){
      setElem(true);
      setState({
        id: elemento.id,
        name: elemento.name,
        type: elemento.type,
        start: elemento.start,
        period: elemento.period,
        attributes: elemento.attributes,
      });
    }
  }

  const handleCancelEdit = () => {
    setState({});
    setElem(false);
    setShowModal(!showModal)
  }

  const handlePost = () => {

      const addMaintenance = {}
      addMaintenance.name = state.name;
      addMaintenance.type = state.type;
      addMaintenance.start = state.start;
      addMaintenance.period = state.period;
      addMaintenance.attributes = attributes;

      console.log(JSON.stringify(addMaintenance))

      fetch(`api/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(addMaintenance)
      }).then(response => {
        if (response.ok) {
          getMaintenance(userId);
        }
      })
    handleShowModal();
  }

  const handleEdit = (state) => {

    fetch(`api/maintenance/${state.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(state)
    }).then(response => {
      if(response.ok){
        setState({});
        setElem(false);
        getMaintenance(userId);
      }
    })
    setShowModal(!showModal);
  }

  const handleRemove = (id) => {
    let option = confirm(`Del n° ${id}`);
    if(option){
      fetch(`api/maintenance/${id}`, {method: 'DELETE'})
        .then(response => {
          if(response.ok){
            getMaintenance(userId);
          }
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <div className={classes.root}>
      <div style={{marginTop: '5%'}} className="title-section">
        <h2>{t('sharedMaintenance')}</h2>
        <Divider/>
      </div>
      <div>
      <Button onClick={() => handleShowModal()}
        style={{margin: '15px'}} variant="outlined" color="primary">
        {t('sharedAdd')}
      </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Iniciar</TableCell>
            <TableCell>Periodo</TableCell>
            <TableCell>Attributes</TableCell>
            <TableCell align="center"/>
          </TableRow>
          </TableHead>
          <TableBody>
            {maintenance.map((el, index)=>(
              <TableRow key={el.id}>
                <TableCell>{el.id}</TableCell>
                <TableCell>{el.name}</TableCell>
                <TableCell>{el.type}</TableCell>
                <TableCell>{el.start}</TableCell>
                <TableCell>{el.period}</TableCell>
                <TableCell>
                  <Accordion key={el.id} square expanded={expanded === `panel${el.id}`} onChange={handleChange(`panel${el.id}`)}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                      Attributes
                    </AccordionSummary>
                    <AccordionDetails>
                      {Object.entries(el.attributes).map(([key, value]) =>
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleShowModal(el)}title="Editar Mantenimiento"
                  >
                    <EditTwoToneIcon/>
                  </Button>
                  <Button onClick={() => handleRemove(el.id)} title="Eliminar Mantenimiento"
                  >
                    <DeleteTwoTone />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*Modal Post & Edit Maintenance*/}
      <div>
        <Dialog
          open={showModal}
          onClose={handleShowModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="customized-dialog-title"
                       onClose={handleCancelEdit}>
            {t('sharedAdd')}
            <IconButton aria-label="close" className={classes.closeButton}
                        onClick={handleCancelEdit}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>

              <Table>
                <TableRow>
                  <TableCell>Nombre:</TableCell>
                  <TableCell><TextField
                    id="outlined-basic"
                    value={state.name}
                    name="name"
                    label={`${t('sharedName')}`}
                    variant="outlined"
                    inputProps={{
                      name: 'name',
                      shrink: true,
                    }}
                    onChange={handleChangeSelects}
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type:</TableCell>
                  <TableCell><FormControl variant="outlined"
                                          className={classes.formControl}>
                    <InputLabel
                      htmlFor="outlined-age-native-simple">Type</InputLabel>
                    <Select
                      native
                      value={state.type}
                      onChange={handleChangeSelects}
                      label="Type"
                      inputProps={{
                        name: 'type',
                      }}
                    >
                      <option value='index'>{t('positionIndex')}</option>
                      <option value='hdop'>{t('positionHdop')}</option>
                      <option value='vdop'>{t('positionVdop')}</option>
                      <option value='pdop'>{t('positionPdop')}</option>
                      <option value='sat'>{t('positionSat')}</option>
                      <option
                        value='satVisible'>{t('positionSatVisible')}</option>
                      <option value='rssi'>{t('positionRssi')}</option>
                      <option value='gps'>{t('positionGps')}</option>
                      <option value='odometer'>{t('positionOdometer')}</option>
                      <option
                        value='odometerMaintenance'>{t('positionServiceOdometer')}</option>
                      <option
                        value='odometerTrip'>{t('positionTripOdometer')}</option>
                      <option value='hours'>{t('positionHours')}</option>
                      <option value='steps'>{t('positionSteps')}</option>
                      <option value='power'>{t('positionPower')}</option>
                      <option value='batery'>{t('positionBattery')}</option>
                      <option
                        value='bateryLevel'>{t('positionBatteryLevel')}</option>
                      <option value='fuel'>{t('positionFuel')}</option>
                      <option
                        value='fuelConsumtion'>{t('positionFuelConsumption')}</option>
                      <option value='distance'>{t('sharedDistance')}</option>
                      <option
                        value='totalDistance'>{t('deviceTotalDistance')}</option>
                      <option value='rpm'>{t('positionRpm')}</option>
                      <option value='throttle'>{t('positionThrottle')}</option>
                      <option value='armado'>{t('positionArmed')}</option>
                      <option
                        value='acceleration'>{t('positionAcceleration')}</option>
                      <option
                        value='deviceTemp'>{t('positionDeviceTemp')}</option>
                      <option value='obdSpeed'>{t('positionObdSpeed')}</option>
                      <option
                        value='obdOdometer'>{t('positionObdOdometer')}</option>
                    </Select>
                  </FormControl></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Start:</TableCell>
                  <TableCell><TextField
                    id="outlined-basic"
                    value={state.start}
                    name="start"
                    label="Start"
                    type="number"
                    variant="outlined"
                    inputProps={{
                      name: 'start',
                      shrink: true,
                    }}
                    onChange={handleChangeSelects}
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell><TextField
                    id="outlined-basic"
                    value={state.period}
                    name="period"
                    label="Period"
                    type="number"
                    variant="outlined"
                    inputProps={{
                      name: 'period',
                      shrink: true,
                    }}
                    onChange={handleChangeSelects}
                  /></TableCell>
                </TableRow>
              </Table>
          </DialogContent><br/>
          <Typography>
            Atributos agregados: {attributesList.length} {/*Eliminar linea*/}
          </Typography>
          {!elem ?
            <DialogActions>
              <Button style={{
                display: 'flex',
                position: 'absolute',
                left: '7%',
                bottom: '2%'
              }}
                      onClick={() => handleShowAttributes()} variant="outlined"
                      color="primary">
                ATTRIBUTES
              </Button>
              <Button onClick={handleShowModal} color="primary">
                Cancelar
              </Button>
              <Button onClick={handlePost} color="primary" autoFocus>
                Guardar
              </Button>
            </DialogActions>
            :
            <DialogActions>
              <Button style={{
                display: 'flex',
                position: 'absolute',
                left: '7%',
                bottom: '2%'
              }}
                      onClick={() => handleShowAttributes()} variant="outlined"
                      color="primary">
                ATTRIBUTES
              </Button>
              <Button onClick={handleCancelEdit} color="primary">
                Cancelar
              </Button>
              <Button onClick={() => handleEdit(state)} color="primary" autoFocus>
                Editar
              </Button>
            </DialogActions>
          }
        </Dialog>
      </div>
      <div>
        <Dialog
          open={openAttributes}
          onClose={handleShowAttributes}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description2">
              <TableRow>
                <TableCell>Nombre:</TableCell>
                <TableCell>
                  <TextField
                    label="Name"
                    value={key}
                    name="name"
                    onChange={handleChangeAttributesKey}
                    type="text"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Valor:</TableCell>
              <TableCell> <TextField
                label="Value"
                value={value}
                name="value"
                onChange={handleChangeAttributesValue}
                type="text"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              /></TableCell>
              </TableRow>
            </DialogContentText>

            {/*<Grid item xs={12} md={6}>*/}
            {/*  <Typography variant="h6" >*/}
            {/*    Atributos*/}
            {/*  </Typography>*/}
            {/*  <div className={classes.demoGrid}>*/}
            {/*    <List dense={dense}>*/}
            {/*      {attributesList.map((index,key, value) => (*/}
            {/*        <TableRow key={index}>*/}
            {/*          <TableCell>{key}</TableCell>*/}
            {/*          <TableCell>{value}</TableCell>*/}
            {/*        </TableRow>*/}
            {/*      ))}*/}
            {/*    </List>*/}
            {/*  </div>*/}
            {/*</Grid>*/}
          </DialogContent>
          <DialogActions>
            <Button style={{backgroundColor: `${attributesList.length > 0 ? 'green' : 'transparent'}`}}
              onClick={handleSaveAttributes} color="success" variant="outlined">
              Agregar
            </Button>
            <Button onClick={handleShowAttributes} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleShowAttributes} color="primary" autoFocus>
              Continuar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default MaintenancePage;

