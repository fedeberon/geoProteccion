import React, {useEffect, useState} from 'react';
import {TableContainer} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
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
import AttributesDialog from '../components/AttributesDialog';
import IconButton from "@material-ui/core/IconButton";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import {DeleteTwoTone} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import Paper from '@material-ui/core/Paper';

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
  buttonFunctions: {
    minWidth: '48px !important',
  },
  formControl: {
    width: '229px',
    minWidth: 120,
  },
  rowAtri: {
    width: '40px',
    padding: '1px',
    textAlign: 'center',
    paddingRight: '1px !important',
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
  // table: {
  //   minWidth: 350,
  // },
}))


const MaintenancePage = () => {
  const userId = useSelector((state) => state.session.user.id);
  const classes = useStyles();
  const [ maintenance, setMaintenance ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ elem, setElem ] = useState(false);
  const [dialogAttributes, setDialogAttributes] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    id: '',
    name: '',
    type: 'index',
    start: '',
    period: '',
    attributes: {},
  });

  useEffect(() =>{
    getMaintenance(userId);
  },[])

  const getMaintenance = async (userId) => {
    const response = await service.getMaintenance(userId);
    setMaintenance(response);
  }

  const handleChangeSelects = (event) => {
    const name = event.target.name;
    setNewMaintenance({
      ...newMaintenance,
      [name]: event.target.value,
    });
  };

  //Show & Hide modal to add or edit maintenances
  const handleShowModal = (elemento) => {
    setShowModal(!showModal);
    if(elemento){
      setElem(true);
      setNewMaintenance({
        id: elemento.id,
        name: elemento.name,
        type: elemento.type,
        start: elemento.start,
        period: elemento.period,
        attributes: elemento.attributes,
      });
    }
  }

  const handleCancelModal = () => {
    setShowModal(!showModal);
    setNewMaintenance({id:'',name:'',type:'index',start:'',period:'',attributes:{},});
  }

  const handleCancelEdit = () => {
    setNewMaintenance({id:'',name:'',type:'index',start:'',period:'',attributes:{},});
    setElem(false);
    setShowModal(!showModal);
  }

  const handlePost = () => {
    fetch(`api/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(newMaintenance)
    }).then(response => {
      if (response.ok) {
        getMaintenance(userId);
      }
    })
    handleShowModal();
  }

  const handleEdit = (newMaintenance) => {

    fetch(`api/maintenance/${newMaintenance.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(newMaintenance)
    }).then(response => {
      if(response.ok){
        setNewMaintenance({id:'',name:'',type:'index',start:'',period:'',attributes:{},});
        setElem(false);
        getMaintenance(userId);
      }
    })
    setShowModal(!showModal);
  }

  const handleRemoveMaintenance = (id) => {
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

  //Show Attributes configuration
  const handleOpenDialogAttributes = () => {
    setDialogAttributes(true);
  }

  //Hide Attributes configuration
  const handleCloseDialogAttributes = () => {
    setDialogAttributes(false);
  }

  //Set Maintenance's attributes
  const savingAttributes = (objeto) => {
    setNewMaintenance({
        ...newMaintenance,
        attributes: objeto,
      })     
  };

  return (
    <div className={classes.root}>
      <div className="title-section">
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
        <Table >
          <TableHead>
          <TableRow >
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('sharedType')}</TableCell>
            <TableCell>{t('maintenanceStart')}</TableCell>
            <TableCell>{t('maintenancePeriod')}</TableCell>            
            <TableCell align="center"/>
          </TableRow>
          </TableHead>
          <TableBody>
            {maintenance.map((el, index)=>(
              <TableRow key={el.id}>
                <TableCell>{el.name}</TableCell>
                <TableCell>{el.type}</TableCell>
                <TableCell>{el.start}</TableCell>
                <TableCell>{el.period}</TableCell>                
                <TableCell align="center" style={{display: 'inline-flex'}}>
                  <Button className={classes.buttonFunctions} onClick={() => handleShowModal(el)}title={t('sharedEdit')}
                  >
                    <EditTwoToneIcon/>
                  </Button>
                  <Button className={classes.buttonFunctions} onClick={() => handleRemoveMaintenance(el.id)} title={t('sharedRemove')}
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
          id="addmaintenance" 
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
              <TableBody>
                <TableRow>
                  <TableCell>{t('sharedName')}:</TableCell>
                  <TableCell>
                    <TextField
                      id="outlined-basic"
                      value={newMaintenance.name}
                      name="name"
                      autoComplete="off"
                      variant="outlined"
                      onChange={handleChangeSelects}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('sharedType')}:</TableCell>
                  <TableCell>
                    <FormControl variant="outlined"
                                className={classes.formControl}>
                      <Select
                        native
                        value={newMaintenance.type}
                        onChange={handleChangeSelects}
                      >
                        <option value='index'>{t('positionIndex')}</option>
                        <option value='hdop'>{t('positionHdop')}</option>
                        <option value='vdop'>{t('positionVdop')}</option>
                        <option value='pdop'>{t('positionPdop')}</option>
                        <option value='sat'>{t('positionSat')}</option>
                        <option value='satVisible'>{t('positionSatVisible')}</option>
                        <option value='rssi'>{t('positionRssi')}</option>
                        <option value='gps'>{t('positionGps')}</option>
                        <option value='odometer'>{t('positionOdometer')}</option>
                        <option value='odometerMaintenance'>{t('positionServiceOdometer')}</option>
                        <option value='odometerTrip'>{t('positionTripOdometer')}</option>
                        <option value='hours'>{t('positionHours')}</option>
                        <option value='steps'>{t('positionSteps')}</option>
                        <option value='power'>{t('positionPower')}</option>
                        <option value='batery'>{t('positionBattery')}</option>
                        <option value='bateryLevel'>{t('positionBatteryLevel')}</option>
                        <option value='fuel'>{t('positionFuel')}</option>
                        <option value='fuelConsumtion'>{t('positionFuelConsumption')}</option>
                        <option value='distance'>{t('sharedDistance')}</option>
                        <option value='totalDistance'>{t('deviceTotalDistance')}</option>
                        <option value='rpm'>{t('positionRpm')}</option>
                        <option value='throttle'>{t('positionThrottle')}</option>
                        <option value='armado'>{t('positionArmed')}</option>
                        <option value='acceleration'>{t('positionAcceleration')}</option>
                        <option value='deviceTemp'>{t('positionDeviceTemp')}</option>
                        <option value='obdSpeed'>{t('positionObdSpeed')}</option>
                        <option value='obdOdometer'>{t('positionObdOdometer')}</option>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('maintenanceStart')}:</TableCell>
                  <TableCell><TextField
                    id="outlined-basic"
                    value={newMaintenance.start}
                    name="start"
                    type="number"
                    autoComplete="off"
                    variant="outlined"
                    onChange={handleChangeSelects}
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('maintenancePeriod')}:</TableCell>
                  <TableCell><TextField
                    id="outlined-basic"
                    value={newMaintenance.period}
                    name="period"
                    type="number"
                    variant="outlined"
                    onChange={handleChangeSelects}
                  /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent><br/>
          {!elem ?
            <DialogActions>
              <Button style={{
                display: 'flex',
                position: 'absolute',
                left: '7%',
                bottom: '2%'}}
                      onClick={() => handleOpenDialogAttributes()} variant="outlined"
                      color="primary">
                {t('sharedAttributes')}
              </Button>
              <Button onClick={() => handleCancelModal()} color="primary">
                {t('sharedCancel')}
              </Button>
              <Button onClick={handlePost} color="primary" autoFocus>
                {t('sharedSave')}
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
                      onClick={() => handleOpenDialogAttributes(newMaintenance.attributes)} variant="outlined"
                      color="primary">
                {t('sharedAttributes')}
              </Button>
              <Button onClick={handleCancelEdit} color="primary">
                {t('sharedCancel')}
              </Button>
              <Button onClick={() => handleEdit(newMaintenance)} color="primary" autoFocus>
                {t('sharedEdit')}
              </Button>
            </DialogActions>
          }
        </Dialog>
      </div>
      {/*MODAL ATTRIBUTES*/}
      <div>
          <AttributesDialog  
            data={newMaintenance.attributes}
            savingAttributes={savingAttributes} 
            open={dialogAttributes} 
            close={handleCloseDialogAttributes}
          />
      </div>      
    </div>
  );
}

export default MaintenancePage;

