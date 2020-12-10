import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import Typography from '@material-ui/core/Typography'
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import NativeSelect from '@material-ui/core/NativeSelect';
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
import userPageStyle from "../containers/styles/UserPageStyle";
import { getDate } from "../utils/functions";
import { DeleteTwoTone, Label } from "@material-ui/icons";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import SavedCommands from '../components/SavedCommands';

const styles = (theme) => ({

});

const useStyles = userPageStyle;




const UserData = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.session.user);
  const [server, setServer] = useState({});
  const storeServer = useSelector((state) => state.session.server);
  const [rows, setRows] = useState([]);
  const [value, setValue] = React.useState(0);
  const [showAdministration, setShowAdministration] = useState(false);
  const [capsMap, setCapsMap] = useState([]);
  const [checked, setChecked] = React.useState(true);
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");
  const [openModalCommand, setOpenModalCommand] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [computedAttributes, setComputedAttributes] = useState([]);
  const [savedCommands, setSavedCommands] = useState([]);
  const [openModalComputedAttribute, setOpenModalComputedAttribute] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user.email);
  const [newName, setNewName] = useState(user.name);
  const [objectComputedAttribute, setObjectComputedAttribute] = useState({
    description: '',
    attribute: 'raw',
    expression: '',
    type: '',
  })



  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value);
  };

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value);
  };

  const showStatics = async (from, to) => {
    const response = await service.getStatistics(from, to);
    setStatistics(response);
  }

  const showComputedAttributes = async () => {
    const response = await service.getComputedAttributes();
    setComputedAttributes(response);
    console.log(computedAttributes);
  }

  const handleShowComputedAttribute = (object) => {
    setOpenModalComputedAttribute(!openModalComputedAttribute);
    if (object) {
      setObjectComputedAttribute({
        description: object.description,
        attribute: object.attribute,
        expression: object.expression,
        type: object.type,
      })
    }
  }

  const handleChangeCheckBox = (event) => {
    setChecked(event.target.checked);
  };

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

  const handleChangePassword = (event) => {
    setNewPassword(event.target.value);
  }

  const handleSaveServer = () => {
    const saveServer = async () => {
      let response = await service.updateServer(server);
    };
    saveServer();
  };

  const handleCloseModalCommands = () => {
    setOpenModalCommand(false);
  }


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

    <div>
      <div>
        <h2 className={classes.subtitles}>{t("commandData")}</h2>
        <form>
          <TableContainer component={Paper}>
            <Table size="medium">
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '45%' }}>{t("sharedName")}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      id="standard-basic"

                      value={newName}
                      onChange={(event) => setNewName(event.target.value)}
                      type="text"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userEmail")}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      id="standard-basic"
                      value={newEmail}
                      onChange={(event) => setNewEmail(event.target.value)}
                      type="text"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userPassword")}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      id="standard-basic"
                      placeholder={t("sharedEdit")}
                      value={newPassword}
                      onChange={handleChangePassword}
                      type="text"
                    />
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </form>

          <h2 className={classes.subtitles}>{t("settingsTitle")}</h2>

        <form>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Telefono</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"

                    value={newPassword}

                    type="text"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capa de Mapa</TableCell>
                  <TableCell>
                    <FormControl className={classes.formControlUser}>
                      <NativeSelect
                        style={{ width: "93%" }}
                        value="custom"
                        fullWidth
                        onChange={handleChangeType}
                      >
                        <option aria-label="None" value="" />
                        {/*{typesValues.map((types, index) => (*/}
                        <option key={1} value="custom">
                          CUSTOM(X,Y,Z)
                        </option>
                      </NativeSelect>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("positionLatitude")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"
                    value={server.latitude}
                    onChange={(e) =>
                      setServer({ ...server, latitude: e.target.value })
                    }
                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("positionLongitude")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"
                    value={server.longitude}
                    onChange={(e) =>
                      setServer({ ...server, longitude: e.target.value })
                    }
                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("serverZoom")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"
                    value={server.zoom}
                    onChange={(e) =>
                      setServer({ ...server, zoom: e.target.value })
                    }
                    type="number"
                  /></TableCell>
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
                  <TableCell>{t("settingsCoordinateFormat")}:</TableCell>
                  <TableCell><FormControl

                    fullWidth
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
                  </FormControl></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("mapPoiLayer")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"

                    type="text"
                  /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </form>

          <h2 className={classes.subtitles}>{t("sharedPermissions")}</h2>

        <form>
          <TableContainer component={Paper}>
            <Table>
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
                <TableRow>
                  <TableCell>{t("userExpirationTime")}:</TableCell>
                  <TableCell>
                    <form className={classes.containerDateTime} noValidate>
                      <TextField


                        fullWidth
                        type="date"
                        defaultValue={new Date()}
                        // className={classes.textFieldDateTime}

                      />
                    </form>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userDeviceLimit")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"

                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userUserLimit")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"

                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userToken")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    id="standard-basic"
                    type="text"
                  /></TableCell>
                </TableRow>
             </TableBody>
              <TableFooter>
                  <TableRow>
                    <TableCell>
                      <Button fullWidth color="primary" variant="outlined">
                        Cancelar
                    </Button>
                    </TableCell>
                    <TableCell>
                      <Button fullWidth color="primary" variant="outlined">
                        Guardar
                    </Button>
                    </TableCell>
                  </TableRow>
                </TableFooter>
            </Table>
          </TableContainer>
        </form>
      </div>
      <div style={{ textAlign: 'center', margin: '5%' }}>


      </div>
    </div>


    //   <div className={classes.buttonGroup}>
    //     <ButtonGroup
    //       variant="text"
    //       color="default"
    //       aria-label="text primary button group"
    //     >
    //       <Button>Atributos</Button>
    //       <Button>
    //         <i className="fas fa-map-marker-alt" />
    //         &nbsp;Obtener estado del mapa
    //       </Button>
    //       <Button onClick={() => handleSaveServer()}>Save</Button>
    //     </ButtonGroup>
    //   </div>
    //   <form>
    //     <Table style={{ display: "table-cell" }}>
    //       <TableBody>

    //         <TableRow>
    //           <TableCell>{t("mapCustomLabel")}:</TableCell>
    //           <TableCell>
    //             <TextField
    //               id="outlined-basic"
    //               label={t("mapCustomLabel")}
    //               value={server.mapUrl}
    //               onChange={(e) =>
    //                 setServer({ ...server, mapUrl: e.target.value })
    //               }
    //               variant="outlined"
    //             />
    //           </TableCell>
    //         </TableRow>
    //
    //

    //         <TableRow>
    //           <TableCell></TableCell>

    //         </TableRow>
    //         <TableRow>
    //           <TableCell>{t("serverForceSettings")}:</TableCell>
    //           <TableCell>
    //             <Checkbox
    //               checked={server.forceSettings}
    //               onChange={() =>
    //                 setServer({
    //                   ...server,
    //                   forceSettings: !server.forceSettings,
    //                 })
    //               }
    //               color="primary"
    //               inputProps={{ "aria-label": "secondary checkbox" }}
    //             />
    //           </TableCell>
    //         </TableRow>
    //         <TableRow>
    //           <TableCell>Formato de coordenadas:</TableCell>

    //         </TableRow>
    //         <TableRow>
    //           <TableCell>{t("mapPoiLayer")}:</TableCell>
    //           <TableCell>
    //             <TextField
    //               id="outlined-basic"
    //               label={t("mapPoiLayer")}
    //               variant="outlined"
    //             />
    //           </TableCell>
    //         </TableRow>
    //       </TableBody>
    //     </Table>
    //   </form>

    // </div>
  );

}

export default UserData;
