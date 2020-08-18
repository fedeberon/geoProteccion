import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {sessionActions} from '../store';
import {useHistory} from 'react-router-dom';
import {makeStyles, withWidth} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import DeviceList from '../components/DeviceList';
import MainMap from '../components/MainMap';
import SocketController from '../components/SocketController';
import MyMenuComponet from '../components/MyMenuComponet';
import MainToolbar from "../components/MainToolbar";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import SpeedDialsComponent from "../components/SpeedDialsComponent";




const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down('xs')]: {
      flexDirection: "column-reverse"
    }
  },
  drawerPaper: {
    position: 'right',
    [theme.breakpoints.up('sm')]: {
      width: 350
    },
    [theme.breakpoints.down('xs')]: {
      height: 250
    }
  },
  mapContainer: {
    flexGrow: 1
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));


const MainPage = ({ width }) => {
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.session.authenticated);
  const classes = useStyles();
  const history = useHistory();

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    if (!authenticated) {
      fetch('/api/session').then(response => {
        if (response.ok) {
          dispatch(sessionActions.authenticated(true));
        } else {
          history.push('/login');
        }
      });
    }
  }, [authenticated]);

  return !authenticated ? (<LinearProgress />) : (
    <div className={classes.root}>
      <SocketController />

      <div className={classes.content}>
        <Drawer
          anchor='right'
          open={checked}
          onClose={handleChange}
          onClick={handleChange}
          classes={{ paper: classes.drawerPaper }}>
          <DeviceList />
        </Drawer>

        <MyMenuComponet/>

        <div className={classes.mapContainer}>
          <ContainerDimensions>
            <MainMap />
          </ContainerDimensions>
        </div>
      </div>


      <SpeedDialsComponent />
  {/*    <Fab size="medium" color="primary" className={classes.fab}>
        <AddIcon />
      </Fab>*/}

    </div>
  );
}

export default withWidth()(MainPage);
