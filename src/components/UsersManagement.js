import React, {useEffect, useState}from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Container from '@material-ui/core/Container';
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import NativeSelect from '@material-ui/core/NativeSelect';
import { useDispatch, useSelector } from "react-redux";
import t from "../common/localization";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import * as service from "../utils/serviceManager";
import userPageStyle from "../containers/styles/UserPageStyle";
import { getDate } from "../utils/functions";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {userActions} from "../store";
import AttributesDialog from './AttributesDialog';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = userPageStyle;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UsersManagement = ({open, close, userData}) => {

  const classes = useStyles();
  const [editUser, setEditUser] = useState(false);
  const server = useSelector((state) => state.session.server);
  const [openSnackSuccess, setOpenSnackSuccess] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogAttributes, setDialogAttributes] = useState(false);
  const [dateToFormat, setDateToFormat] = useState();
  
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: null,
    phone: '',
    map: 'custom',
    latitude: 0,
    longitude: 0,
    zoom: 16,
    twelveHourFormat: false,
    coordinateFormat: '',
    poiLayer: '',
    disabled: false,
    administrator: false,
    readonly: false,
    deviceReadonly: false,
    limitCommands: false,
    expirationTime: null,
    deviceLimit: -1,
    userLimit: 0,
    token: null,
    login: '',
  });

  const handleOpenSnackBar = () => {
    setOpenSnackSuccess(true);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackSuccess(false);
  };

  useEffect(()=> {
    if(userData){
      setEditUser(true);
      //setDateToFormat(`${userData.expirationTime.substr(0,4)}/${userData.expirationTime.substr(5,2)}/${userData.expirationTime.substr(7,2)}`)
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        attributes: userData.attributes,
        phone: userData.phone,
        map: userData.map,
        latitude: userData.latitude,
        longitude: userData.longitude,
        zoom: userData.zoom,
        twelveHourFormat: userData.twelveHourFormat,
        coordinateFormat: userData.coordinateFormat,
        poiLayer: userData.porLayer,
        disabled: userData.disabled,
        administrator: userData.administrator,
        readonly: userData.readonly,
        deviceReadonly: userData.deviceReadonly,
        limitCommands: userData.limitCommands,
        expirationTime: userData.expirationTime === null ? '' : userData.expirationTime,
        deviceLimit: userData.deviceLimit,
        userLimit: userData.userLimit,
        token: userData.token,
        login: userData.login 
      })
    };    
  },[userData]);  

  const handleClose = () => {
    setOpenDialog(false);
    setUser({
    id: null,
    name: '',
    email: '',
    password: null,
    phone: '',
    map: 'custom',
    latitude: 0,
    longitude: 0,
    zoom: 16,
    twelveHourFormat: false,
    coordinateFormat: '',
    poiLayer: '',
    disabled: false,
    administrator: false,
    readonly: false,
    deviceReadonly: false,
    limitCommands: false,
    expirationTime: null,
    deviceLimit: -1,
    userLimit: 0,
    token: null,
    login: ''});
    setEditUser(false);
    close();
  };

  useEffect(()=> {
    setOpenDialog(open);
  },[open]);

  const setMapState = () => {
    if(server){
      setUser({
        ...user,
        latitude: server.latitude,
        longitude: server.longitude,
      })
    }
  };

  const makeToken = () => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < 32; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setUser({...user, token: `${result}`});
  };

  const handleOpenDialogAttributes = () => {
    setDialogAttributes(true);
  };

  const handleCloseDialogAttributes = () => {
    setDialogAttributes(false);
  };

   const savingAttributes = (objeto) => {    
      setUser({...user, attributes: objeto})
  };

  const handleSaveUser = async () => {
    let response = await fetch(!editUser ? `api/users` : `api/users/${user.id}`, {
      method: !editUser ? 'POST' : 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    }).then(response => response.json())
    .then(response => response);
    handleOpenSnackBar();
    handleClose();
  }

  return (
    <div>
      <Dialog 
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        open={openDialog} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title" 
        style={{backgroundColor: 'whitesmoke'}}>
        <DialogTitle id="add-new-user">{t('settingsUser')}</DialogTitle>
        <DialogContent>        
          <p className={classes.subtitlesAdd}>{t("commandData")}</p>
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
          <TableContainer className={classes.tableContainerAdd} component={Paper}>
            <Table size="medium">
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '45%' }}>{t("sharedName")}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={user.name || ''}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      type="text"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userEmail")}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={user.email || ''}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      type="text"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userPassword")}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      placeholder={t(`${user.password}`)}
                      value={user.password || ''}
                      onChange={(e) => setUser({...user, password: e.target.value})}
                      type="text"
                    />                
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <p className={classes.subtitlesAdd}>{t("settingsTitle")}</p>
          <TableContainer className={classes.tableContainerAdd} component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>{t('sharedPhone')}</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.phone || ''}
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                    type="text"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('mapLayer')}:</TableCell>
                  <TableCell>
                    <FormControl fullWidth={true} className={classes.formControlUser}>
                      <NativeSelect
                        value={user.map || 'custom'}
                        fullWidth
                        onChange={(e) => setUser({...user, map: e.target.value})}
                        >                        
                        <option key={1} value="carto">{t("mapCarto")}</option>
                        <option key={2} value="osm">{t("mapOsm")}</option>
                        <option key={3} value="bingRoad">{t("mapBingRoad")}</option>
                        <option key={4} value="bingAerial">{t("mapBingAerial")}</option>
                        <option key={5} value="bingHybrid">{t("mapBingHybrid")}</option>
                        <option key={6} value="baidu">{t("mapBaidu")}</option>
                        <option key={7} value="yandexMap">{t("mapYandexMap")}</option>
                        <option key={8} value="yandexSat">{t("mapYandexSat")}</option>
                        <option key={9} value="wikimedia">{t("mapWikimedia")}</option>
                        <option key={10} value="custom">{t("mapCustom")}</option>
                        <option key={11} value="customArcgis">{t("mapCustomArcgis")}</option>
                      </NativeSelect>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("positionLatitude")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.latitude || ''}
                    onChange={(e) => setUser({...user, latitude: e.target.value})}
                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("positionLongitude")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.longitude || ''}
                    onChange={(e) => setUser({...user, longitude: e.target.value})}
                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("serverZoom")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.zoom}
                    onChange={(e) => setUser({...user, zoom: Number(e.target.value)})}
                    type="number"
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("settingsTwelveHourFormat")}:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.twelveHourFormat || false}
                      onChange={() => setUser({...user, twelveHourFormat: !user.twelveHourFormat})}
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
                      value={user.coordinateFormat || ''}
                      onChange={(e) => setUser({...user, coordinateFormat: e.target.value})}
                    >
                      <option value="" />
                      <option key={"dd"} value="dd">{t("sharedDecimalDegrees")}</option>
                      <option key={"ddm"} value="ddm">{t("sharedDegreesDecimalMinutes")}</option>
                      <option key={"dms"} value="dms">{t("sharedDegreesMinutesSeconds")}</option>
                    </Select>
                  </FormControl></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("mapPoiLayer")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.poiLayer || ''}
                    onChange={(e) => setUser({...user, poiLayer: e.target.value})}
                    type="text"
                  /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <p className={classes.subtitlesAdd}>{t("sharedPermissions")}</p>
          <TableContainer className={classes.tableContainerAdd} component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>{t('sharedDisabled')}:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.disabled || false}
                      onChange={() => setUser({...user, disabled: !user.disabled})}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('userAdmin')}:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.administrator || false}
                      onChange={() => setUser({...user, administrator: !user.administrator})}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('serverReadonly')}:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.readOnly || false}
                      onChange={() => setUser({...user, readOnly: !user.readOnly})}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('userDeviceReadonly')}:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.deviceReadOnly || false}
                      onChange={() => setUser({...user, deviceReadOnly: !user.devicesReadOnly})}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('userLimitCommands')}:</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.limitCommands || false}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      onChange={() => setUser({...user, limitCommands: !user.limitCommands})}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userExpirationTime")}:</TableCell>
                  <TableCell>
                    <form className={classes.containerDateTime} noValidate>
                      <TextField
                        value={dateToFormat || ''}
                        fullWidth
                        type="date"
                        onChange={function(e){
                          setDateToFormat(`${e.target.value}`);
                          setUser({...user,
                             expirationTime: new Date(e.target.value).toISOString()})
                        }}
                      />
                    </form>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userDeviceLimit")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.deviceLimit}
                    type="number"
                    onChange={(e) => setUser({...user, deviceLimit: e.target.value})}
                  /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("userUserLimit")}:</TableCell>
                  <TableCell><TextField
                    fullWidth
                    value={user.userLimit}
                    onChange={(e) => setUser({...user, userLimit: e.target.value})}
                    type="number"
                  /></TableCell>
                </TableRow>                
                <TableRow>
                  <TableCell>{t("userToken")}:</TableCell>
                  <TableCell>
                  <Input
                    id="standard-adornment-token"
                    type={'text'}
                    value={user.token || ''}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={makeToken}                          
                        >
                          <CachedOutlinedIcon />
                        </IconButton>
                      </InputAdornment>
                    }/>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer> 

        </DialogContent>
        <DialogActions id="dialogActions-userMan" style={{margin: '0 30px'}}>
          <Button style={{position: 'absolute', left: '5%'}}
          onClick={handleOpenDialogAttributes} variant="outlined">
            {t("sharedAttributes")}
          </Button>
          <Button id="buttonGetMapState" onClick={setMapState} variant="outlined">
            <i title={t('sharedGetMapState')} className="fas fa-satellite"></i>
          </Button>
          <Button onClick={handleClose} variant="outlined">
            {t('sharedCancel')}
          </Button>
          <Button onClick={handleSaveUser} variant="outlined">
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>

      {/*Modal Attributes*/}
      <div>
          <AttributesDialog             
            data={userData ? userData.attributes : user.attributes} //If exist, send attributes.
            savingAttributes={savingAttributes} 
            open={dialogAttributes} 
            close={handleCloseDialogAttributes}
          />
      </div>
      <div className={classes.snackbar}>
        <Snackbar open={openSnackSuccess} autoHideDuration={5000} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity="success">
            {`¡${t('updatedInfo')}!`}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default UsersManagement;