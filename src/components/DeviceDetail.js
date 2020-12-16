import React, { useEffect, useLayoutEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
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

const useStyles = deviceDetailStyles;

const DeviceDetail = (props) => {
  let { id } = useParams();
  const devices = useSelector((state) => Object.values(state.devices.items),
    shallowEqual
  );
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const classes = useStyles();
  const [deviceFound, setDeviceFound] = useState({});
  const [availableTypesByDeviceId, setAvailableTypesByDeviceId] = useState([]);
  const [availableFunction, setAvailableFunction] = useState(false);
  const [circuitBraker, setCircuitBraker] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAlarm, setOpenAlarm] = useState(false);
  const [alarmActivated, setAlarmActivated] = useState(false);

  useEffect(() => {
    const result = devices.find((el) => el.id === parseInt(id));
    setDeviceFound(result);
  }, []);

  useEffect(() => {
    const searchType = () => {
      if (availableTypesByDeviceId.length > 1) {
        setAvailableFunction(true);
      } else {
        setAvailableFunction(false);
      }

    };
    searchType();

  }, [availableTypesByDeviceId])


  useEffect(() => {
    const getCommandTypes = async () => {
      const response = await service.getCommandTypes(id);

      setAvailableTypesByDeviceId(response);
      console.log(availableTypesByDeviceId);
    };
    getCommandTypes();
  }, [])

  const handleConfirmCircuitBraker = () => {
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
        
  const handleSetCircuitBraker = () => {
    
    if(circuitBraker === false){
      const param = {};
      param.type = 'engineStop';

      console.log(param)
      // const response = fetch(`api/commands/send?deviceId=${id}`, {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json',
      //           'Accept': 'application/json',},
      //   body: JSON.stringify(param),})
      //   .then(response => console.log(response))

      //   if(response.ok)
          setCircuitBraker(true);   
              
      } else {
        const param = {};
        param.type = 'engineResume';

        console.log(param)
        // const response = fetch(`api/commands/send?deviceId=${id}`, {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/json',
        //           'Accept': 'application/json',},
        //   body: JSON.stringify(param),})
        //   .then(response => console.log(response))
  
        //   if(response.ok){
            setCircuitBraker(false);
        //   } else{
        //     console.log('error')
        //   }
      }
      handleClose(); 
  }

  const handleSetAlarm = () => {
    
    if(alarmActivated === false){
      const param = {};
      param.type = 'alarmArm';

      console.log(param)
      // const response = fetch(`api/commands/send?deviceId=${id}`, {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json',
      //           'Accept': 'application/json',},
      //   body: JSON.stringify(param),})
      //   .then(response => console.log(response))

      //   if(response.ok)
          setAlarmActivated(true);   
              
      } else {
        const param = {};
        param.type = 'alarmDisarm';

        console.log(param)
        // const response = fetch(`api/commands/send?deviceId=${id}`, {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/json',
        //           'Accept': 'application/json',},
        //   body: JSON.stringify(param),})
        //   .then(response => console.log(response))
  
        //   if(response.ok){
            setAlarmActivated(false);
        //   } else{
        //     console.log('error')
        //   }
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
              <Button onClick={() => handleConfirmAlarm()}
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
                  <Typography style={{ marginTop: '25px' }} className={classes.pos} color="textSecondary">
                      {`${alarmActivated ? `${t("commandEnable")}` : `${t("sharedDisabled")}`}`}
                    </Typography>

                  </CardContent>
                </Card>
              </Button>
              <Button onClick={() => handleConfirmCircuitBraker()}
                className={classes.buttonsCards} disabled={!availableFunction}>
                <Card style={{backgroundColor: `${circuitBraker ? '#54ff54' : 'white'}`}}
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
                      {t('activateCircuitBreaker')}
                    </Typography>
                    <Typography style={{ marginTop: '45px' }} className={classes.pos} color="textSecondary">
                      {`${circuitBraker ? `${t("commandEnable")}` : `${t("sharedDisabled")}`}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </div>
          </div>

           {/*Dialog Confirm CircuitBraker */}
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
                  {`¿${t('activateCircuitBreaker')}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {t('sharedCancel')}
          </Button>
                <Button onClick={() => handleSetCircuitBraker()} color="primary" autoFocus>
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
              id="alert-dialog-title">Alarma
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
                  ¿Armar/Desarmar Alamar?
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
