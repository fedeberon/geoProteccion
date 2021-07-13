import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import React, { useEffect, useState } from "react";
import { notificationActions } from "../store";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import t from "../common/localization";

function SuccessSnackbar() {
  const dispatch = useDispatch();
  const isViewportDesktop = useSelector((state) => state.session.deviceAttributes.isViewportDesktop);
  const { successSnackbarMessage, successSnackbarOpen } = useSelector(
    (state) => state.notification
  );
  const [devices, setDevices] = useState();
  const [device, setDevice] = useState({});
  const [type, setType] = useState("");

  useEffect(() => {
    fetch("/api/devices").then((response) => {
      if (response.ok) {
        response.json().then((devices) => {
          setDevices(devices);
        });
      }      
    });
  }, []);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  function handleClose() {
    dispatch(notificationActions.apply({ type: "SNACKBAR_CLEAR" }));
  }

  useEffect(() => {
    let deviceName = "";
    if (successSnackbarMessage && devices) {
      try{
        deviceName = devices.find(
          (element) => element.id === successSnackbarMessage.deviceId
        ).name;
      } catch (error){
        console.error(error);
      }
    }
    setDevice(deviceName);
    setType(successSnackbarMessage.type);
  }, [successSnackbarMessage]);

  return (
    <>
    
      <Snackbar
      style={{display: isViewportDesktop ? 'flex' : 'none',  zIndex: `${successSnackbarOpen ? "1400" : "-1"}` }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={successSnackbarOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      aria-describedby="client-snackbar"
      TransitionComponent={Transition}
      message={
        <span id="client-snackbar">
          {device}: {t(type)}
        </span>
      }
      action={
        <Button onClick={handleClose} color="inherit" size="small">
          Ok
        </Button>
      }
    />
    </>    
  );
};

export default SuccessSnackbar;