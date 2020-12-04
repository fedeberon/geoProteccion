import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import React, { useEffect, useState } from "react";
import { notificationActions } from "../store";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import t from "../common/localization";

export default function SuccessSnackbar() {
  const dispatch = useDispatch();
  const { successSnackbarMessage, successSnackbarOpen } = useSelector(
    (state) => state.notification
  );
  const devices = useSelector((state) => Object.values(state.devices.items));
  const [device, setDevice] = useState({});
  const [type, setType] = useState("");

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
  });

  function handleClose() {
    dispatch(notificationActions.apply({ type: "SNACKBAR_CLEAR" }));
  }

  useEffect(() => {
    let deviceName = "";
    if (successSnackbarMessage && devices) {
      deviceName = devices.find(
        (element) => element.id === successSnackbarMessage.deviceId
      ).name;
    }
    setDevice(deviceName);
    setType(successSnackbarMessage.type);
  }, [devices]);

  return (
    <Snackbar
      style={{ zIndex: `${successSnackbarOpen ? "1400" : "-1"}` }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={successSnackbarOpen}
      autoHideDuration={4000}
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
  );
}
