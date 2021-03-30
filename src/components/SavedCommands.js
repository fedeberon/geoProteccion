import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from "@material-ui/core/InputLabel";
import t from "../common/localization";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as service from "../utils/serviceManager";
import SC from "../common/SavedCommandsTypes.json";
import tz from '../common/AllTimezones.json';
import Checkbox from "@material-ui/core/Checkbox";

const styles = makeStyles((theme) => ({
    formControl: {
        margin: "13px 0px",
        // minWidth: '90%',
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
}));

const SavedCommands = ({open, handleCloseModal, data}) => {
  const [ attribute1, setAttribute1 ] = useState();
  const [ attribute2, setAttribute2 ] = useState();
  const [aux, setAux] = useState();
  const [flag, setFlag] = useState();
  const classes = styles();
  const [ openModal, setOpenModal ] = useState(false);
  const [ savedCommandTypes, setSavedCommandTypes ] = useState([]);
  const [ unitTime, setUnitTime ] = useState('');
  const [ isChecked, setIsChecked ] = useState(false); 
  const [ newSavedCommand, setNewSavedCommand] = useState({
    attributes: {},
    description: '',
    deviceId: 0,
    textChannel: false,
    type: '',
  })

  //Closing y reseting savedCommand-Modal
  const closeModal = () => {
    handleCloseModal();
    setNewSavedCommand({
      attributes: {},
      description: '',
      deviceId: 0,
      textChannel: false,
      type: '',
    })
  }

  useEffect(() => {

    setOpenModal(open);
    if(data && data.id >= 0){
      console.log(data);
      console.log(Object.values(data.attributes)[0])
      gettingValues();
      setNewSavedCommand({
        attributes: data.attributes,    
        description: data.description,
        deviceId: data.deviceId,
        id: data.id,
        textChannel: data.textChannel,
        type: data.type,        
      })
    }
  },[open])

  useEffect(()=> {
    console.log(newSavedCommand);
  },[newSavedCommand])

  const get = () => {
    
    console.log(Object.values(newSavedCommand.attributes)[1])
  };

  const getCommandsList = () => {
    return fetch(`api/commands/types`, { method: "GET" })
      .catch(function (error) {
        console.log("setCommandsList error: ", error);
      })
      .then((response) => response.json());
  };

  const getSavedCommands = async () => {
    const response = await getCommandsList();
    setSavedCommandTypes(response);
  }

  useEffect(() =>{
    getSavedCommands();
  },[])

  const handleAdd = () => {
    const add = {};
      add.description = description;
      add.type = type;
      add.textChannel = textChannel;

      console.log(JSON.stringify(add));
  }

  const getCommandTypeName = (type) => {
    let object = SC.SC.find((elem) => elem.type === type);
    if(object)
    return object.name
  }

  const getCommandKey = (type) => {
    let object = SC.SC.find((elem) => elem.type === type);
    if(object)
    return object.key
  }

  const handleSetCheckbox = () => {
    setIsChecked(!isChecked);
    setNewSavedCommand({
      ...newSavedCommand,
      attributes: {
        [getCommandKey(newSavedCommand.type)]: !isChecked,
      }
    })
  }

  const setAttributeRadio = () => {
    if(newSavedCommand.type === 'voiceMonitoring' || newSavedCommand.type === 'setAgps' ||
    newSavedCommand.type === 'modePowerSaving' || newSavedCommand.type === 'modeDeepSleep' ||
    newSavedCommand.type === 'alarmBattery' || newSavedCommand.type === 'alarmSos' ||
    newSavedCommand.type === 'alarmRemove' || newSavedCommand.type === 'alarmFall'){
      setNewSavedCommand({
        ...newSavedCommand,
        attributes: {
          [getCommandKey(newSavedCommand.type)]: isChecked
        }
      })
    } else {
      setNewSavedCommand({
        ...newSavedCommand,
        attributes: {...newSavedCommand.attributes},
      })
    }
  }

  useEffect(()=> {
    setAttributeRadio();
  },[newSavedCommand.type])
  
  const changeUnitTime = (e) => {
    setFlag(true);
    setUnitTime(e.target.value);
  }

  const handleSetAttribute = (e) => {
    e.preventDefault();
    setFlag(false);
    setNewSavedCommand({
      ...newSavedCommand,
      attributes: {
        [getCommandKey(newSavedCommand.type)]: (Number(e.target.value) * unitTime)
      },
    })
  }

  function gettingValues(type) {
    let valuetype = getCommandKey(type);
    let asd;
    if(data){
      Object.entries(data.attributes).map(([key,value]) => {

        switch (key) {
          case 'index':
            asd = value;
          case 'phone':
            asd = value;
            break;
          case 'frequency':
            asd = value;
            break;
          default:
            break;
        }

        // if(key === valuetype){
        //   console.log(value)
        //   setAttribute1(value);
        // } else if (key === 'phone') {
        //   console.log(value)
        //   setAttribute2(value);
        // }      
      })
    }
    return asd;
  }

  return (
      <Dialog
        open={openModal}
        onClose={() => closeModal()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("sharedSavedCommand")}
          <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => closeModal()}
            >
              <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField
              fullWidth
              autoComplete="off"
              label={t("sharedDescription")}
              name="description"
              variant="outlined"
              value={newSavedCommand.description}
              onChange={(e) => setNewSavedCommand({
                ...newSavedCommand,
                description: e.target.value
              })}
            />
            <Typography component="div" style={{marginTop: '15px'}}>
              {t("commandSendSms")}:
              <Radio
                checked={newSavedCommand.textChannel === true}
                onChange={() => setNewSavedCommand({
                  ...newSavedCommand,
                  textChannel: !newSavedCommand.textChannel,
                })}
                color="primary"
                value={true}
                name="radio-button-demo"
                inputProps={{ "aria-label": "A" }}
              />{" "}
              {t("reportYes")}
              <Radio
                checked={newSavedCommand.textChannel === false}
                onChange={() => setNewSavedCommand({
                  ...newSavedCommand,
                  textChannel: !newSavedCommand.textChannel,
                })}
                color="primary"
                value={false}
                name="radio-button-demo"
                inputProps={{ "aria-label": "B" }}
              />{" "}
              {t("reportNo")}
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth={true}
              className={classes.formControl}
              disabled={!newSavedCommand.description}
            >
              <InputLabel>
                {t("sharedType")}
              </InputLabel>
              <Select
                native
                fullWidth
                value={newSavedCommand.type}
                onChange={(e) => setNewSavedCommand({
                  ...newSavedCommand,
                  type: e.target.value,
                })}
                label={t("sharedType")}
                name="type"
                type="text"
                variant="outlined"
                inputlabelprops={{
                  shrink: true,
                }}
              >
                <option aria-label="None" value="" />
                {savedCommandTypes.map((elem) => (
                  <option key={elem.type} value={elem.type}>{t(`${getCommandTypeName(elem.type)}`)}</option>
                ))}
              </Select>
            </FormControl>
            <TextField style={{marginBottom: '15px', display: 
            `${newSavedCommand.type === 'sosNumber' || newSavedCommand.type === 'movementAlarm' ||
               newSavedCommand.type === 'outputControl' ? 'block' : 'none'}`}}
                      fullWidth
                      label={newSavedCommand.type === 'movementAlarm' ? `${t('commandRadius')}` : `${t("commandIndex")}`}
                      name="data"
                      type="number"
                      InputProps={{ 
                        inputProps: { min: 0}
                      }}
                      autoComplete="off"
                      variant="outlined"
                      value={Object.values(newSavedCommand.attributes)[0]}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [getCommandKey(newSavedCommand.type)]: Number(e.target.value),
                        },
                      })}
            />
            <TextField style={{marginBottom: '15px', display: 
            `${newSavedCommand.type === 'custom' || newSavedCommand.type === 'alarmVibration' || newSavedCommand.type === 'alarmClock' ||
              newSavedCommand.type === 'sendSms' || newSavedCommand.type === 'sendUssd' || newSavedCommand.type === 'setIndicator' ||
              newSavedCommand.type === 'sosNumber' || newSavedCommand.type === 'silenceTime' || newSavedCommand.type === 'configuration' ||
              newSavedCommand.type === 'setPhonebook'|| newSavedCommand.type === 'message' || newSavedCommand.type === 'setOdometer' ||
              newSavedCommand.type === 'voiceMessage' || newSavedCommand.type === 'outputControl' || 
              newSavedCommand.type === 'alarmSpeed' ? 'block' : 'none'}`}}
                      fullWidth
                      label={newSavedCommand.type === 'sendSms' ||
                      newSavedCommand.type === 'sendUssd' ||
                      newSavedCommand.type === 'sosNumber' ? `${t("commandPhone")}` : 
                      newSavedCommand.type === 'message' ? `${t('commandMessage')}` : `${t("commandData")}` }
                      name="data"
                      autoComplete="off"
                      variant="outlined"
                      value={Object.values(newSavedCommand.attributes)[1] !== '' ? 
                              Object.values(newSavedCommand.attributes)[1] :
                              Object.values(newSavedCommand.attributes)[0]}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [newSavedCommand.type === 'sosNumber' ? `phone` : newSavedCommand.type === 'outputControl' ? 'data' :
                            getCommandKey(newSavedCommand.type)]: e.target.value,
                        },  
                      })}
            />
            <TextField style={{display: 
            `${newSavedCommand.type === 'setConnection' ? 'block' : 'none'}`}}
                      fullWidth
                      label={t("commandServer")}
                      name="data"
                      autoComplete="off"
                      variant="outlined"
                      value={Object.values(newSavedCommand.attributes)[0]}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [getCommandKey(newSavedCommand.type)]: e.target.value,
                        },
                      })}
            />
            <TextField style={{marginTop: '15px', display: 
            `${newSavedCommand.type === 'setConnection' ? 'block' : 'none'}`}}
                      fullWidth
                      label={t("commandPort")}
                      name="setConnection"
                      type="number"
                      InputProps={{ 
                        inputProps: { 
                          min: 1, 
                          max: 65535
                        }
                      }}
                      autoComplete="off"
                      variant="outlined"
                      value={Object.values(newSavedCommand.attributes)[1]}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [`port`]: Number(e.target.value),
                        },
                      })}
            />
            <TextField style={{display: 
            `${newSavedCommand.type === 'sendSms' ? 'block' : 'none'}`}}
                      fullWidth
                      label={t("commandMessage")}
                      name="data"
                      autoComplete="off"
                      variant="outlined"
                      value={Object.values(newSavedCommand.attributes)[0]}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [`message`]: e.target.value,
                        },
                      })}
            />             
            <FormControl
              variant="outlined"
              fullWidth={true}
              style={{display: '-webkit-box'}}
              >     
                  <TextField style={{width: '75%',
                    display: `${newSavedCommand.type === 'positionPeriodic' ? 'inline-flex' : 'none'}`}}
                    label={t(`commandFrequency`)}
                    name="reportPeriod"
                    InputProps={{ 
                      inputProps: { 
                        min: 0
                      }
                    }}                                
                    type="number"
                    value={Object.values(newSavedCommand.attributes)[0]}
                    variant="outlined"
                    error={flag}
                    disabled={!unitTime}
                    onChange={(e) => handleSetAttribute(e)}
                  />             
                  <Select style={{width: '20%', float: 'right',
                    display: `${newSavedCommand.type === 'positionPeriodic' ? 'flex' : 'none'}`}}
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
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth={true}
              style={{display: `${newSavedCommand.type === 'setTimezone' ? 'flex' : 'none'}`}}       
              >
                  <InputLabel htmlFor="outlined-age-native-simple">
                  {t("commandTimezone")}
                  </InputLabel>
                  <Select 
                      native
                      fullWidth
                      value={Object.values(newSavedCommand.attributes)[0]}                                      
                      name="setTime"
                      type="text"
                      label={t("commandTimezone")}
                      variant="outlined"
                      inputlabelprops={{
                        shrink: true,
                      }}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          [getCommandKey(newSavedCommand.type)]: e.target.value,
                        },
                      })}
                    >
                      <option aria-label="None" value="" />
                      {tz.timezones.sort().map((atr) => (
                        <option key={atr}>{atr}</option>
                      ))}
                    </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth={true}
              style={{display: `${newSavedCommand.type === 'voiceMonitoring' ||
              newSavedCommand.type === 'setAgps' || newSavedCommand.type === 'modeDeepSleep' ||
              newSavedCommand.type === 'modePowerSaving' || newSavedCommand.type === 'alarmSos' ||
              newSavedCommand.type === 'alarmBattery' || newSavedCommand.type === 'alarmFall' ||
              newSavedCommand.type === 'alarmRemove' ? 'block' : 'none'}`}}       
              >
              <Typography component="div">
              {t("commandEnable")}:
              <Radio
                checked={isChecked === true}
                onChange={() => handleSetCheckbox()}
                color="primary"
                value={true}
                name="radio-button-demo"
                inputProps={{ "aria-label": "A" }}
              />{" "}
              {t("reportYes")}
              <Radio
                checked={isChecked === false}
                onChange={() => handleSetCheckbox()}
                color="primary"
                value={false}
                name="radio-button-demo"
                inputProps={{ "aria-label": "B" }}
              />{" "}
              {t("reportNo")}
            </Typography>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeModal()} color="primary">
            {t('sharedCancel')}
          </Button>
          <Button color="primary" autoFocus>
            {t('sharedSave')}
          </Button>
          <Button onClick={get}>get</Button>
        </DialogActions>
      </Dialog>
  );
}

export default SavedCommands;
