import React, { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { sessionActions } from "../store";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import t from "../common/localization";
import * as service from "../utils/serviceManager";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import loginPageStyle from "./styles/LoginPageStyle";

function Copyright() {
  return (
    <Typography variant="body2" style={{color: "white"}} align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.geoproteccion.com/">
        Geos
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = loginPageStyle;

const LoginPage = () => {
  const dispatch = useDispatch();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpView, setSignUpView] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [showDialogSuccess, setShowDialogSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const nameRegex = /^[a-zA-Z]{4,12}[ ]?[a-zA-Z]{4,20}$/; 
  const emailRegex = /^\w[a-z0-9_.]+@[a-z]{4,12}.com$/;
  const passwordRegex = /^\w[a-zA-Z0-9]{6,14}$/;

  const classes = useStyles();
  const history = useHistory();

  const handleChangeCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleNameChange = (event) => {
    let validName = event.target.value;
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // const handleSuccessSubmit = () => {
  //   setShowDialogSuccess(!showDialogSuccess);
  // }

  // const handleRegister = () => {
  //   // event.preventDefault();
  //   // const response = await service.setUser(name, email, password);
  //   // if (response.ok) {
  //     console.log(`${t('loginCreated')}`)
  //   // } else {
  //   //   console.log('registro fallo')
  //   // }
  // }

  const handleLogin = async (event) => {
    event.preventDefault();

    let response = await service.setSession(email, password);
    const user = response.status === 200 ? await response.json() : "";

    if (response.ok) {
      dispatch(sessionActions.authenticated(true));
      dispatch(sessionActions.setUser(user));
      response = await service.getServer();
      dispatch(sessionActions.setServer(response));
      if (isChecked) {
        localStorage.username = email;
        localStorage.password = password;
        localStorage.checkbox = isChecked;
        localStorage.token = user.token;
      } else {
        localStorage.username = "";
        localStorage.password = "";
        localStorage.checkbox = false;
        localStorage.token = "";
      }
      setTimeout(() => {
        history.push("/");
      }, 1500); 
    } else {
      setFailed(true);
      setPassword("");
    }
  };

  useLayoutEffect(() => {
    if (history.location === "/logout") {
      dispatch(sessionActions.authenticated(false));
      dispatch(sessionActions.setUser({}));
      localStorage.username = "";
      localStorage.password = "";
      localStorage.checkbox = false;
      localStorage.token = "";
    }

    // if (
    //   localStorage.checkbox === "true" &&
    //   localStorage.username !== email &&
    //   localStorage.password !== password
    // ) {
    //   setEmail(localStorage.username);
    //   setPassword(localStorage.password);
    //   setIsChecked(localStorage.checkbox === "true");
    // }
  });



  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={12} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} className={classes.imageRight} component={Paper} elevation={6} square>
        <div
          className={classes.paper}
          style={{ display: signUpView ? "none" : "flex" }}
        >
          {/* <img
            alt="logo"
            loading="lazy"
            style={{ width: 80, margin: 20 }}
            src={require("../../public/images/logogeos.png").default}
          /> */}

          <form className={classes.form} noValidate onSubmit={handleLogin}>
            <TextField
              // margin="normal"
              id="emailInput"
              required
              fullWidth
              error={failed}
              placeholder={t("userEmail")}
              name="email"
              value={email}
              autoComplete="off"
              autoFocus
              onChange={handleEmailChange}
              helperText={failed && `${t("loginFailed")}`}
              InputProps={{
                className: classes.inputLogin,
                startAdornment: (
                  <InputAdornment position="start">
                    <PermIdentityIcon />
                  </InputAdornment>)
              }}
            />

            <TextField
              // margin="normal"
              id="passwordInput"              
              required
              fullWidth
              className={classes.passwordTextField}
              error={failed}
              placeholder={t("userPassword")}
              name="password"
              value={password}
              type="password"
              autoComplete="off"
              onChange={handlePasswordChange}
              InputProps={{
                className: classes.inputLogin,
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>)
              }}
            /> 

            <FormControlLabel
              className={classes.rememberForm}
              id="rememberControl"              
              control={
                <Checkbox
                  className={classes.checkBoxIcon}
                  icon={<RadioButtonUncheckedIcon/> }
                  checkedIcon={<CheckCircleOutlineIcon/>}
                  onChange={() => handleChangeCheckbox()}
                  checked={isChecked}
                  value={isChecked}
                  // color="primary"
                />
              }
              label={t("userRemember")}
            />

            <Button
              type="submit"
              // fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              // style={{ color: "black" }}
              disabled={!email || !password}
            >
              {t("loginLogin")}
            </Button>

          </form>
          <Box mt={1} className={classes.copyrightString}>
            <Copyright />
          </Box>
        </div>

        <div>
          <Dialog
            open={showDialogSuccess}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t("serverRegistration")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("loginCreate")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" autoFocus>
                {t("sharedAccept")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
