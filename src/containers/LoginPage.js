import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from '../store';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import t from '../common/localization';
import * as service from '../utils/serviceManager';
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.geoproteccion.com/">
        GeoProtecci&oacute;n
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(http://164.68.101.162:8093/img/Tesla-maps.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const LoginPage = () => {
  const dispatch = useDispatch();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const classes = useStyles();
  const history = useHistory();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleRegister = () => {
    // TODO: Implement registration
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await service.setSession(email, password);
    const user = await response.json();

    if (response.ok) {
      dispatch(sessionActions.authenticated(true));
      dispatch(sessionActions.setUser(user))
      history.push('/');
    } else {
      setFailed(true);
      setPassword('');
    }
  }

  return (

    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
        <img alt="logo" loading="lazy" style={{ width: 80, margin: 20 }} src={require('../../public/images/LogoGeos.png')}></img>

          <form className={classes.form} noValidate onSubmit={handleLogin}>

            <TextField
              margin="normal"
              required
              fullWidth
              error={failed}
              label={t('userEmail')}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange}
              helperText={failed && `${t("loginFailed")}`} />

            <TextField
              margin="normal"
              required
              fullWidth
              error={failed}
              label={t('userPassword')}
              name="password"
              value={password}
              type="password"
              autoComplete="current-password"
              onChange={handlePasswordChange} />


            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{color: 'white'}}
              disabled={!email || !password}>
              {t('loginLogin')}
            </Button>


            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Olvid&oacute; su contrase&ntilde;a ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"No tiene cuenta ? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>


  );
}

export default LoginPage;
