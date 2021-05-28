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

const useStyles = deviceDetailStyles;

const DeviceDetail = (props) => {
  let { id } = useParams();
  const devices = useSelector((state) => Object.values(state.devices.items),
    shallowEqual
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
    if(deviceFound.id !== null){
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

  const updateDeviceAttributes = (object) => {
    let request = fetch(`/api/devices/${id}`, {
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
        
  const handlesetCircuitBreaker = () => {
    
    if(!circuitBreaker){

      const response = fetch(`api/commands/send`, {
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

      const response = fetch(`api/commands/send`, {
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

  const handleSetAlarm = () => {
    
    if(!alarmActivated){

      const response = fetch(`api/commands/send`, {
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

        const response = fetch(`api/commands/send`, {
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
              <img
                className={classes.dashImg}
                alt=""
                src="https://i.pinimg.com/originals/ef/f2/91/eff29127abbf0d8e5e99cda29401fa7f.png"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", color: "darkgray" }}>
                {t("deviceStatus")}:{" "}
                <span className={`status-${deviceFound.status}`}>
                  {deviceFound.status}
                </span>
              </p>
              <p style={{ fontSize: "14px", color: "darkgray" }}>
                {t('reportDeviceName')}:
              <span style={{ color: "Black" }} className={classes.pos}>
                  &nbsp;{deviceFound.name}
                </span>
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{t('sharedInfoTitle')}</h3>
              <Button style={{ display: 'none' }}>View All</Button>
            </div>
            <div className={classes.divCards}>
              <Button component="div" onClick={() => handleConfirmAlarm()}
              className={classes.buttonsCards} disabled={!availableFunction}>
                <Card style={{backgroundColor: `${alarmActivated ? '#54ff54' : 'white'}`}}
                  className={classes.root}
                  variant="outlined"
                >
                  <CardContent
                    className="card-device-detail">
                    <IconButton style={{ backgroundColor: "cornflowerblue" }}>
                      <i
                        style={{ color: "whitesmoke" }}
                        className="fas fa-car-battery"
                      />
                    </IconButton>
                    <p className={classes.messageCard}
                      style={{ display: `${availableFunction ? 'none' : 'inline'}` }}>
                      {t('sharedDisabled')}
                    </p>
                    <Typography className={classes.buttonTypogra}
                      variant="h6"
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
                  <Typography style={{textAlign: 'center', marginTop: '25px' }} className={classes.pos} color="textSecondary">
                      {`${alarmActivated ? `${t("commandEnable")}` : `${t("sharedDisabled")}`}`}
                    </Typography>

                  </CardContent>
                </Card>
              </Button>

              {/* Botton para activar o desactivar cortacorriente */}
              <Button component="div" onClick={() => handleConfirmcircuitBreaker()}
                className={classes.buttonsCards} disabled={!availableFunction}>
                <Card style={{backgroundColor: `${circuitBreaker ? '#54ff54' : 'white'}`}}
                className={classes.root} variant="outlined">
                  <CardContent className="card-device-detail">
                    <IconButton style={{ backgroundColor: "cornflowerblue" }}>
                      <i
                        style={{ color: "whitesmoke" }}
                        className="fas fa-tachometer-alt"
                      />
                    </IconButton>
                    <p className={classes.messageCard}
                      style={{ display: `${availableFunction ? 'none' : 'inline'}` }}>
                      {t('sharedDisabled')}
                    </p>

                    <Typography className={classes.buttonTypogra}
                      variant="h6"
                      component="h4"
                    >
                      {t("circuitBreaker")}
                    </Typography>
                    <Typography style={{textAlign: 'center', marginTop: '45px' }} className={classes.pos} color="textSecondary">
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
              maxWidth="xs"
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
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {t('sharedCancel')}
          </Button>
                <Button onClick={() => handlesetCircuitBreaker()} color="primary" autoFocus>
                  {t('sharedSet')}
          </Button>
              </DialogActions>
            </Dialog>
          </div>

           {/*Dialog Confirm Alarm */}
           <div>           
            <Dialog
              open={openAlarm}
              maxWidth="xs"
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
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {alarmActivated ? `¿${t('commandAlarmDisarm')}?` : `¿${t('commandAlarmArm')}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {t('sharedCancel')}
          </Button>
                <Button onClick={() => handleSetAlarm()} color="primary" autoFocus>
                  {t('sharedSet')}
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
