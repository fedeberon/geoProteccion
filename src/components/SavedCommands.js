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
import tz from '../common/AllTimezones.json'

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

const SavedCommands = ({open, handleCloseModal}) => {
  const [aux, setAux] = useState();
  const [flag, setFlag] = useState();
  const classes = styles();
  const [ openModal, setOpenModal ] = useState();
  const [ savedCommandTypes, setSavedCommandTypes ] = useState([]);
  const [ unitTime, setUnitTime ] = useState('');
  const [ newSavedCommand, setNewSavedCommand] = useState({
    attributes: {},
    description: '',
    deviceId: 0,
    textChannel: false,
    type: '',
  })

  useEffect(() => {
    setOpenModal(open);
  },[open])

  const get = () => {
    SC.SC.map(((object) => {     
       console.log(object?.type);
    }))
  };

  useEffect(()=> {
    console.log(newSavedCommand);
  }, [newSavedCommand])

  const getCommandsList = () => {
    return fetch(`api/commands/types`, { method: "GET" })
      .catch(function (error) {
        console.log("setCommandsList error: ", error);
      })
      .then((response) => response.json());
  };

  useEffect(() =>{
    const getSavedCommands = async () => {
      const response = await getCommandsList();
      setSavedCommandTypes(response);
    }
    getSavedCommands();
  },[])

  const handleChangeReportPeriod = (event) => {
    setReportPeriod(event.target.value);
  }

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


  const changeUnitTime = (e) => {
    setFlag(true);
    setUnitTime(e.target.value);
    // setNewSavedCommand({
    //   ...newSavedCommand,
    //   attributes: {
    //     [getCommandKey(newSavedCommand.type)]: ,
    //   }
    // })
  }

  const handleSetAttribute = (e) => {
    e.preventDefault();
    setFlag(false);
    setAux(e.target.value * unitTime);
    setNewSavedCommand({
      ...newSavedCommand,
      attributes: {
        [getCommandKey(newSavedCommand.type)]: (Number(e.target.value) * unitTime)
      },
    })
  }

  return (
      <Dialog
        open={openModal}
        onClose={() => handleCloseModal()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("sharedSavedCommand")}
          <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => handleCloseModal()}
            >
              <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField
              fullWidth
              autoComplete="off"
              id="outlined-basic"
              label={t("sharedDescription")}
              name="description"
              variant="outlined"
              value={newSavedCommand.description}
              onChange={(e) => setNewSavedCommand({
                ...newSavedCommand,
                description: e.target.value
              })}
            />
            <Typography style={{marginTop: '15px'}}>
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
              <InputLabel htmlFor="outlined-age-native-simple">
                {t("sharedType")}
              </InputLabel>
              <Select
                native
                fullWidth
                value={newSavedCommand.type}
                onChange={(e) => setNewSavedCommand({
                  ...newSavedCommand,
                  type: e.target.value,
                  attributes: {},                 
                })}
                label={t("sharedType")}
                name="type"
                type="text"
                variant="outlined"
                InputLabelProps={{
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
            `${newSavedCommand.type === 'sosNumber' ? 'block' : 'none'}`}}
                      fullWidth
                      id="outlined-basic"
                      label={t("commandIndex")}
                      name="data"
                      type="number"
                      autoComplete="off"
                      variant="outlined"
                      //value={newSavedCommand.attributes}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [getCommandKey(newSavedCommand.type)]: e.target.value,
                        },
                      })}
            />
            <TextField style={{marginBottom: '15px', display: 
            `${newSavedCommand.type === 'custom' ||
              newSavedCommand.type === 'alarmVibration' ||
              newSavedCommand.type === 'sendSms' ||
              newSavedCommand.type === 'sendUssd' ||
              newSavedCommand.type === 'sosNumber' ? 'block' : 'none'}`}}
                      fullWidth
                      id="outlined-basic"
                      label={newSavedCommand.type === 'sendSms' ||
                      newSavedCommand.type === 'sendUssd' ||
                      newSavedCommand.type === 'sosNumber' ? `${t("commandPhone")}` : `${t("commandData")}` }
                      name="data"
                      autoComplete="off"
                      variant="outlined"
                      //value={newSavedCommand.attributes}
                      onChange={(e) => setNewSavedCommand({
                        ...newSavedCommand,
                        attributes: {
                          ...newSavedCommand.attributes,
                          [newSavedCommand.type === 'sosNumber' ? `phone` :
                            getCommandKey(newSavedCommand.type)]: e.target.value,
                        },
                      })}
            />
            <TextField style={{display: 
            `${newSavedCommand.type === 'sendSms' ? 'block' : 'none'}`}}
                      fullWidth
                      id="outlined-basic"
                      label={t("commandMessage")}
                      name="data"
                      autoComplete="off"
                      variant="outlined"
                      //value={newSavedCommand.attributes}
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
                    id="outlined-basic"
                    minValue={0}
                    label={t(`commandFrequency`)}
                    name="reportPeriod"                                
                    type="number"
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
                      //value={}                                       
                      name="setTime"
                      type="text"
                      label={t("commandTimezone")}
                      variant="outlined"
                      InputLabelProps={{
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
                      {tz.timezones.map((atr) => (
                        <option key={atr}>{atr}</option>
                      ))}
                    </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal()} color="primary">
            Disagree
          </Button>
          <Button color="primary" autoFocus>
            Agree
          </Button>
          <Button onClick={get}>
              GET
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default SavedCommands;
