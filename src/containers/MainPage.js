import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {modalsActions} from '../store';
import {makeStyles, withWidth} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeviceList from '../components/DeviceList';
import MainMap from '../components/MainMap';
import SocketController from '../components/SocketController';
import Menu from "../components/Menu";
import ShortcutsMenu from "../components/ShorcutsMenu";

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
    margin: 30,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    borderRadius:   5,
    height: '96%',

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
  const open = useSelector(state => state.modals.items.search);

  const handleVisibilityModal = (name) => {
    dispatch(modalsActions.show(name));
  }

  return !authenticated ? (<LinearProgress />) : (
    <div className={classes.root}>
      <SocketController />

      <div className={classes.content}>
        <Drawer
          anchor='right'
          open={open}
          onClose={e => {
            e.stopPropagation();
            handleVisibilityModal('search')
          }}
          onClick={e => {
            e.stopPropagation();
            handleVisibilityModal('search')
          }}
          classes={{ paper: classes.drawerPaper }}
          >
          <DeviceList />
        </Drawer>

        <div className={classes.mapContainer}>
          <ContainerDimensions>
            <MainMap />
          </ContainerDimensions>
        </div>
      </div>

      <ShortcutsMenu />
      <Menu />
    </div>
  );
}

export default withWidth()(MainPage);
