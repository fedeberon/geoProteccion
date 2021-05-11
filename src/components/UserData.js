import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Container from '@material-ui/core/Container';
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import NativeSelect from '@material-ui/core/NativeSelect';
import { useDispatch, useSelector } from "react-redux";
import t from "../common/localization";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import * as service from "../utils/serviceManager";
import userPageStyle from "../containers/styles/UserPageStyle";
import { getDate } from "../utils/functions";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {sessionActions} from "../store";

const useStyles = userPageStyle;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const UserData = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const [server, setServer] = useState({});
  const storeServer = useSelector((state) => state.session.server);
  const [showAdministration, setShowAdministration] = useState(false);
  const [openSnackSuccess, setOpenSnackSuccess] = useState(false);
  const [computedAttributes, setComputedAttributes] = useState([]);
  const [openModalComputedAttribute, setOpenModalComputedAttribute] = useState(false);
  const [session, setSession] = useState({
    name: user.name,
    email: user.email,
    password: user.password === null ? '' : user.password,
    phone: user.phone,
    map: user.map,
    latitude: user.latitude,
    longitude: user.longitude,
    zoom: user.zoom,
    twelveHourFormat: user.twelveHourFormat,
    coordinateFormat: user.coordinateFormat,
    poiLayer: user.porLayer,
    disabled: user.disabled,
    administrator: user.administrator,
    readonly: user.readonly,
    deviceReadonly: user.deviceReadonly,
    limitCommands: user.limitCommands,
    expirationTime: user.expirationTime === null ? '' : user.expirationTime,
    deviceLimit: user.deviceLimit,
    userLimit: user.userLimit,
    attributes: user.attributes,
    id: user.id,
    login: user.login,
    poiLayer: user.poiLayer,
    token: user.token,
  });



  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackSuccess(false);
  };

  const handleSaveData = () => {
    
    const updateUser = async () => {
      const response = await service.updateUser(user.id, session);
      
      dispatch(sessionActions.setUser(response));
      setSession(response);
    }
      updateUser()
      .then(response => response)
      .then(response => setOpenSnackSuccess(true));      
  };

  useEffect(() => {
    setServer({
      ...storeServer,
      mapUrl: storeServer && storeServer.mapUrl.replace(/&amp;/g, "&"),
    });
  }, [storeServer]);

  // const getSavedCommands = async () => {
  //   const response = await service.getCommands();
  //   setSavedCommands(response);
  // };

  return (

    <div>
      <div>
        <p className={classes.subtitles}>{t("commandData")}</p>
        <Container style={{ display: 'none' }}> {/*display: 'contents'*/}
          <ButtonGroup style={{marginBottom: '12px'}} fullWidth size="small" aria-label="small outlined button group">
            <Button>{t('sharedAttributes')}</Button>
            <Button tittle={`${t('sharedGetMapState')}`}>
               <i className="fas fa-map-marker-alt"></i>
            </Button>
            <Button tittle={`${t('sharedTestNotification')}`}>
               <i className="far fa-envelope"></i>
            </Button>
          </ButtonGroup>
        </Container>
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableBody>
              <TableRow>
                <TableCell style={{ width: '45%' }}>{t("sharedName")}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={session.name}
                    onChange={(event) => setSession({
                      ...session,
                      name: (event.target.value)
                    })}
                    type="text"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("userEmail")}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={session.email}
                    onChange={(event) => setSession({
                      ...session,
                      email: (event.target.value)
                    })}
                    type="text"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("userPassword")}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    placeholder={t(`${session.password}`)}
                    value={session.password}
                    onChange={(event) => setSession({
                      ...session,
                      password: (event.target.value)
                    })}
                    type="text"
                  />                
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <p className={classes.subtitles}>{t("settingsTitle")}</p>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{t('sharedPhone')}</TableCell>
                <TableCell><TextField
                  fullWidth
                  value={session.phone}
                  onChange={(e) => setSession({
                    ...session,
                    phone: e.target.value
                  })}
                  type="text"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('mapLayer')}:</TableCell>
                <TableCell>
                  <FormControl fullWidth={true} className={classes.formControlUser}>
                    <NativeSelect
                      value={session.map}
                      fullWidth
                      onChange={(e) => setSession({
                        ...session,
                        map: e.target.value
                      })}
                    >
                      {/*{typesValues.map((types, index) => (*/}
                      <option key={1} value="custom">{t('mapCustom')}</option>
                    </NativeSelect>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("positionLatitude")}:</TableCell>
                <TableCell><TextField
                  fullWidth
                  value={session.latitude}
                  onChange={(e) =>
                    setSession({
                      ...session,
                      latitude: Number(e.target.value)
                    })
                  }
                  type="number"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("positionLongitude")}:</TableCell>
                <TableCell><TextField
                  fullWidth

                  value={session.longitude}
                  onChange={(e) =>
                    setSession({
                      ...session,
                      longitude: Number(e.target.value)
                    })
                  }
                  type="number"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("serverZoom")}:</TableCell>
                <TableCell><TextField
                  fullWidth
                  value={session.zoom}
                  onChange={(e) =>
                    setSession({
                      ...session,
                      zoom: Number(e.target.value)
                    })
                  }
                  type="number"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("settingsTwelveHourFormat")}:</TableCell>
                <TableCell>
                  <Checkbox
                    checked={session.twelveHourFormat}
                    onChange={() =>
                      setSession({
                        ...session,
                        twelveHourFormat: !session.twelveHourFormat,
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
                    value={session.coordinateFormat}
                    onChange={(e) =>
                      setSession({
                        ...session,
                        coordinateFormat: e.target.value,
                      })
                    }
                  >
                    <option value="" />
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
                  value={session.poiLayer}
                  onChange={(event) => setSession({
                    ...session,
                    poiLayer: (event.target.value)
                  })}
                  type="text"
                /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <p className={classes.subtitles}>{t("sharedPermissions")}</p>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{t('sharedDisabled')}:</TableCell>
                <TableCell>
                  <Checkbox
                    disabled={!user.administrator}
                    checked={session.disabled}
                    onChange={() => setSession({
                      ...session,
                      disabled: !session.disabled
                    })}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('userAdmin')}:</TableCell>
                <TableCell>
                  <Checkbox
                    disabled={!user.administrator}
                    checked={session.administrator}
                    onChange={() => setSession({
                      ...session,
                      administrator: !session.administrator
                    })}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('serverReadonly')}:</TableCell>
                <TableCell>
                  <Checkbox
                    disabled={!user.administrator}
                    checked={session.readOnly}
                    onChange={() => setSession({
                      ...session,
                      readOnly: !session.readOnly
                    })}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('userDeviceReadonly')}:</TableCell>
                <TableCell>
                  <Checkbox
                    disabled={!user.administrator}
                    checked={session.deviceReadOnly}
                    onChange={() => setSession({
                      ...session,
                      deviceReadOnly: !session.devicesReadOnly
                    })}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('userLimitCommands')}:</TableCell>
                <TableCell>
                  <Checkbox
                    disabled={!user.administrator}
                    checked={session.limitCommands}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    onChange={() => setSession({
                      ...session,
                      limitCommands: !session.limitCommands
                    })}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("userExpirationTime")}:</TableCell>
                <TableCell>
                  <form className={classes.containerDateTime} noValidate>
                    <TextField
                      disabled={!user.administrator}
                      value={session.expirationTime}
                      fullWidth
                      type="date"
                      onChange={(event) => setSession({
                        ...session,
                        expirationTime: (event.target.value)
                      })}
                    />
                  </form>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("userDeviceLimit")}:</TableCell>
                <TableCell><TextField
                  disabled={!user.administrator}
                  fullWidth
                  value={session.deviceLimit}
                  type="number"
                  onChange={(event) => setSession({
                    ...session,
                    deviceLimit: (event.target.value)
                  })}
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("userUserLimit")}:</TableCell>
                <TableCell><TextField
                  disabled={!user.administrator}
                  fullWidth
                  value={session.userLimit}
                  onChange={(event) => setSession({
                    ...session,
                    userLimit: (event.target.value)
                  })}
                  type="number"
                /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("userToken")}:</TableCell>
                <TableCell><TextField
                  fullWidth
                  value={user.token}
                  type="text"
                /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>
        <Button style={{margin: '20px 0px'}} onClick={handleSaveData} fullWidth color="primary" variant="outlined">
          {t('sharedSave')}
        </Button>
      </div>
      <Snackbar open={openSnackSuccess} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          {t('updatedInfo')}!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserData;
