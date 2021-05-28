import React, { useEffect, useState, Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import t from "../common/localization";
import ReportsMap from "./ReportsMap";
import PropTypes from "prop-types";
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import GetAppIcon from '@material-ui/icons/GetApp';
import CachedIcon from '@material-ui/icons/Cached';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import * as service from "../utils/serviceManager";
import { getDateTime, getHoursMinutes } from '../utils/functions';
import Box from "@material-ui/core/Box";
import ReportsConfig from "./ReportsConfig";
import ReportsGraphic from "./ReportsGraphic";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {
  getRoutesReports,
  getEventsReports,
  getPositionsReports,
  getTripsReports,
  getStopsReports,
  getSummaryReports,
  getPositionsByDeviceId,
  getGraphicData,
} from "../utils/serviceManager";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector } from "react-redux";
import { downloadCsv, getCourse } from "../utils/functions";
import GraphicChart from "./GraphicChart";
import reportsDialogStyles from "./styles/ReportsDialogStyles";
import Select from '@material-ui/core/Select';
import ReportsTrips from './ReportsTrips';
import ReportsStops from './ReportsStops';
import ReportsSummary from './ReportsSummary';


const useStyles = reportsDialogStyles;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReportsDialog({
  geozones,
  showReports,
  showReportsDialog,
}) {
  const classes = useStyles();
  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop
  );
  const userId = useSelector((state) => state.session.user.id);
  const server = useSelector((state) => state.session.server);
  const [devices, setDevices] = useState([]);
  const [addressFound, setAddressFound] = useState('');
  const [open, setOpen] = React.useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [reportConfiguration, setReportConfiguration] = useState({});
  const [route, setRoute] = useState([]);
  const [reportType, setReportType] = useState();
  const [selectedPosition, setSelectedPosition] = useState({});
  const [events, setEvents] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripsRoutes, setTripsRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [summary, setSummary] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sliceLastIndex, setSliceLastIndex] = useState(15);
  const [sliceFirstIndex, setSliceFirstIndex] = useState(0);
  const [graphicData, setGraphicData] = useState([]); 
  const [positionState, setPositionState] = useState({
    accuracy: 0, address: null, altitude: 0, 
    attributes: {
      alarm: '',
      distance: '',
      hours: '',
      ignition: false,
      motion: false,
      totalDistance: ''
    }, course: 0, deviceId: 0, deviceTime: '', fixTime: '', id: 0, latitude: 0,
    longitude: 0, network: null, outdated: false, protocol: '', serverTime: '', speed: 0,
    type: null, valid: false 
  });

  const handleChangeReportType = (event) => {
    setReportType(event.target.value);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      setSliceLastIndex((prevValue) => prevValue + 15);
    }
    if (sliceLastIndex > 45 && sliceLastIndex - sliceFirstIndex > 30) {
      setSliceFirstIndex(sliceLastIndex - 30);
    }
    if (
      scrollHeight - `${isViewportDesktop ? 3.2 : 2.1}` * clientHeight >
        scrollTop &&
      scrollHeight - clientHeight > clientHeight
    ) {
      setSliceLastIndex((prevValue) => prevValue - 15);
      if (sliceFirstIndex > 0) {
        setSliceFirstIndex((prevValue) => prevValue - 15);
      }
    }
  };

  const getDevices = async (userId) => {
    const response = await service.getDeviceByUserId(userId);
    setDevices(response);
  };

  useEffect(() => {
    getDevices(userId);
  },[])

  useEffect(() => {
    setOpen(showReports);
  }, [showReports]);

  const handleClose = () => {
    setOpen(false);
    showReportsDialog(false);
  };

  //Abrir y cerrar Modal de configuracion
  const handleOpenConfigModal = () => {
    setOpenConfigModal(true);
  };

  const handleCloseConfigModal = () => {
    setOpenConfigModal(false);
  };
  //Fin

  const handleFullscreen = () => {
    if (hidden) {
      setHidden(false);
    }
    setFullscreen(!fullscreen);
  };

  const handleVisibility = () => {
    if (!hidden) {
      setFullscreen(false);
    }
    setHidden(!hidden);
  };

  const handleReportsConfig = (configuration) => {
    setReportConfiguration(configuration);
  };

  const handleResetConfig = () => {
    setReportConfiguration({});
    handleCloseConfigModal();
  };

  const handleShowConfig = async () => {
    setHidden(false);
    handleClearTables();
    setTripsRoutes([]);
    setSliceFirstIndex(0);
    setSliceLastIndex(15);
    setIsLoading(true);
    let params = "";
    let groups = "";
    let response = "";
    let types = "";
    let positions = "";

    switch (reportType) {
      case "route":
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + "deviceId=" + element + "&";
        });
        reportConfiguration.arrayGroupSelected.map((element) => {
          groups = groups + "groupId=" + element + "&";
        });
        response = await getRoutesReports(
          reportConfiguration.fromDate, 
          reportConfiguration.toDate, 
          params,
          groups
        );
        setRoute(response);
        setIsLoading(false);
        break;
      case "events":
        setHidden(true);
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + "deviceId=" + element + "&";
        });
        reportConfiguration.arrayTypeEventSelected.map((element) => {
          types = types + "type=" + element + "&";
        });

        response = await getEventsReports(
          reportConfiguration.fromDate, 
          reportConfiguration.toDate, 
          params, 
          types
        );
        setEvents(response);

        response.map((element, index) => {
          if (element.positionId !== 0) {
            positions = positions + "id=" + element.positionId + `${index !== events.length - 1 ? "&" : ""}`;
          }
        });

        let responsePositions = await getPositionsReports(positions);
        setPositions(responsePositions);
        setIsLoading(false);
        break;
      case "trips":
        setHidden(true);
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + "deviceId=" + element + "&";
        });
        reportConfiguration.arrayTypeEventSelected.map((element) => {
          types = types + "type=" + element + "&";
        });

        response = await getTripsReports(
          reportConfiguration.fromDate, 
          reportConfiguration.toDate,  
          types, 
          params);
        setTrips(response);

        let tripsArray = [...response];
        let tripsRouteArray = [];

        await getPositions(reportConfiguration.arrayDeviceSelected, reportConfiguration.fromDate, reportConfiguration.toDate)
          .then((results) => {
            setPositions(results);
            positions = results;
          })
          .catch((e) => console.log(e));

        for (let i = 0; i < tripsArray.length; i++) {
          let deviceId = tripsArray[i].deviceId;

          let startPositionId = tripsArray[i].startPositionId;
          let endPositionId = tripsArray[i].endPositionId;

          response = positions[reportConfiguration.arrayDeviceSelected.indexOf(deviceId)].filter(
            (pos) => pos.id >= startPositionId && pos.id <= endPositionId
          );
          tripsRouteArray.push(response);
        }

        setTripsRoutes(tripsRouteArray);
        setIsLoading(false);
        break;
      case "stops":
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + "deviceId=" + element + "&";
        });

        response = await getStopsReports(reportConfiguration.fromDate, reportConfiguration.toDate, params);
        setStops(response);

        response.map((element, index) => {
          if (element.positionId !== 0) {
            positions =
              positions +
              "id=" +
              element.positionId +
              `${index !== events.length - 1 ? "&" : ""}`;
          }
        });

        response = await getPositionsReports(positions);
        setPositions(response);
        setIsLoading(false);
        break;
      case "summary":
        setHidden(true);
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + "deviceId=" + element + "&";
        });

        response = await getSummaryReports(reportConfiguration.fromDate, reportConfiguration.toDate, params);
        setSummary(response);
        setIsLoading(false);
        break;
      case "graphic":
        if(window.innerWidth < 767){
          setHidden(true);
        };
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + "deviceId=" + element + "&";
        });
        response = await getGraphicData(reportConfiguration.fromDate, reportConfiguration.toDate, params);
        let data = [];
        let auxItem = {};
        response.map((item) => {
          if(item.speed > 0.099){
            auxItem = {
              name: GetDeviceName(item.deviceId),
              speed: Number(item.speed.toFixed(2)),
              altitude: item.altitude,
              accuracy: item.accuracy,
              latitude: item.latitude,
              longitude: item.longitude,
              deviceId: item.deviceId,
              fixTime: item.fixTime,
              course: item.course,
              attributes: item.attributes,
              id: item.id,
              serverTime: item.serverTime,
              protocol: item.protocol,
              valid: item.valid,              
            }
            data.push(auxItem);
          }
        });

        setGraphicData(data);
             
        setIsLoading(false);
        break;
      default:
        break;
    }
    handleCloseConfigModal();
  };

  const getPositions = (devices, from, to) => {
    let promises = [];
    for (let i = 0; i < devices.length; i++) {
      promises.push(getPositionsByDeviceId(devices[i], from, to));
    }
    return Promise.all(promises);
  };

  const handleSelectedPosition = (position) => {
    setSelectedPosition(position);
    setAddressFound("");
    setPositionState(position);
  };

  const getAddress = async(lat, lon) => {
    let response = await fetch(`api/server/geocode?latitude=${lat}&longitude=${lon}`, {method: 'GET'})
          .catch(function (error) { console.log('setCurrentAddress error: ', error)})
          .then(response => response.text());

    setAddressFound(response);
  };  

  const handleDownloadExcel = () => {
    let columns = [];
    let data = [];

    switch (reportType) {
      case "route":
        columns = [
          "Id",
          "N dispositivo",
          "Valida",
          "Fecha y hora",
          "Latitud",
          "Longitud",
          "Altitud",
          "Velocidad",
        ];
        route.map((e) => {
          data = [
            ...data,
            e.id,
            e.deviceId,
            e.valid,
            e.serverTime,
            e.latitude,
            e.longitude,
            e.altitude,
            e.speed,
          ];
        });
        break;
      case "events":
        columns = [
          "Id",
          "Fecha y hora",
          "Nombre de dispositivo",
          "Tipo",
          "Geocerca",
          "Mantenimiento",
        ];
        events.map((e) => {
          data = [
            ...data,
            e.id,
            e.serverTime,
            e.deviceId,
            e.type,
            e.geofenceId,
            e.maintenanceId,
          ];
        });
        break;
      case "trips":
        columns = [
          "Id",
          "Nombre de dispositivo",
          "Hora de Inicio",
          "Hora de Fin",
          "Odómetro inicial",
          "Dirección de inicio",
          "Odómetro final",
          "Dirección final",
          "Distancia",
          "Velocidad promedio",
          "Velocidad máxima",
          "Duración",
          "Combustible utilizado",
          "Conductor",
        ];
        trips.map((e) => {
          data = [
            ...data,
            e.id,
            e.deviceName,
            e.startTime,
            e.endTime,
            e.startOdometer,
            e.startAddress,
            e.endOdometer,
            e.endAddress,
            e.distance,
            e.averageSpeed,
            e.maxSpeed,
            e.duration,
            e.spentFuel,
            e.driverName ? e.driverName : "null",
          ];
        });
        break;
      case "stops":
        columns = [
          "Id",
          "Nombre de dispositivo ",
          "Hora de inicio",
          "Hora de fin",
          "Odómetro",
          "Dirección",
          "Duración",
          "Horas motor",
          "Combustible utilizado",
        ];
        stops.map((e) => {
          data = [
            ...data,
            e.id,
            e.deviceName,
            e.startTime,
            e.endTime,
            e.startOdometer,
            e.Address,
            e.duration,
            e.engineHours,
            e.spentFuel,
          ];
        });
        break;
      case "summary":
        columns = [
          "Id",
          "Nombre de dispositivo",
          "Distancia",
          "Odómetro inicial",
          "Odómetro final",
          "Velocidad promedio",
          "Velocidad máxima",
          "Horas motor",
          "Combustible utilizado",
        ];
        summary.map((e) => {
          data = [
            ...data,
            e.id,
            e.deviceName,
            e.startTime,
            e.endTime,
            e.startOdometer,
            e.Address,
            e.duration,
            e.engineHours,
            e.spentFuel,
          ];
        });
        break;
      default:
        break;
    }
    downloadCsv(columns, data, reportType);
  };

  const GetDeviceName = (id) => {
    let name;
    devices && devices.map((dev) => {
      if(dev.id === id){
        name = dev.name;
      }
    });
    return name;
  };

  const handleClearTables = () => {
    setRoute([]);
    setEvents([]);
    setTrips([]);
    setStops([]);
    setSummary([]);
    setGraphicData([]);
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {t("reportTitle")}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>


        {/*Modal Configuration*/}
          <Table style={{display: 'block', overflowX: window.innerWidth < 767 ? 'scroll' : ''}}>
            <TableBody style={{display: 'block', marginLeft: '15px'}}>
              <TableRow>
                 <TableCell style={{padding: 0}}>
                  <Select
                    native
                    value={reportType}
                    onChange={handleChangeReportType}
                    name="Reports"
                    inputProps={{
                      id: "age-native-required",
                    }}
                  >
                    <option value=""/>
                    <option value="route">{t("reportRoute")}</option>
                    <option value="events">{t("reportEvents")}</option>
                    <option value="trips">{t("reportTrips")}</option>
                    <option value="stops">{t("reportStops")}</option>
                    <option value="summary">{t("reportSummary")}</option>
                    <option value="graphic">{t("reportChart")}</option>
                  </Select>  
                </TableCell>
                <TableCell style={{padding: 0}}>
                  <Button
                    className={classes.buttonsConfig}
                    variant="outlined"
                    color="primary"
                    disabled={!reportType}
                    onClick={handleOpenConfigModal}
                  >
                    {window.innerWidth < 767 ? <PermDataSettingIcon title={t("reportConfigure")} /> : t("reportConfigure")}
                  </Button>
                </TableCell>
                <TableCell style={{padding: 0}}>
                <Button
                  className={classes.buttonsConfig}
                  variant="outlined"
                  color="primary"
                  disabled={
                    reportType === "graphic" ||
                    !reportType
                  }
                  onClick={handleDownloadExcel}
                >
                   {window.innerWidth < 767 ? <GetAppIcon title={t("reportExport")} /> : t("reportExport")}
                   
                </Button>
                </TableCell>
                <TableCell style={{padding: 0}}>
                  <Button
                      className={classes.buttonsConfig}
                      variant="outlined"
                      color="primary"
                      disabled={!reportType}
                      //onClick={handleOpenConfigModal}
                    >
                    {window.innerWidth < 767 ? <MailOutlineIcon title={t("reportEmail")}/> : t("reportEmail")}
                  </Button>
                </TableCell>
                    
                <TableCell style={{padding: 0}}>
                <Button
                  className={classes.buttonsConfig}
                  variant="outlined"
                  color="primary"
                  disabled={!reportType}
                  onClick={handleClearTables}
                >
                  {window.innerWidth < 767 ? <CachedIcon title={t("reportClear")}/> : t("reportClear")}
                </Button>    
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <Dialog
            open={openConfigModal}
            onClose={handleCloseConfigModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Toolbar>
              <DialogTitle
                style={{
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "ghostwhite",
                }}
                id="alert-dialog-title"
              >
                {t("reportTitle")}
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={handleCloseConfigModal}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
            </Toolbar>
            <Divider />
            <DialogContent>
              <ReportsConfig reportType={reportType} handleReportsConfig={handleReportsConfig} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResetConfig} color="primary">
                {t("sharedCancel")}
              </Button>
              <Button onClick={handleShowConfig} color="primary" autoFocus>
                {t("reportShow")}
              </Button>
            </DialogActions>
          </Dialog>
        

        
        {/*Table for ROUTE Reports*/}
        {route.length > 0 && reportType === 'route' &&
        <div
          onScroll={handleScroll}
          // style={{ display: `${route.length === 0 ? "none" : "block"}` }}
          className={`scrollbar ${classes.tableReports}`}
        >
            <Table stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("reportDeviceName")}</TableCell>
                  <TableCell>{t("positionValid")}</TableCell>
                  <TableCell>{t("positionDate")}</TableCell>
                  <TableCell>{t("positionLatitude")}</TableCell>
                  <TableCell>{t("positionLongitude")}</TableCell>
                  <TableCell>{t("positionAltitude")}</TableCell>
                  <TableCell>{t("positionSpeed")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {route
                  .slice(
                    sliceFirstIndex < route.length - 30
                      ? sliceFirstIndex
                      : (route.length - 30) * (route.length > 30),
                    sliceLastIndex < route.length
                      ? sliceLastIndex
                      : route.length
                  )
                  .map((object) => (
                    <TableRow
                      key={object.id}
                      className={classes.row}
                      onClick={() => handleSelectedPosition(object)}
                    >
                      <TableCell>{GetDeviceName(object.deviceId)}</TableCell>
                      <TableCell>{t(`${Boolean(object.valid)}`)}</TableCell>
                      <TableCell>{getDateTime(object.serverTime)}</TableCell>
                      <TableCell>{`${object.latitude.toFixed(6)}°`}</TableCell>
                      <TableCell>{`${object.longitude.toFixed(6)}°`}</TableCell>
                      <TableCell>{object.altitude}</TableCell>
                      <TableCell>{`${object.speed.toFixed(1)} ${server && `${server.attributes?.speedUnit}`}`}</TableCell>  
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
        </div>
        }

        
        {/*Table for EVENTS Reports*/}
        <div
          onScroll={handleScroll}
          style={{ display: `${events.length === 0 ? "none" : "inline-block"}` }}
          className={`scrollbar ${classes.tableEventsReports}`}
        >
            <Table stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("positionDate")}</TableCell>
                  <TableCell>{t("reportDeviceName")}</TableCell>
                  <TableCell>{t("sharedType")}</TableCell>
                  <TableCell>{t("sharedGeofence")}</TableCell>
                  <TableCell>{t("sharedMaintenance")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(
                    sliceFirstIndex < events.length - 30
                      ? sliceFirstIndex
                      : (events.length - 30) * (events.length > 30),
                    sliceLastIndex < events.length
                      ? sliceLastIndex
                      : events.length
                  )
                  .map((object) => (
                    <TableRow
                      key={object.id}
                      className={classes.row}
                      // onClick={() => 
                      //   handleSelectedPosition(positions.find((element) => element.id === object.positionId))                       
                      // }
                    >
                      <TableCell>{getDateTime(object.serverTime)}</TableCell>
                      <TableCell>{GetDeviceName(object.deviceId)}</TableCell>
                      <TableCell>{t(`${object.type}`)}</TableCell>
                      <TableCell>{object.geofenceId === 0 ? '' : object.geofenceId}</TableCell>
                      <TableCell>{object.maintenanceId === 0 ? '' : object.maintenanceId}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
        </div>

        {window.innerWidth > 767 &&
        <div
          onScroll={handleScroll}
          style={{ display: `${((route.length > 0 || stops.length > 0 || graphicData.length > 0) && window.innerWidth > 767) ? "inline-block" : "none"}` }}
          className={`scrollbar ${classes.tableReportsState}`}>
            
            <Table stickyHeader={true} size={"small"}>
              <TableHead>
                <TableRow>
                    <TableCell>{t("stateTitle")}</TableCell>
                    <TableCell/>
                </TableRow>
                <TableRow>
                    <TableCell>{t("stateName")}</TableCell>
                    <TableCell>{t("stateValue")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{display: positionState && !positionState.serverTime ? 'none' : ''}}>
                <TableRow className={classes.row}>
                <TableCell>Hora</TableCell>
                <TableCell>{positionState && 
                            positionState.serverTime ? getDateTime(positionState.serverTime) : ""}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Latitud</TableCell>
                <TableCell>{positionState && positionState.latitude.toFixed(6)}°</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Longitud</TableCell>
                <TableCell>{positionState && positionState.longitude.toFixed(6)}°</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Válida</TableCell>
                <TableCell>{t(`${Boolean(positionState && positionState.valid)}`)}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Precisión</TableCell>
                <TableCell>{positionState && positionState.accuracy.toFixed(2)} {server && `${server.attributes?.distanceUnit}`}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Altitud</TableCell>
                <TableCell>{positionState && positionState.altitude}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Velocidad</TableCell>
                <TableCell>{positionState && positionState.speed.toFixed(1)} {server && `${server.attributes?.speedUnit}`}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Curso</TableCell>
                <TableCell>{getCourse(positionState && positionState.course)}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Dirección</TableCell>
                <TableCell style={{color: 'blue', textDecoration: 'underline'}}
                disabled={addressFound} onClick={() => getAddress(positionState && positionState.latitude, positionState.longitude)}>
                {`${addressFound === "" ? `${t("sharedShowAddress")}` : `${addressFound}`}`}
                </TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Distancia</TableCell>
                <TableCell>{positionState && (positionState.attributes?.distance /1000).toFixed(2)} {server && `${server.attributes?.distanceUnit}`}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Distancia Total</TableCell>
                <TableCell>
                    {(Math.round(positionState && positionState.attributes?.totalDistance) / 1000).toFixed(2)} {server && `${server.attributes?.distanceUnit}`}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Encendido</TableCell>
                <TableCell>{t(`${Boolean(positionState && positionState.attributes?.ignition)}`)}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Horas</TableCell>
                <TableCell>{positionState && getHoursMinutes(positionState.attributes?.hours)}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Movimiento</TableCell>
                <TableCell>{t(`${Boolean(positionState && positionState.attributes?.motion)}`)}</TableCell>
                </TableRow>
                <TableRow className={classes.row}>
                <TableCell>Protocolo</TableCell>
                <TableCell>{`${positionState && positionState.protocol}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </div>
          }        
        
        {/*Trips reports*/}
        <div>
          <ReportsTrips dataPositions={positions} dataTrips={trips} selected={handleSelectedPosition}/>
        </div>
        
        {/*Stops reports*/}
        <div>
          <ReportsStops dataPositions={positions} dataStops={stops} selected={handleSelectedPosition}/>
        </div>

        {/*Summary reports*/}
        <div>
          <ReportsSummary dataSummary={summary}/>
        </div>

        {/*Graphic reports */}
        {graphicData.length > 0 && reportType === 'graphic' &&         
        <div
          className={classes.graphic}>
          <ReportsGraphic 
            selected={handleSelectedPosition}
            type={reportType} 
            items={graphicData} 
            graphicType={reportConfiguration.graphicType}
            devices={reportConfiguration.arrayDeviceSelected}
          />
        </div>}

        {/*POSITIONS Reports */}
        <div
          className={`${classes.overflowHidden} ${
            fullscreen ? classes.fullscreen : classes.miniature
          } ${hidden ? classes.hidden : classes.visible}`}>
          <i
            className={`fas ${fullscreen ? "fa-compress" : "fa-expand"} fa-lg ${
              classes.fullscreenToggler
            }`}
            onClick={() => handleFullscreen()}
          ></i>
          <i
            className={`fas ${
              hidden ? "fa-chevron-up" : "fa-chevron-down"
            } fa-lg ${classes.miniatureToggler}`}
            onClick={() => handleVisibility()}
          ></i>
          <ReportsMap
            geozones={geozones}
            route={route}
            events={positions}
            trips={tripsRoutes}
            showMarkers={reportConfiguration.showMarkers}
            selectedPosition={selectedPosition}
            graphic={graphicData}
          />
        </div>
      </Dialog>
    </div>
  );
}
