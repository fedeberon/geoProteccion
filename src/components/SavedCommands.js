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

  const classes = styles();
  const [ openModal, setOpenModal ] = useState();
  const [ savedCommandTypes, setSavedCommandTypes ] = useState([]);
  const [ description, setDescription ] = useState('');
  const [ type, setType ] = useState('');
  const [ textChannel, setTextChannel ] = useState(false);
  const [ data, setData ] = useState('');
  const [ reportPeriod, setReportPeriod ] = useState('');

  useEffect(() => {
    setOpenModal(open);
  },[open])

  const get = () => {
    console.log(savedCommandTypes);
  }

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

  const handleChangeRadioCommand = () => {
    setTextChannel(!textChannel);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleChangeData = (event) => {
    setData(event.target.value)
  }

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
              id="outlined-basic"
              label={t("sharedDescription")}
              name="description"
              variant="outlined"
              value={description}
              onChange={handleChangeDescription}
            />
            <Typography>
              {t("commandSendSms")}:
              <Radio
                checked={textChannel === true}
                onClick={handleChangeRadioCommand}
                color="primary"
                value={true}
                name="radio-button-demo"
                inputProps={{ "aria-label": "A" }}
              />{" "}
              {t("reportYes")}
              <Radio
                checked={textChannel === false}
                onChange={handleChangeRadioCommand}
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
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                {t("sharedType")}
              </InputLabel>
              <Select
                native
                fullWidth
                value={type}
                onChange={handleChangeType}
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
                  <option key={elem.type} value={elem.type}>{elem.type}</option>
                ))}
              </Select>
            </FormControl>
            <TextField style={{display: `${type === 'custom' ? 'block' : 'none'}`}}
                       fullWidth
                       id="outlined-basic"
                       label={t("commandData")}
                       name="data"
                       variant="outlined"
                       value={data}
                       onChange={handleChangeData}
            />
            <TextField style={{display: `${type === 'positionPeriodic' ? 'block' : 'none'}`}}
                       fullWidth
                       id="outlined-basic"
                       label={t("commandPositionPeriodic")}
                       name="reportPeriod"
                       type="number"
                       variant="outlined"
                       value={reportPeriod}
                       onChange={handleChangeReportPeriod}
            />
            <FormControl
              variant="outlined"
              fullWidth={false}
              className={classes.formControl}
            >
              <Select style={{display: `${type === 'positionPeriodic' ? 'block' : 'none'}`}}
                native
                // value={type}
                // onChange={handleChangeType}
                name="type"
                type="text"
                variant="outlined"
              >
                <option value="s">s</option>
                <option value="s">m</option>
                <option value="s">h</option>
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
          <Button >
              GET
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default SavedCommands;
