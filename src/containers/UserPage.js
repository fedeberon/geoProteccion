import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from "@material-ui/core/withWidth";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import t from "../common/localization";
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
import Radio from "@material-ui/core/Radio";
import DialogActions from "@material-ui/core/DialogActions";
import * as service from "../utils/serviceManager";
import userPageStyle from "./styles/UserPageStyle";

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

const UserPage = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.session.user);
  const storeServer = useSelector((state) => state.session.server);
  const [ rows, setRows ] = useState([]);
  const [ value, setValue ] = React.useState(0);
  const [ showAdministration, setShowAdministration ] = useState(false);
  const [ capsMap, setCapsMap ] = useState([]);
  const [ checked, setChecked ] = React.useState(true);
  const [ fromDateTime, setFromDateTime ] = useState("");
  const [ toDateTime, setToDateTime ] = useState("");
  const [ radioValueCommand, setRadioValueCommand ] = useState(false);
  const [ openModalCommand, setOpenModalCommand ] = useState(false);
  const [ server, setServer ] = useState({});

  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value);
  };

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value);
  };

  const handleChangeCheckBox = (event) => {
    setChecked(event.target.checked);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseModalCommand = () => {
    setOpenModalCommand(false);
    // setAvailableTypesByDeviceId([]);
  };

  const showMenuAdmin = () => {
    setShowAdministration(!showAdministration);
  };

  const handleOpenCommandModal = () => {
    setOpenModalCommand(!openModalCommand);
  };

  const handleChangeType = (event) => {
    setCapsMap(event.target.value);
  };

  const handleChangeRadioCommand = () => {
    setRadioValueCommand(!radioValueCommand);
  };

  const handleSaveServer = () => {
    const saveServer = async () => {
      let response = await service.updateServer(server);
    };
    saveServer();
  };

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

  return (
    <div className={classes.root}>
      <div
        className="title-section"
        style={{ justifyContent: "space-between", display: "flex" }}
      >
        <h2>Información de Usuario</h2>
        <Typography>
          {user.administrator && (
            <Button
              onClick={() => showMenuAdmin()}
              button
              style={{ textTransform: "capitalize" }}
            >
              Administrador
            </Button>
          )}
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
          <Tab label="Servidor" {...a11yProps(0)} />
          <Tab label="Estadísticas" {...a11yProps(1)} />
          <Tab label="Atributos Calculados" {...a11yProps(2)} />
          <Tab label="Comandos Guardados" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0} style={{ paddingBottom: "10%" }}>
          <div className={classes.subtitles}>
            <h2>Preferencias</h2>
          </div>
          <div className={classes.buttonGroup}>
            <ButtonGroup
              variant="text"
              color="default"
              aria-label="text primary button group"
            >
              <Button>Atributos</Button>
              <Button>
                <i className="fas fa-map-marker-alt" />
                &nbsp;Obtener estado del mapa
              </Button>
              <Button onClick={() => handleSaveServer()}>Save</Button>
            </ButtonGroup>
          </div>
          <form>
            <Table style={{ display: "table-cell" }}>
              <TableBody>
                <TableRow>
                  <TableCell>Capa de Mapa:</TableCell>
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
                          CUSTOM(X,Y,Z)
                        </option>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("mapCustomLabel")}:</TableCell>
                  <TableCell>
                    <TextField
                      id="outlined-basic"
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
                      id="outlined-number"
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
                      id="outlined-number"
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
                  <TableCell>Formato de coordenadas:</TableCell>
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
                      id="outlined-basic"
                      label={t("mapPoiLayer")}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
          <div className={classes.subtitles}>
            <h2>Permisos</h2>
          </div>
          <div>
            <form>
              <TableBody>
                <TableRow>
                  <TableCell>Registro</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sólo lectura:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dispositivo de sólo lectura:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Limitar Comandos:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </form>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            <form>
              <TableBody>
                <TableRow>
                  <TableCell>{t("reportFrom")}:</TableCell>
                  <TableCell>
                    <form className={classes.containerDateTime} noValidate>
                      <TextField
                        label=" "
                        value={fromDateTime}
                        onChange={onChangeFromDateTime}
                        type="datetime-local"
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
                        label=" "
                        value={toDateTime}
                        onChange={onChangeToDateTime}
                        type="datetime-local"
                        defaultValue="2020-11-09T00:30"
                        className={classes.textFieldDateTime}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </form>
                  </TableCell>
                  <TableCell>
                    <Button button variant="outlined" color="default">
                      Mostrar
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
                  <TableCell>Tiempo de Captura</TableCell>
                  <TableCell>Usuarios Activos</TableCell>
                  <TableCell>Dispositivos Activos</TableCell>
                  <TableCell>Peticiones</TableCell>
                  <TableCell>Mensajes Recibidos</TableCell>
                  <TableCell>Mensajes Almacenados</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>SMS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*FUNCION DE MAPEO*/}
                <TableRow key="key">
                  <TableCell>1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>7</TableCell>
                  <TableCell>8</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div>
            <form>
              <div className={classes.buttonGroup}>
                <ButtonGroup
                  variant="text"
                  color="default"
                  aria-label="text primary button group"
                >
                  <Button>
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
                  <TableCell>Descripcion</TableCell>
                  <TableCell>Atributo</TableCell>
                  <TableCell>Expresion</TableCell>
                  <TableCell>Tipo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*FUNCION DE MAPEO*/}
                <TableRow key="key">
                  <TableCell>1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>4</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabPanel>
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
                  <TableCell>Descripcion</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Enviar SMS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*FUNCION DE MAPEO*/}
                <TableRow key="key">
                  <TableCell>1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabPanel>
      </div>
      <div
        className={classes.UserPageSize}
        style={{ display: `${showAdministration ? "none" : "block"}` }}
      >
        <TableContainer component={Paper}>
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
        </TableContainer>
      </div>

      {/*SEND A COMMAND*/}
      <div>
        <Dialog
          open={openModalCommand}
          onClose={handleCloseModalCommand}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Comando Guardado"}
          </DialogTitle>
          <DialogContent>
            <form>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Descripcion"
                variant="outlined"
              />
              <FormControl
                variant="outlined"
                fullWidth={true}
                className={classes.formControl}
              >
                <InputLabel htmlFor="outlined-age-native-simple">
                  {t("deviceCommand")}
                </InputLabel>
                <Select
                  native
                  fullWidth
                  // value={key}
                  // onChange={handleChange}
                  label={t("deviceCommand")}
                  name="name"
                  type="text"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option>
                </Select>
              </FormControl>
              <Typography>
                Enviar SMS:
                <Radio
                  checked={radioValueCommand === true}
                  onClick={handleChangeRadioCommand}
                  color="primary"
                  value={true}
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "A" }}
                />{" "}
                Si
                <Radio
                  checked={radioValueCommand === false}
                  onChange={handleChangeRadioCommand}
                  color="primary"
                  value={false}
                  name="radio-button-demo"
                  inputProps={{ "aria-label": "B" }}
                />{" "}
                No
              </Typography>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModalCommand} color="primary">
              Disagree
            </Button>
            <Button color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default withWidth()(withStyles(styles)(UserPage));
