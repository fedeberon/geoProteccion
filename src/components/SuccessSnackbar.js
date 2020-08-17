import {useDispatch, useSelector} from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import {notificationActions} from "../store";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";

export default function SuccessSnackbar() {
  const dispatch = useDispatch();
  const { successSnackbarMessage, successSnackbarOpen } = useSelector(state => state.notification);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
  });


  function handleClose() {
    dispatch(notificationActions.apply({type: 'SNACKBAR_CLEAR'}));
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      open={successSnackbarOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      aria-describedby="client-snackbar"
      TransitionComponent={Transition}
      message={
        <span id="client-snackbar">
          {successSnackbarMessage}
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
