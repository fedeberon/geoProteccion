import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import * as service from "../utils/serviceManager";
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import deviceDetailStyles from "./styles/DeviceDetailStyles";
import CloseIcon from "@material-ui/icons/Close";
import { devicesActions } from "../store";
import Icon from '@material-ui/core/Icon';

const useStyles = deviceDetailStyles;

const DeviceDetail = (props) => {
  let { id } = useParams();
  const devices = useSelector((state) => Object.values(state.devices.items),
    shallowEqual
  );
  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop
  );
  const userId = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const classes = useStyles();
  const [deviceFound, setDeviceFound] = useState({});
  const [availableTypesByDeviceId, setAvailableTypesByDeviceId] = useState([]);
  const [availableFunction, setAvailableFunction] = useState(false);
  const [circuitBreaker, setCircuitBreaker] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlarm, setOpenAlarm] = useState(false);
  const [alarmActivated, setAlarmActivated] = useState(false);
  let deviceUpdated = deviceFound;

  useEffect(() => {
    const result = devices.find((el) => el.id === parseInt(id));
    setDeviceFound(result);
  }, [devices]);

  useEffect(()=> {
    if (deviceFound.attributes?.circuitBreaker && deviceFound.attributes?.circuitBreaker === 'on'){
      setCircuitBreaker(true);
    } else if (deviceFound.attributes?.circuitBreaker && deviceFound.attributes?.circuitBreaker === 'off'){
      setCircuitBreaker(false);
    } else {
      setCircuitBreaker(false);
    }
    
    if (deviceFound.attributes?.alarm && deviceFound.attributes?.alarm === 'on'){
      setAlarmActivated(true);
    } else if (deviceFound.attributes?.alarm && deviceFound.attributes?.alarm === 'off'){
      setAlarmActivated(false);
    } else {
      setAlarmActivated(false);
    }

  },[deviceFound])

  useEffect(() => {
    if(deviceFound.id !== undefined){
      const getCommandTypes = async () => {
        const response = await service.getCommandTypes(deviceFound.id);
        setAvailableTypesByDeviceId(response);
        if (response.length > 1) {
          setAvailableFunction(true);
        } else {
          setAvailableFunction(false);
        }
      };
      getCommandTypes();
    }
  }, [deviceFound])

  const handleConfirmcircuitBreaker = () => {
    handleClickOpen();
  }

  const handleConfirmAlarm = () => {
    handleClickOpenAlarm();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenAlarm = () => {
    setOpenAlarm(true);
  }

  const handleClose = () => {
    setOpen(false);
    setOpenAlarm(false);
  };

  const updateDeviceAttributes = async (object) => {
    let request = await fetch(`/api/devices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(object),
    }).then(response => response.json())
      .then(response => {        
          const getDevicesByUser = async (userId) => {
            let response = await service.getDeviceByUserId(userId);
            dispatch(devicesActions.update(response));
          }
          getDevicesByUser(userId);        
      })
  }
        
  const handlesetCircuitBreaker = async () => {
    
    if(!circuitBreaker){

      const response = await fetch(`api/commands/send`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                'Accept': 'application/json',},
        body: JSON.stringify({
          attributes: {},
          description: `${t('sharedNew')}`,
          id: 0,
          textChannel: false,
          deviceId: Number(id),
          type: 'engineStop',
        })
      }).then(response => response.json())
        .then(response => {
          deviceUpdated = {
            ...deviceFound,
            attributes: {
              ...deviceFound.attributes,
              circuitBreaker: 'on'
            }
          }
          setCircuitBreaker(true);   
          updateDeviceAttributes(deviceUpdated);          
        })        
    } else {

      const response = await fetch(`api/commands/send`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                'Accept': 'application/json',},
        body: JSON.stringify({
          attributes: {},
          description: `${t('sharedNew')}`,
          id: 0,
          textChannel: false,
          deviceId: Number(id),
          type: 'engineResume',
        })
      }).then(response => response.json())
        .then(response => {
          deviceUpdated = {
            ...deviceFound,
            attributes: {
              ...deviceFound.attributes,
              circuitBreaker: 'off'
            }
          }
          setCircuitBreaker(true);   
          updateDeviceAttributes(deviceUpdated);          
        }) 
    }
    handleClose(); 
  }

  const handleSetAlarm = async () => {
    
    if(!alarmActivated){

      const response = await fetch(`api/commands/send`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                'Accept': 'application/json',},
        body: JSON.stringify({
          attributes: {},
          description: `${t('sharedNew')}`,
          id: 0,
          textChannel: false,
          deviceId: Number(id),
          type: 'alarmArm',
        })}).then(response => response.json())
            .then(response => {
              deviceUpdated = {
                ...deviceFound,
                attributes: {
                  ...deviceFound.attributes,
                  alarm: 'on'
                }
              }
              setAlarmActivated(true);   
              updateDeviceAttributes(deviceUpdated);          
            })
      } else {

        const response = await fetch(`api/commands/send`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json',
                  'Accept': 'application/json',},
          body: JSON.stringify({
            attributes: {},
            description: `${t('sharedNew')}`,
            id: 0,
            textChannel: false,
            deviceId: Number(id),
            type: 'alarmDisarm',
          })}).then(response => response.json())
              .then(response => {
                deviceUpdated = {
                  ...deviceFound,
                  attributes: {
                    ...deviceFound.attributes,
                    alarm: 'off'
                  }
                }
                setAlarmActivated(false);   
                updateDeviceAttributes(deviceUpdated);          
              })
      }
      handleClose(); 
  }

  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <div className={classes.rootContainer}>
          <div className={classes.containerdev} >
            <div className="title-section">
              <h2>{t("sharedDevice")}</h2>              
              <Divider />
            </div>
            <div>
            <p style={{ fontSize: "16px", color: "#6f6060", textAlign: 'center', marginTop: 12 }}>
                {/* {t('reportDeviceName')}: */}
                <strong>{deviceFound.name} </strong>
              {/* <span style={{ color: "Black" }} className={`${classes.pos} deviceDetailStatus`}>
                  &nbsp;
                </span> */}
              </p>
              <img
                className={classes.dashImg}
                alt=""
                src={require("../../public/images/teslacontrol.png").default}
              />
            </div>
            <div style={{ display: 'block', textAlign: 'center' }}>
              <p style={{ fontSize: "15px", color: "darkgray", margin: 0 }}>
                {t("deviceStatus")}:{" "}
                <span className={`status-${deviceFound.status} deviceDetailStatus`}>
                  {deviceFound.status} <i className="fas fa-globe-europe"></i>
                </span>
              </p>
              
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>{t('sharedInfoTitle')}</h3>
              <Button style={{ display: 'none' }}>View All</Button>
            </div>
            <div className={classes.divCards}>
              <Button component="div" onClick={() => handleConfirmAlarm()}
              className={classes.buttonsCards} disabled={!availableFunction}>
                <Card style={{backgroundColor: `${alarmActivated ? '#59D2FE' : 'black'}`}}
                  className={classes.root}
                  variant="outlined"
                >
                  <CardContent
                    className="card-device-detail">
                    <IconButton style={{ backgroundColor: "cornflowerblue", width: '42px', height: '42px' }}>
                      <i
                        style={{ color: "whitesmoke", fontSize: '30px' }}
                        className={alarmActivated ? `fas fa-lock` : `fas fa-unlock`}
                      />
                    </IconButton>
                    <p className={classes.messageCard}
                      style={{ display: `${availableFunction ? 'none' : 'inline'}` }}>
                      {t('sharedDisabled')}
                    </p>
                    <Typography className={classes.buttonTypogra}
                      variant="h6"
                      style={{color: `${alarmActivated ? 'black' : 'white'}`}}
                      component="h4"
                    >
                      {t('commandAlarmArm')}/{t("commandAlarmDisarm")}
                    </Typography>
                    {/* <Typography
                      className={classes.pos}
                      color="textSecondary"
                    >
                      Enviar SMS:
                  </Typography> */}
                  <Typography style={{
                    textAlign: 'center', 
                    marginTop: '25px',
                    color: `${circuitBreaker ? 'black' : 'white'}`
                    }} 
                    className={classes.pos} color="textSecondary">
                      {`${alarmActivated ? `${t("commandEnable")}` : `${t("sharedDisabled")}`}`}
                    </Typography>

                  </CardContent>
                </Card>
              </Button>

              {/* Botton para activar o desactivar cortacorriente */}
              <Button component="div" onClick={() => handleConfirmcircuitBreaker()}
                className={classes.buttonsCards} disabled={!availableFunction}>
                <Card style={{backgroundColor: `${circuitBreaker ? '#59D2FE' : 'black'}`}}
                className={classes.root} variant="outlined">
                  <CardContent className="card-device-detail">
                    <IconButton style={{ backgroundColor: "cornflowerblue", width: '42px', height: '42px' }}>
                      <i
                        style={{ color: "whitesmoke", fontSize: '30px' }}
                        className="fas fa-car-battery"
                      />
                    </IconButton>
                    <p className={classes.messageCard}
                      style={{ display: `${availableFunction ? 'none' : 'inline'}` }}>
                      {t('sharedDisabled')}
                    </p>

                    <Typography className={classes.buttonTypogra}
                      variant="h6"
                      style={{color: `${circuitBreaker ? 'black' : 'white'}`}}
                      component="h4"
                    >
                      {t("circuitBreaker")}
                    </Typography>
                    <Typography style={{
                      textAlign: 'center', 
                      marginTop: '45px',
                      color: `${circuitBreaker ? 'black' : 'white'}`
                    }} 
                    className={classes.pos} color="textSecondary">
                      {`${circuitBreaker ? `${t("commandEnable")}` : `${t("sharedDisabled")}`}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </div>
          </div>

           {/*Dialog Confirm circuitBreaker */}
          <div>           
            <Dialog
              open={open}
              maxWidth="sm"
              fullWidth={!isViewportDesktop}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle 
              style={{marginRight: '50px'}}
              id="alert-dialog-title">{`${t('circuitBreaker')}`}
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {!circuitBreaker ? `¿${t('activateCircuitBreaker')}?` : `¿${t('desactivateCircuitBreaker')}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions className={classes.actionsButtons}>
                <Button 
                variant='outlined'
                className={classes.buttonsRemoteControl} onClick={handleClose} color="primary">
                  {t('sharedCancel')}
                </Button>
                <Button 
                variant='outlined'
                className={classes.buttonsRemoteControl} onClick={() => handlesetCircuitBreaker()} color="primary" autoFocus>
                  {t('sharedAccept')}
                </Button>
              </DialogActions>
            </Dialog>
          </div>

           {/*Dialog Confirm Alarm */}
           <div>           
            <Dialog
              open={openAlarm}
              maxWidth="sm"
              fullWidth={!isViewportDesktop}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle 
              style={{marginRight: '50px'}}
              id="alert-dialog-title">{t('eventAlarm')}
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent >
                <DialogContentText id="alert-dialog-description">
                  {alarmActivated ? `¿${t('commandAlarmDisarm')}?` : `¿${t('commandAlarmArm')}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions className={classes.actionsButtons}>
                <Button 
                variant='outlined'
                className={classes.buttonsRemoteControl} onClick={handleClose} color="primary">
                  {t('sharedCancel')}
                </Button>
                <Button 
                variant='outlined'
                className={classes.buttonsRemoteControl} onClick={() => handleSetAlarm()} color="primary" autoFocus>
                  {t('sharedAccept')}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </React.Fragment>
    </>
  );
};
export default DeviceDetail;
