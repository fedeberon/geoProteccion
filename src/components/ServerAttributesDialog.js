import React, { useEffect, useState, Fragment } from "react";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import t from "../common/localization";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import * as service from "../utils/serviceManager";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import {DeleteTwoTone} from "@material-ui/icons";
import tz from '../common/AllTimezones.json'

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    container: {
        marginTop: theme.spacing(2),
        height: "60%",
    },
    formControlAttribute: {
        width: '38%', 
        marginLeft: '10px',
        [theme.breakpoints.up("md")]: {
            width: '39.9%', 
        },
    },
    valueField: {
        margin: '5px 0', 
        height: '40px'
    },
}))


const ServerAttributesDialog = ({open, close, savingAttributes, data}) => {

    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [newAttribute, setNewAttribute] = useState({}); 
    const [attributes, setAttributes] = useState({}); 
    const [title, setTitle] = useState(`${t('sharedAdd')}`);
    const [editRow, setEditRow] = useState(false);

    useEffect(()=>{
     setOpenDialog(open);
    },[open]);

    const handleClose = () => {
     setEditRow(false);
     setNewAttribute({name: '', value: ''});
     close();
    };   
    
    const handleCloseAttributes = () => {
      close();
    }

    useEffect(()=> {
      setAttributes(data);
    },[data]);

    const handleEdit = (attribute) => {
      setNewAttribute({name: attribute[0], value: attribute[1]});
      setTitle(`${t('sharedEdit')}`);
      setEditRow(true);
    }
    
    const removeAttribute = (dato) => {    
      const copy = {...attributes}
      delete copy[dato[0]];
      setAttributes(copy);
    }

    const callFunction = () => {      
      setAttributes({
        ...attributes,
        [newAttribute.name]: newAttribute.value,
      });
      setTitle(`${t('sharedAdd')}`);
      setEditRow(false);
      setNewAttribute({name: '', value: ''});      
    }

    const handleSetAttributes = () => {
      savingAttributes(attributes);
      close();
    }

    function OptionsValues () {
      
      switch (newAttribute.name) {
        case 'volumeUnit': 
          return <>
                 <option value="ltr" >{t('sharedLiter')}</option>
                 <option value="impGal" >{t('sharedImpGallon')}</option>
                 <option value="usGal" >{t('sharedUsGallon')}</option>
                 </>
          break;
        case 'timezone': 
        return <>              
              {tz.timezones.map((atr, index) => (
                <option key={atr}>{atr}</option>
              ))}
                </>
        case 'speedUnit': 
        return <>
               <option value="kn" >{t('sharedKn')}</option>
               <option value="kmh" >{t('sharedKmh')}</option>
               <option value="mph" >{t('sharedMph')}</option>
               </>
          break;
        case 'distanceUnit' :
          return <>
                <option value="km" >{t('sharedKm')}</option>
                <option value="mi" >{t('sharedMi')}</option>
                <option value="nmi" >{t('sharedNmi')}</option>
                </>
        default: 
          return null;
      } 
    }

    function ValueField () {
      
      switch (newAttribute.name) {

        case "ui.disableVehicleFetures": case "ui.disableEvents": case "ui.disableReport":
        case "ui.disableComputedAttributes": case "ui.disableDrivers": case "report.ignoreOdometer":
        case "ui.disableMaintenance": case "ui.disableCalendars":
          
          return <Fragment>
                    <Checkbox
                        checked={newAttribute.value}
                        value={newAttribute.value}
                        onChange={() =>
                          setNewAttribute({
                            ...newAttribute,
                            value: !newAttribute.value,
                          })
                        }
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                 </Fragment>
          break;
        default:           
          return <Fragment>
                    <Select
                    className={classes.valueField}
                    native
                    value={newAttribute.value}
                    placeholder={`${editRow ? `${newAttribute.value}` : `${t('sharedName')}`}`}
                    onChange={(e) =>
                        setNewAttribute({
                          ...newAttribute,
                          value: e.target.value })
                      }                      
                    >
                    <option aria-label="None" value=""/>
                      <Fragment>
                        <OptionsValues/>
                      </Fragment>                                                      
                    </Select>
                </Fragment>
      }
    }

    return (
      
        <div>          
          <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{t('sharedAttributes')}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleCloseAttributes}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
              <div style={{display: 'inline-block'}}>            
                <div style={{marginBottom: '25px', maxHeight: '200px'}}> 
                  <form style={{borderBottomStyle: 'inset', borderTopStyle: 'outset'}}>
                    <FormControl                    
                      variant="outlined"
                      fullWidth={true}
                      className={classes.formControlAttribute}
                    >
                        <Select
                        style={{margin: '5px 0', height: '40px'}} 
                        native
                        value={newAttribute.name}
                        placeholder={`${editRow ? `${newAttribute.name}` : `${t('sharedName')}`}`}
                        onChange={(e) => 
                          setNewAttribute({                            
                            name: e.target.value,
                            value: '',
                          })
                        }                      
                        >
                        <option aria-label="None" value=""/>
                        <option key={0} value="attributeSpeedLimit">{t("attributeSpeedLimit")}</option>
                        <option key={1} value="report.ignoreOdometer">{t("attributeReportIgnoreOdometer")}</option>
                        <option key={2} value="web.liveRouteLength">{t("attributeWebLiveRouteLength")}</option>
                        <option key={3} value="web.selectZoom">{t("attributeWebSelectZoom")}</option>
                        <option key={4} value="web.maxZoom">{t("attributeWebMaxZoom")}</option>
                        <option key={5} value="ui.disableReport">{t("attributeUiDisableReport")}</option>
                        <option key={6} value="ui.disableEvents">{t("attributeUiDisableEvents")}</option>
                        <option key={7} value="ui.disableVehicleFetures">{t("attributeUiDisableVehicleFetures")}</option>
                        <option key={8} value="ui.disableDrivers">{t("attributeUiDisableDrivers")}</option>
                        <option key={9} value="ui.disableComputedAttributes">{t("attributeUiDisableComputedAttributes")}</option>
                        <option key={10} value="ui.disableCalendars">{t("attributeUiDisableCalendars")}</option>
                        <option key={11} value="ui.disableMaintenance">{t("attributeUiDisableMaintenance")}</option>
                        <option key={12} value="ui.hidePositionAttributes">{t("attributeUiHidePositionAttributes")}</option>
                        <option key={13} value="distanceUnit">{t("settingsDistanceUnit")}</option>
                        <option key={14} value="speedUnit">{t("settingsSpeedUnit")}</option>
                        <option key={15} value="volumeUnit">{t("settingsVolumeUnit")}</option>
                        <option key={16} value="timezone">{t("sharedTimezone")}</option>
                        </Select>
                        
                    </FormControl>
                    <FormControl
                      style={{marginRight: '5px', verticalAlign: 'middle', 
                      display: newAttribute.name === 'attributeSpeedLimit' ? 'inline-table' : ''}}
                      variant="outlined"
                      fullWidth={true}
                      className={classes.formControlAttribute}
                    >
                      {newAttribute.name === 'ui.hidePositionAttributes'  ? 
                        <TextField
                        style={{marginTop: '5px', marginBottom: '5px'}}
                        placeholder={t('stateValue')}
                        id="outlined-margin-dense-value"
                        margin="dense"
                        variant="outlined"
                        autoComplete="off"
                        value={newAttribute.value}
                        name="value"
                        type="text"
                        onChange={(e) =>
                          setNewAttribute({
                            ...newAttribute,
                            value: e.target.value })
                        }                    
                        /> 
                        : newAttribute.name === 'attributeSpeedLimit' ||
                          newAttribute.name === 'web.liveRouteLength' ||
                          newAttribute.name === 'web.selectZoom' ||
                          newAttribute.name === 'web.maxZoom' ? 
                          <Fragment>
                          <TextField
                            style={{marginTop: '5px', marginBottom: '5px'                            
                            }}
                            title={newAttribute.name === 'attributeSpeedLimit' ? `${newAttribute.value} ${t('sharedKn')}` : ''}
                            placeholder={t('stateValue')}
                            id="outlined-margin-dense-value"
                            margin="dense"
                            variant="outlined"
                            autoComplete="off"
                            value={newAttribute.value}
                            name="value"
                            type="number"
                            onChange={(e) =>
                              setNewAttribute({
                                ...newAttribute,
                                value: e.target.value > 0 ? e.target.value : '' })
                            }                    
                          /> 
                          <span style={{verticalAlign: 'middle', 
                          display: newAttribute.name === 'attributeSpeedLimit' ? 'table-cell' : 'none', 
                          paddingLeft: '5px'}}>Nudos</span>
                          </Fragment>                         
                          :
                        <ValueField/>
                      }  
                    </FormControl>
                      <Button  
                        onClick={() => callFunction()}
                        title={title}
                        disabled={!newAttribute.name || newAttribute.value === null}
                        style={{
                        backgroundColor: '#82f582', 
                        minWidth: '40px', 
                        display: 'inline-block', 
                        margin: '7px 2px'
                        }}
                        variant="outlined"
                      >
                        <i style={{fontSize: '17px', color: 'white'}} className="fas fa-plus"></i>
                      </Button>
                  </form>
                </div>    
                <div style={{display: `${editRow ? 'flex' : 'none'}`}}>
                  <Button variant="outlined" size="small" color="primary"
                   style={{margin: '0 auto'}} onClick={function() {
                    setEditRow(false);
                    setNewAttribute({name: '', value: ''});
                  }}>Cancelar Edicion</Button>
                </div>      
            </div>
        <DialogContent id="ContentServerDialog">
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('sharedName')}</TableCell>
                  <TableCell>{t('stateValue')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>                
                {Object.entries(attributes).map((attribute, index) => (
                  <TableRow key={attribute[0]}>
                  <TableCell title={`${t('sharedEdit')}`} style={{cursor: 'pointer'}}
                  onClick={() => handleEdit(attribute)}
                //   >{t(`${attribute[0]}`)}
                    >{attribute[0]}
                  </TableCell>
                  <TableCell title={`${t('sharedEdit')}`} style={{cursor: 'pointer'}}
                  onClick={() => handleEdit(attribute)}
                //   >{t(`${attribute[1]}`)}
                    >{attribute[1] === true || attribute[1] === false ? `${Boolean(attribute[1])}` : 
                    attribute[0] === 'attributeSpeedLimit' ? `${parseFloat(attribute[1])} ${t('sharedKn')}` : attribute[1]}
                  </TableCell>
                  <TableCell align="right">
                    <Button title={t('sharedRemove')}>
                      <DeleteTwoTone title={`${t('sharedRemove')}`} 
                      id="rmv-button"onClick={() => removeAttribute(attribute)}/>
                    </Button> 
                  </TableCell>
                </TableRow>
                ))}                      
             </TableBody>       
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
        
          <Button onClick={handleClose} color="primary">
            {t('sharedCancel')}
          </Button>
          <Button onClick={handleSetAttributes} color="primary" autoFocus>
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
}

export default ServerAttributesDialog;