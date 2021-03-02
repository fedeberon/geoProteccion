import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from "@material-ui/core/withWidth";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Snackbar from '@material-ui/core/Snackbar';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import t from "../common/localization";
import MuiAlert from '@material-ui/lab/Alert';
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import InputLabel from "@material-ui/core/InputLabel";
import Container from '@material-ui/core/Container';
import DialogActions from "@material-ui/core/DialogActions";
import * as service from "../utils/serviceManager";
import userPageStyle from "./styles/UserPageStyle";
import { getDate } from "../utils/functions";
import {DeleteTwoTone, Label} from "@material-ui/icons";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import SavedCommands from '../components/SavedCommands';
import UserData from '../components/UserData';

const styles = (theme) => ({});

const useStyles = userPageStyle;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function createData(field, userData) {
  userData = userData !== undefined ? userData.toString() : "";
  return { field, userData };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const UserPage = () => {
  const classes = useStyles();
  const [openSnackSuccess, setOpenSnackSuccess] = useState(false);
  const user = useSelector((state) => state.session.user);
  const storeServer = useSelector((state) => state.session.server);
  const [ rows, setRows ] = useState([]);
  const [ value, setValue ] = React.useState(0);
  const [ showAdministration, setShowAdministration ] = useState(false);
  const [ capsMap, setCapsMap ] = useState([]);
  const [ fromDateTime, setFromDateTime ] = useState("");
  const [ toDateTime, setToDateTime ] = useState("");
  const [ openModalCommand, setOpenModalCommand ] = useState(false);
  const [ server, setServer ] = useState(storeServer);
  const [ statistics, setStatistics ] = useState([]);
  const [ computedAttributes, setComputedAttributes ] = useState([]);
  const [ savedCommands, setSavedCommands ] = useState([]);
  const [ openModalComputedAttribute, setOpenModalComputedAttribute ] = useState(false);
  const [ objectComputedAttribute, setObjectComputedAttribute ] = useState({
    description: '',
    attribute: 'raw',
    expression: '',
    type: '',
  })

  let to = '';
  let from = '';

  useEffect(()=>{
    setDate();
  },[fromDateTime,toDateTime])

  const setDate = () => {
    to = toDateTime.toString();
    from = fromDateTime.toString();
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackSuccess(false);
  };


  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value);
  };

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value);
  };

  const showStatics = async(from,to) => {
    const response = await service.getStatistics(from,to);
    setStatistics(response);
  }

  const showComputedAttributes = async() => {
    const response = await service.getComputedAttributes();
    setComputedAttributes(response);
    console.log(computedAttributes);
  }

  const handleShowComputedAttribute = (object) => {
    setOpenModalComputedAttribute(!openModalComputedAttribute);
    if(object){
      setObjectComputedAttribute({
        description: object.description,
        attribute: object.attribute,
        expression: object.expression,
        type: object.type,
      })
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseModalCommand = () => {
    setOpenModalCommand(false);
  };

  const showMenuAdmin = () => {
    setShowAdministration(!showAdministration);
  };

  const handleOpenCommandModal = () => {
    setOpenModalCommand(true);
  };

  const handleChangeType = (event) => {
    setCapsMap(event.target.value);
  };

  const handleSaveServer = () => {
    const updateServer = async () => {
      let response = await service.updateServer(server);

      dispatchEvent(sessionActions.setServer(response));
      setServer(response);
    };
    updateServer()
    .then(response => response)
    .then(response => setOpenSnackSuccess(true));
  };

  const handleCloseModalCommands = () => {
    setOpenModalCommand(false);
  }

  useEffect(() => {
    let name = createData(t("sharedName"), user.name);
    let email = createData(t("userEmail"), user.email);
    let phone = createData(t("sharedPhone"), user.phone);
    let map = createData(t("mapTitle"), user.map);
    let latitude = createData(t("positionLatitude"), user.latitude);
    let longitude = createData(t("positionLongitude"), user.longitude);
    let zoom = createData(t("serverZoom"), user.zoom);
    let attributes = createData(t("sharedAttributes"), "NOT FINISHED");
    let twelveHourFormat = createData(
      t("settingsTwelveHourFormat"),
      user.twelveHourFormat
    );
    let coordinatesFormat = createData(
      t("settingsCoordinateFormat"),
      user.coordinateFormat
    );
    setRows([
      name,
      email,
      phone,
      map,
      latitude,
      longitude,
      zoom,
      attributes,
      twelveHourFormat,
      coordinatesFormat,
    ]);
  }, [user]);

  useEffect(() => {
    setServer({
      ...storeServer,
      mapUrl: storeServer.mapUrl.replace(/&amp;/g, "&"),
    });
  }, [storeServer]);

  const getSavedCommands = async () => {
    const response = await service.getCommands();
    setSavedCommands(response);
  }

  return (
    <div className={classes.root}>
      <div
        className={classes.subtitles}
        style={{ justifyContent: "space-between", display: "flex" }}
      >
       <p>{t("settingsUser")}</p>
        <Typography>
          {user.administrator && 
            <Button
              onClick={() => showMenuAdmin()}
              button
              style={{ textTransform: "capitalize" }}
            >
              Administrador
            </Button>
          }
        </Typography>
      </div>
      <div
        className={classes.rootTab}
        style={{ display: `${showAdministration ? "block" : "none"}` }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label={t('commandServer')} {...a11yProps(0)} />
          <Tab label={t('statisticsTitle')} {...a11yProps(1)} />
          <Tab onClick={showComputedAttributes} label={t('sharedComputedAttributes')} {...a11yProps(2)} />
          <Tab onClick={getSavedCommands} label={t('sharedSavedCommands')} {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0} style={{ paddingBottom: "10%" }}>
          <Container style={{textAlign: 'center', width: '50%'}} component={Paper}>
           <p className={classes.subtitles}>{t("settingsTitle")}</p>

              <ButtonGroup className={classes.buttonGroup}
                variant="text"
                color="default"
                aria-label="text primary button group"
              >
                <Button>{t("sharedAttributes")}</Button>
                <Button>
                  <i className="fas fa-map-marker-alt" />
                  &nbsp;{t("sharedGetMapState")}
                </Button>
              </ButtonGroup>

            <div className={classes.centerItems}>
                <Table style={{ display: "contents" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t("mapLayer")}:</TableCell>
                      <TableCell>
                        <FormControl
                          variant="outlined"
                          className={classes.formControlType}
                        >
                          <Select
                            style={{ width: "229px" }}
                            native
                            value="custom"
                            onChange={handleChangeType}
                          >
                            <option aria-label="None" value="" />
                            {/*{typesValues.map((types, index) => (*/}
                            <option key={1} value="custom">
                              {t("mapCustom")}
                            </option>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("mapCustomLabel")}:</TableCell>
                      <TableCell>
                        <TextField
                          label={t("mapCustomLabel")}
                          value={server.mapUrl}
                          onChange={(e) =>
                            setServer({ ...server, mapUrl: e.target.value })
                          }
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("positionLatitude")}:</TableCell>
                      <TableCell>
                        <TextField
                          id="outlined-number"
                          label="Number"
                          value={server.latitude}
                          onChange={(e) =>
                            setServer({ ...server, latitude: e.target.value })
                          }
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("positionLongitude")}:</TableCell>
                      <TableCell>
                        <TextField
                          label="Number"
                          value={server.longitude}
                          onChange={(e) =>
                            setServer({ ...server, longitude: e.target.value })
                          }
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("serverZoom")}:</TableCell>
                      <TableCell>
                        <TextField
                          label="Number"
                          value={server.zoom}
                          onChange={(e) =>
                            setServer({ ...server, zoom: e.target.value })
                          }
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("settingsTwelveHourFormat")}:</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={server.twelveHourFormat}
                          onChange={() =>
                            setServer({
                              ...server,
                              twelveHourFormat: !server.twelveHourFormat,
                            })
                          }
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("serverForceSettings")}:</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={server.forceSettings}
                          onChange={() =>
                            setServer({
                              ...server,
                              forceSettings: !server.forceSettings,
                            })
                          }
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("settingsCoordinateFormat")}:</TableCell>
                      <TableCell>
                        <FormControl
                          style={{ width: "229px" }}
                          variant="outlined"
                          className={classes.formControlType}
                        >
                          <Select
                            native
                            value={server.coordinateFormat}
                            onChange={(e) =>
                              setServer({
                                ...server,
                                coordinateFormat: e.target.value,
                              })
                            }
                          >
                            {/*{typesValues.map((types, index) => (*/}
                            <option key={"dd"} value="dd">
                              {t("sharedDecimalDegrees")}
                            </option>
                            <option key={"ddm"} value="ddm">
                              {t("sharedDegreesDecimalMinutes")}
                            </option>
                            <option key={"dms"} value="dms">
                              {t("sharedDegreesMinutesSeconds")}
                            </option>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("mapPoiLayer")}:</TableCell>
                      <TableCell>
                        <TextField
                          label={t("mapPoiLayer")}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
            </div>
              <p className={classes.subtitles}>{t("sharedPermissions")}</p>
            <div className={classes.centerItems}>
                <Table style={{ display: "contents" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t("serverRegistration")}:</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={server.registration}
                          onChange={() => setServer({
                            ...server,
                            registration: !server.registration
                          })}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("serverReadonly")}:</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={server.readonly}
                          onChange={() => setServer({
                            ...server,
                            readonly: !server.readonly
                          })}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("userDeviceReadonly")}:</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={server.deviceReadonly}
                          onChange={() => setServer({
                            ...server,
                            deviceReadonly: !server.deviceReadonly
                          })}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("userLimitCommands")}:</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={server.limitCommands}
                          onChange={() => setServer({
                            ...server,
                            limitCommands: !server.limitCommands
                          })}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
            </div>
            <div>
              <Button style={{margin: '20px 0px'}}
               onClick={() => handleSaveServer()}
               fullWidth color="primary" 
               variant="outlined">
                {t('sharedSave')}
              </Button>
            </div>
            </Container>
          </TabPanel>

        {/*ADMIN STATISTICS*/}
        <TabPanel value={value} index={1}>
          <div>
            <form>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {t("reportFrom")}:
                  </TableCell>
                  <TableCell>
                    <form className={classes.containerDateTime} noValidate>
                      <TextField
                        label={t('reportFrom')}
                        value={fromDateTime.toString()}
                        onChange={onChangeFromDateTime}
                        type="date"
                        defaultValue="2020-11-09T00:30"
                        className={classes.textFieldDateTime}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </form>
                  </TableCell>
                  <TableCell>{t("reportTo")}:</TableCell>
                  <TableCell>
                    <form className={classes.containerDateTime} noValidate>
                      <TextField
                        label={t('reportTo')}
                        value={toDateTime.toString()}
                        onChange={onChangeToDateTime}
                        type="date"
                        defaultValue={new Date()}
                        className={classes.textFieldDateTime}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </form>
                  </TableCell>
                  <TableCell>
                    <Button button onClick={() => showStatics(fromDateTime, toDateTime)} variant="outlined" color="default">
                      {t('reportShow')}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </form>
          </div>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('statisticsCaptureTime')}</TableCell>
                  <TableCell>{t('statisticsActiveUsers')}</TableCell>
                  <TableCell>{t('statisticsActiveDevices')}</TableCell>
                  <TableCell>{t('statisticsRequests')}</TableCell>
                  <TableCell>{t('statisticsMessagesReceived')}</TableCell>
                  <TableCell>{t('statisticsMessagesStored')}</TableCell>
                  <TableCell>{t('notificatorMail')}</TableCell>
                  <TableCell>{t('notificatorSms')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.map((el) => (
                  <TableRow key={el.id}>
                    <TableCell>{getDate(el.captureTime)}</TableCell>
                    <TableCell>{el.activeUsers}</TableCell>
                    <TableCell>{el.activeDevices}</TableCell>
                    <TableCell>{el.requests}</TableCell>
                    <TableCell>{el.messagesReceived}</TableCell>
                    <TableCell>{el.messagesStored}</TableCell>
                    <TableCell>{el.mailSent}</TableCell>
                    <TableCell>{el.smsSent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabPanel>

        {/*ADMIN COMPUTED ATTRIBUTES*/}
        <TabPanel value={value} index={2}>
          <div style={{padding: '20px 0px !important'}}>
            <form>
              <div className={classes.buttonGroup}>
                <ButtonGroup
                  variant="text"
                  color="default"
                  aria-label="text primary button group"
                >
                  <Button onClick={handleShowComputedAttribute}>
                    <i className="fas fa-plus" />
                    &nbsp;{t('sharedAdd')}
                  </Button>
                  <Button>
                    <i className="fas fa-edit" />
                    &nbsp;{t('sharedEdit')}
                  </Button>
                  <Button>
                    <i className="fas fa-trash-alt" />
                    &nbsp;{t('sharedRemove')}
                  </Button>
                </ButtonGroup>
              </div>
            </form>
          </div>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('sharedDescription')}</TableCell>
                  <TableCell>{t('sharedAttribute')}</TableCell>
                  <TableCell>{t('sharedExpression')}</TableCell>
                  <TableCell>{t('sharedType')}</TableCell>
                  <TableCell align="center"/>
                </TableRow>
              </TableHead>
              <TableBody>
                {computedAttributes.map((el) => (
                  <TableRow key={el.id}>
                  <TableCell>{el.description}</TableCell>
                  <TableCell>{el.attribute}</TableCell>
                  <TableCell>{el.expression}</TableCell>
                  <TableCell>{el.type}</TableCell>
                  <TableCell align="center">
                          <Button title={t('sharedEdit')}
                                  // onClick={() => handleOpenComputedAttribute(el)}
                                  >
                          <EditTwoToneIcon/>
                          </Button>
                          <Button title={t('sharedRemove')}
                                  // onClick={() => removeComputedAttribute(el.id)}
                                  >
                          <DeleteTwoTone />
                          </Button>
                        </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabPanel>

         {/*ADMIN SAVED COMMANDS*/}
        <TabPanel value={value} index={3}>
          <div>
            <form>
              <div className={classes.buttonGroup}>
                <ButtonGroup
                  variant="text"
                  color="default"
                  aria-label="text primary button group"
                >
                  <Button onClick={handleOpenCommandModal}>
                    <i className="fas fa-plus" />
                    &nbsp;Agregar
                  </Button>
                  <Button>
                    <i className="fas fa-edit" />
                    &nbsp;Editar
                  </Button>
                  <Button>
                    <i className="fas fa-trash-alt" />
                    &nbsp;Eliminar
                  </Button>
                </ButtonGroup>
              </div>
            </form>
          </div>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>{t("sharedDescription")}</TableCell>
                <TableCell>{t("sharedType")}</TableCell>
                <TableCell>{t("commandSendSms")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               {savedCommands.map((object) => (
                <TableRow key="key">
                  <TableCell>{object.description}</TableCell>
                  <TableCell>{object.type}</TableCell>
                  <TableCell>{t(`${object.textChannel}`)}</TableCell>
                </TableRow>
               ))}
              </TableBody>
            </Table>
          </div>
        </TabPanel>
      </div>

      {/*USER DATA*/}
      <div
        className={classes.UserPageSize}
        style={{ display: `${showAdministration ? "none" : "block"}` }}
      >
        <UserData/>
        {/* <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow></TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.field}>
                  <TableCell component="th" scope="row">
                    {row.field}
                  </TableCell>
                  <TableCell align="left">{row.userData}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
      </div>

      {/*SEND A COMMAND*/}
      <div>
        <SavedCommands open={openModalCommand} handleCloseModal={handleCloseModalCommands}/>
      </div>

      {/*MODAL ADD COMPUTEDATTRIBUTE*/}
      <div>
        <Dialog
          open={openModalComputedAttribute}
          onClose={handleShowComputedAttribute}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="customized-dialog-title"
                      //  onClose={handleCancelEdit}
                       >
            {t('sharedAdd')}
            <IconButton aria-label="close" className={classes.closeButton}
                        onClick={handleShowComputedAttribute}
                        >
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
              fullWidth
              id="outlined-basic"
              label={t('sharedDescription')}
              variant="outlined"
              value={objectComputedAttribute.description}
              onChange={(e) => setObjectComputedAttribute({
                description: e.target.value
              })}
              />
              <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">{t('deviceCommand')}</InputLabel>
                <Select
                  native
                  value={objectComputedAttribute.attribute}
                  onChange={(e) => setObjectComputedAttribute({
                    attribute: e.target.value
                  })}
                  label={t('sharedAttribute')}
                  name="attribute"
                  type="text"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                      <option value='raw'>{t('positionRaw')}</option>
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
              </FormControl>
              <TextField style={{minWidth: 'min-width: -webkit-fill-available !important'}}
                id="outlined-multiline-static"
                label={t('sharedExpression')}
                multiline
                rows={4}
                value={objectComputedAttribute.expression}
                placeholder={t('sharedExpression')}
                variant="outlined"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModalCommand} color="primary">
              Disagree
            </Button>
            <Button  color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Snackbar open={openSnackSuccess} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          {t('updatedInfo')}!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default withWidth()(withStyles(styles)(UserPage));
