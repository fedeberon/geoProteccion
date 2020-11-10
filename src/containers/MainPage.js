import React, { useEffect, useState } from 'react';
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
import * as service from "../utils/serviceManager";
import ShortcutsMenu from "../components/ShorcutsMenu";
import ReportsDialog from "../components/ReportsDialog";


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
  const [geozones, setGeozones] = useState([]);
  const authenticated = useSelector(state => state.session.authenticated);
  const classes = useStyles();
  const open = useSelector(state => state.modals.items.search);
  const userId = useSelector((state) => state.session.user.id);
  const [ areGeozonesVisible, setAreGeozonesVisible] = useState(true);
  const [showReports, setShowReports] = useState(false)

  const handleVisibilityModal = (name) => {
    dispatch(modalsActions.show(name));
  }

  useEffect(() => {
    const getGeozones = async (userId) => {
      const response = await service.getGeozonesByUserId(userId);
      setGeozones(response);
    }
    getGeozones(userId);
  }, [userId]);

  const handleGeozones = () => {
    setAreGeozonesVisible(!areGeozonesVisible);
  }

  const handleReports = (value = true) => {
    setShowReports(value);
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

        {!showReports &&
          <div className={classes.mapContainer}>
            <ContainerDimensions>
              <MainMap geozones={geozones} areGeozonesVisible={areGeozonesVisible}/>
            </ContainerDimensions>
          </div>
        }
      </div>

      <ShortcutsMenu toggleGeozones={handleGeozones} showReportDialog={handleReports}/>
      <Menu />
      
      {showReports &&
        <div >
          <ReportsDialog geozones={geozones} showReports={showReports} showReportsDialog={handleReports} />
        </div>
      }

    </div>
  );
}

export default withWidth()(MainPage);
