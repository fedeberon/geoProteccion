import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalsActions } from "../store";
import { withWidth } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import ContainerDimensions from "react-container-dimensions";
import LinearProgress from "@material-ui/core/LinearProgress";
import DeviceList from "../components/DeviceList";
import MainMap from "../components/MainMap";
import Menu from "../components/Menu";
import * as service from "../utils/serviceManager";
import ShortcutsMenu from "../components/ShorcutsMenu";
import ReportsDialog from "../components/ReportsDialog";
import NotificationList from "../components/NotificationList";
import mainPageStyle from "./styles/MainPageStyle";
import { devicesActions } from "../store";

const useStyles = mainPageStyle;

const MainPage = ({ width }) => {
  const dispatch = useDispatch();
  const [geozones, setGeozones] = useState([]);
  const authenticated = useSelector((state) => state.session.authenticated);
  const classes = useStyles();
  const open = useSelector((state) => state.modals.items.search);
  const user = useSelector((state) => state.session.user);
  const server = useSelector((state) => state.session.server);
  const [areGeozonesVisible, setAreGeozonesVisible] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mapZoom, setMapZoom] = useState(0);
  const [selectedState, setSelectedState] = useState(false);


  const handleVisibilityModal = (name) => {
    dispatch(modalsActions.show(name));
  };

  useEffect(() => {
    const getGeozones = async (userId) => {
      const response = await service.getGeozonesByUserId(userId);
      setGeozones(response);
    };
    setMapZoom(user.zoom !== 0 ? user.zoom : server.zoom);
    getGeozones(user.id);
  }, [user.id]);

  const handleGeozones = () => {
    setAreGeozonesVisible(!areGeozonesVisible);
  };

  const handleReports = (value = true) => {
    setShowReports(value);
  };

  const handleFollow = (deviceSelected, state) => {  
    setSelectedState(state)  
    if(deviceSelected !== null && !state){
      dispatch(devicesActions.select(deviceSelected));
    } else {
      dispatch(devicesActions.select(""));
      dispatch(devicesActions.selectedDevice(null));
    }
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return !authenticated ? (
    <LinearProgress />
  ) : (
    <div className={classes.root}>
      <div className={classes.content}>
        <Drawer
          anchor="right"
          open={open}
          onClose={(e) => {
            e.stopPropagation();
            handleVisibilityModal("search");
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleVisibilityModal("search");
          }}
          classes={{ paper: classes.drawerPaper }}
        >
          <DeviceList />
        </Drawer>

        {!showReports && server && (
              <div className={classes.mapContainer}>
                <ContainerDimensions>
                  <MainMap
                    geozones={geozones}
                    selected={selectedState}
                    areGeozonesVisible={areGeozonesVisible}
                    zoom={mapZoom}
                    rasterSource={server.mapUrl.replace(/&amp;/g, "&")}
                  />
                </ContainerDimensions>
              </div>
            )
         }
      </div>

      <ShortcutsMenu
        toggleGeozones={handleGeozones}
        showReportDialog={handleReports}
        setDeviceFollow={handleFollow}
        showNotificationsDialog={handleNotifications}
      />
      <Menu />

      {showReports && (
        <div>
          <ReportsDialog
            geozones={geozones}
            showReports={showReports}
            showReportsDialog={handleReports}
          />
        </div>
      )}

      {showNotifications && (
        <div>
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default withWidth()(MainPage);
