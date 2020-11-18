import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import t from "../common/localization";
import ReportsMap from './ReportsMap';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import ReportsConfig from "./ReportsConfig";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  getRoutesReports,
  getEventsReports,
  getPositionsReports,
  getTripsReports,
  getStopsReports,
  getSummaryReports,
  getPositionsByDeviceId,
  getGraphicData,
} from '../utils/serviceManager';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";
import {useSelector} from "react-redux";
import { downloadCsv } from "../utils/functions";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 2000,
    color: '#fff',
  },
  graphic: {
    top: '15%',
    left: '12%',
    height: '50%',
    margin: '3% !important',
    display: 'flex',
    padding: '25px',
    position: 'absolute',
  },
  miniature: {
    width: '25%',
    height: '30%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    transition: 'width 0.5s, height 0.5s',
    zIndex: 10000
  },
  positionButton: {
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    display: 'flex',
    top: '10%',
    [theme.breakpoints.up('md')]: {
      top: '15%',
    },
  },
  tableReports: {
    top: '25%',
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '75%',
    overflowY: 'auto',
    paddingBottom: '2.5%',
  },
  fullscreen: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    transition: 'width 0.5s, height 0.5s',
    zIndex: 10000
  },
  hidden: {
    height: '30px !important'
  },
  fullscreenToggler: {
    position: 'absolute',
    left: '10px',
    top: '10px',
    zIndex: 1,
    cursor: 'pointer',
  },
  miniatureToggler: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    zIndex: 1,
    cursor: 'pointer',
  },
  overflowHidden: {
    overflow: 'hidden'
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 'auto',
  },
  row: {
    padding: '3px',
    fontSize: '13px',
    '&:hover': {
      background: '#ccc',
      cursor: 'pointer',
    }
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={6}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function ReportsDialog({ geozones, showReports, showReportsDialog }) {
  const classes = useStyles();
  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);
  const [open, setOpen] = React.useState(false);
  const [ fullscreen, setFullscreen ] = useState(false);
  const [ hidden, setHidden ] = useState(false);
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [ reportConfiguration, setReportConfiguration ] = useState({});
  const [ route, setRoute ] = useState([]);
  const [ selectedPosition, setSelectedPosition ] = useState({});
  const [ events, setEvents ] = useState([]);
  const [ trips, setTrips ] = useState([]);
  const [ tripsRoutes, setTripsRoutes ] = useState([]);
  const [ stops, setStops ] = useState([]);
  const [ summary, setSummary ] = useState([]);
  const [ positions, setPositions ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ sliceLastIndex, setSliceLastIndex ] = useState(15);
  const [ sliceFirstIndex, setSliceFirstIndex ] = useState(0);
  const [ graphicData, setGraphicData ] = useState([]);
  const [ chartData, setChartData ] = useState({});
  const auxData = [];
  const timeData = [];

  const handleScroll = event => {
    const {scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      setSliceLastIndex((prevValue) => prevValue + 15);
    }
    if (sliceLastIndex > 45 && sliceLastIndex - sliceFirstIndex > 30){
      setSliceFirstIndex(sliceLastIndex - 30);
    }
    if (scrollHeight - `${isViewportDesktop ? 3.2 : 2.1}` * clientHeight > scrollTop && scrollHeight - clientHeight > clientHeight ){
      setSliceLastIndex((prevValue) => prevValue - 15);
      if(sliceFirstIndex > 0) {
        setSliceFirstIndex((prevValue) => prevValue - 15);
      }
    }
  };

  useEffect(()=> {
      setOpen(showReports)
  },[showReports]
  )

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
  }

  const handleVisibility = () => {
    if (!hidden) {
      setFullscreen(false);
    }
    setHidden(!hidden);
  }

  const handleReportsConfig = (configuration) => {
    setReportConfiguration(configuration);
  }

  const handleResetConfig = () => {
    setReportConfiguration({});
    handleCloseConfigModal();
  }

  const handleShowConfig = async () => {
    setRoute([]);
    setEvents([]);
    setTrips([]);
    setTripsRoutes([]);
    setStops([]);
    setSummary([]);
    setChartData({});
    setSliceFirstIndex(0);
    setSliceLastIndex(15);
    setIsLoading(true);
    let params = '';
    let from = '';
    let to = '';
    let response = '';
    let type = '';
    let positions = '';

    switch (reportConfiguration.report) {
      case 'route':
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + 'deviceId=' + element + '&';
        });
        from = reportConfiguration.fromDate + ':00Z';
        to = reportConfiguration.toDate + ':00Z';

        response = await getRoutesReports(from, to, params);
        setRoute(response);
        setIsLoading(false);
        break;
      case 'events':
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + 'deviceId=' + element + '&';
        });
        reportConfiguration.arrayTypeEventSelected.map((element) => {
          type = type + 'type=' + element + '&';
        });
        from = reportConfiguration.fromDate + ':00Z';
        to = reportConfiguration.toDate + ':00Z';

        response = await getEventsReports(from, to, type, params);
        setEvents(response);

        response.map((element, index) => {
          if (element.positionId !== 0) {
            positions = positions + 'id=' + element.positionId + `${index !== events.length - 1 ? '&' : ''}`;
          }
        });

        response = await getPositionsReports(positions);
        setPositions(response);
        setIsLoading(false)
        break;
      case 'trips':
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + 'deviceId=' + element + '&';
        });
        reportConfiguration.arrayTypeEventSelected.map((element) => {
          type = type + 'type=' + element + '&';
        });
        from = reportConfiguration.fromDate + ':00Z';
        to = reportConfiguration.toDate + ':00Z';

        response = await getTripsReports(from, to, type, params);
        setTrips(response);

        let tripsArray = [...response];
        let tripsRouteArray = [];

        for (let i = 0; i < tripsArray.length; i++) {
          let deviceId = tripsArray[i].deviceId;

          let startPositionId = tripsArray[i].startPositionId;
          let endPositionId = tripsArray[i].endPositionId;

          response = await getPositionsByDeviceId(deviceId, from, to);
          response = response.filter((pos) => pos.id >= startPositionId && pos.id <= endPositionId);
          tripsRouteArray.push(response);
        }

        setTripsRoutes(tripsRouteArray);
        setIsLoading(false)
        break;
      case 'stops':
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + 'deviceId=' + element + '&';
        });
        from = reportConfiguration.fromDate + ':00Z';
        to = reportConfiguration.toDate + ':00Z';

        response = await getStopsReports(from, to, params);
        setStops(response);

        response.map((element, index) => {
          if (element.positionId !== 0) {
            positions = positions + 'id=' + element.positionId + `${index !== events.length - 1 ? '&' : ''}`;
          }
        });

        response = await getPositionsReports(positions);
        setPositions(response);
        setIsLoading(false)
        break;
      case 'summary':
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + 'deviceId=' + element + '&';
        });
        from = reportConfiguration.fromDate + ':00Z';
        to = reportConfiguration.toDate + ':00Z';

        response = await getSummaryReports(from, to, params);
        setSummary(response);
        setIsLoading(false)
        break;
      case 'graphic':
        reportConfiguration.arrayDeviceSelected.map((element) => {
          params = params + 'deviceId=' + element + '&';
        });
        from = reportConfiguration.fromDate + ':00Z';
        to = reportConfiguration.toDate + ':00Z';

        response = await getGraphicData(from, to, params);
        setGraphicData(response);

        console.log(response);
        response = response.filter(e => new Date(e.serverTime).getMinutes() > 5 && new Date(e.serverTime).getMinutes() % 5 === 0);
        console.log(response);

        response.map(e => auxData.push(e.speed));

        if ( response.length > 20 ) {
          const looper = parseInt(response.length / 20);
          for (let i = looper; i < response.length; i = i + looper) {
            timeData.push(response[i].serverTime.toString());
          }
        } else {
          response.map(e => timeData.push(e.serverTime));
        }
        console.log(auxData);
        console.log(timeData);

        setChartData({
          labels: timeData,
          datasets: [
            {
              label: `${reportConfiguration.graphicType}`,
              data: auxData,
              borderWidth: 4
            }
          ],
        })
        setIsLoading(false);
        break;
      default:
        break;
    }
    handleCloseConfigModal();
  }

  const handleSelectedPosition = (position) => {
    setSelectedPosition(position);
  }

  const handleDownloadExcel = () => {
    let columns = [];
    let data = []

    switch (reportConfiguration.report) {
      case 'route':
        columns = ['Id', 'N dispositivo', 'Valida', 'Fecha y hora', 'Latitud', 'Longitud', 'Altitud', 'Velocidad'];
        route.map((e) => {
          data = [...data, e.id, e.deviceId, e.valid, e.serverTime, e.latitude, e.longitude, e.altitude, e.speed];
        });
        break;
      case 'events':
        columns = ['Id', 'Fecha y hora', 'Nombre de dispositivo', 'Tipo', 'Geocerca', 'Mantenimiento'];
        events.map((e) => {
          data = [...data, e.id, e.serverTime, e.deviceId, e.type, e.geofenceId, e.maintenanceId];
        });
        break;
      case 'trips':
        columns = ['Id', 'Nombre de dispositivo', 'Hora de Inicio', 'Hora de Fin', 'Odómetro inicial', 'Dirección de inicio', 'Odómetro final', 'Dirección final', 'Distancia', 'Velocidad promedio', 'Velocidad máxima', 'Duración', 'Combustible utilizado', 'Conductor'];
        trips.map((e) => {
          data = [...data, e.id, e.deviceName, e.startTime, e.endTime, e.startOdometer, e.startAddress, e.endOdometer, e.endAddress, e.distance, e.averageSpeed, e.maxSpeed, e.duration, e.spentFuel, e.driverName ? e.driverName : 'null'];
        });
        break;
      case 'stops':
        columns = ['Id', 'Nombre de dispositivo ', 'Hora de inicio', 'Hora de fin', 'Odómetro', 'Dirección', 'Duración', 'Horas motor', 'Combustible utilizado'];
        stops.map((e) => {
          data = [...data, e.id, e.deviceName, e.startTime, e.endTime, e.startOdometer, e.Address, e.duration, e.engineHours, e.spentFuel];
        });
        break;
      case 'summary':
        columns = ['Id', 'Nombre de dispositivo', 'Distancia', 'Odómetro inicial', 'Odómetro final', 'Velocidad promedio', 'Velocidad máxima', 'Horas motor', 'Combustible utilizado'];
        summary.map((e) => {
          data = [...data, e.id, e.deviceName, e.startTime, e.endTime, e.startOdometer, e.Address, e.duration, e.engineHours, e.spentFuel];
        });
        break;
      default:
        break;
    }
    downloadCsv(columns, data, reportConfiguration.report);
  }

  return (
    <div>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {t('reportTitle')}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/*Modal Configuration*/}
        <div className={classes.positionButton}>
          <Button  variant="outlined" color="primary" onClick={handleOpenConfigModal}>
            {t('reportConfigure')}
          </Button>
          <Button  variant="outlined" color="primary" disabled={reportConfiguration.report === 'graphic' || !reportConfiguration.report} onClick={handleDownloadExcel}>
            Descargar csv
          </Button>
          <Dialog
            open={openConfigModal}
            onClose={handleCloseConfigModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Toolbar>
            <DialogTitle style={{width: '100%', textAlign: 'center', backgroundColor: 'ghostwhite'}}
                         id="alert-dialog-title">{"Reportes"}
            </DialogTitle>
            <IconButton className="close-config-modal"
                        style={{padding: 0}}
                        edge="start" color="inherit"
                        onClick={handleCloseConfigModal}
                        aria-label="close">
              <CloseIcon />
            </IconButton>
            </Toolbar>
            <Divider/>
            <DialogContent>
                  <ReportsConfig handleReportsConfig={handleReportsConfig} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResetConfig} color="primary">
                {t('sharedCancel')}
              </Button>
              <Button onClick={handleShowConfig} color="primary" autoFocus>
                {t('reportShow')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*Table for ROUTE Reports*/}
        <div onScroll={handleScroll} style={{display: `${route.length === 0 ? 'none' : 'block'}`}} className={`scrollbar ${classes.tableReports}`}>
          <TableContainer component={Paper}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Index</TableCell> {/*Eliminar*/}
                <TableCell>{t('reportDeviceName')}</TableCell>
                <TableCell>{t('positionValid')}</TableCell>
                <TableCell>{t('positionFixTime')}</TableCell>
                <TableCell>{t('positionLatitude')}</TableCell>
                <TableCell>{t('positionLongitude')}</TableCell>
                <TableCell>{t('positionAltitude')}</TableCell>
                <TableCell>{t('positionSpeed')}</TableCell>
                <TableCell>{t('positionAddress')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {route.slice(sliceFirstIndex < route.length - 30 ? sliceFirstIndex : (route.length - 30) * (route.length > 30), sliceLastIndex < route.length ? sliceLastIndex : route.length).map((object) => (
                <TableRow key={object.id} className={classes.row} onClick={() => handleSelectedPosition(object)}>
                  <TableCell>{object.id}</TableCell>
                  <TableCell>{object.deviceId}</TableCell>
                  <TableCell>{`${Boolean(object.valid)}`}</TableCell>
                  <TableCell>{object.serverTime}</TableCell>
                  <TableCell>{object.latitude}</TableCell>
                  <TableCell>{object.longitude}</TableCell>
                  <TableCell>{object.altitude}</TableCell>
                  <TableCell>{object.speed}</TableCell>
                  <TableCell href="">Mostrar Dirección</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </div>

        {/*Table for EVENTS Reports*/}
        <div onScroll={handleScroll} style={{display: `${events.length === 0 ? 'none' : 'block'}`}} className={`scrollbar ${classes.tableReports}`}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>{t('positionFixTime')}</TableCell>
                  <TableCell>{t('reportDeviceName')}</TableCell>
                  <TableCell>{t('sharedType')}</TableCell>
                  <TableCell>{t('sharedGeofence')}</TableCell>
                  <TableCell>{t('sharedMaintenance')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.slice(sliceFirstIndex < events.length - 30 ? sliceFirstIndex : (events.length - 30) * (events.length > 30), sliceLastIndex < events.length ? sliceLastIndex : events.length).map((object) => (
                  <TableRow key={object.id} className={classes.row} onClick={() => handleSelectedPosition(positions.find((element) => element.id === object.positionId))}>
                    <TableCell>{object.serverTime}</TableCell>
                    <TableCell>{object.deviceId}</TableCell>
                    <TableCell>{object.type}</TableCell>
                    <TableCell>{object.geofenceId}</TableCell>
                    <TableCell>{object.maintenanceId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*Table for TRIPS Reports*/}
        <div onScroll={handleScroll} style={{display: `${trips.length === 0 ? 'none' : 'block'}`}} className={`scrollbar ${classes.tableReports}`}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>{t('reportDeviceName')}</TableCell>
                  <TableCell>{t('reportStartTime')}</TableCell>
                  <TableCell>{t('reportEndTime')}</TableCell>
                  <TableCell>{t('reportStartOdometer')}</TableCell>
                  <TableCell>{t('reportStartAddress')}</TableCell>
                  <TableCell>{t('reportEndOdometer')}</TableCell>
                  <TableCell>{t('reportEndAddress')}</TableCell>
                  <TableCell>{t('sharedDistance')}</TableCell>
                  <TableCell>{t('reportAverageSpeed')}</TableCell>
                  <TableCell>{t('reportMaximumSpeed')}</TableCell>
                  <TableCell>{t('reportDuration')}</TableCell>
                  <TableCell>{t('reportSpentFuel')}</TableCell>
                  <TableCell>{t('sharedDriver')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.slice(sliceFirstIndex < trips.length - 30 ? sliceFirstIndex : (trips.length - 30) * (trips.length > 30), sliceLastIndex < trips.length ? sliceLastIndex : trips.length).map((object) => (
                  <TableRow key={object.id} style={{padding: '3px', fontSize: '13px'}}>
                    <TableCell>{object.deviceName}</TableCell>
                    <TableCell>{object.startTime}</TableCell>
                    <TableCell>{object.endTime}</TableCell>
                    <TableCell>{object.startOdometer}</TableCell>
                    <TableCell>{object.startAddress}</TableCell>
                    <TableCell>{object.endOdometer}</TableCell>
                    <TableCell>{object.endAddress}</TableCell>
                    <TableCell>{object.distance} Km</TableCell>
                    <TableCell>{object.averageSpeed}km/h</TableCell>
                    <TableCell>{object.maxSpeed}km/h</TableCell>
                    <TableCell>{object.duration}</TableCell>
                    <TableCell>{object.spentFuel}lts</TableCell>
                    <TableCell>{object.driverName ? object.driverName : 'null'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*Table for STOPS Reports*/}
        <div onScroll={handleScroll} style={{display: `${stops.length === 0 ? 'none' : 'block'}`}} className={`scrollbar ${classes.tableReports}`}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>{t('reportDeviceName')}</TableCell>
                  <TableCell>{t('reportStartTime')}</TableCell>
                  <TableCell>{t('reportEndTime')}</TableCell>
                  <TableCell>{t('positionOdometer')}</TableCell>
                  <TableCell>{t('positionAddress')}</TableCell>
                  <TableCell>{t('reportDuration')}</TableCell>
                  <TableCell>{t('reportEngineHours')}</TableCell>
                  <TableCell>{t('reportSpentFuel')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stops.slice(sliceFirstIndex < stops.length - 30 ? sliceFirstIndex : (stops.length - 30) * (stops.length > 30), sliceLastIndex < stops.length ? sliceLastIndex : stops.length).map((object) => (
                  <TableRow key={object.id} className={classes.row} onClick={() => handleSelectedPosition(positions.find((element) => element.id === object.positionId))}>
                    <TableCell>{object.deviceName}</TableCell>
                    <TableCell>{object.startTime}</TableCell>
                    <TableCell>{object.endTime}</TableCell>
                    <TableCell>{object.startOdometer}</TableCell>
                    <TableCell>{object.Address}</TableCell>
                    <TableCell>{object.duration}</TableCell>
                    <TableCell>{object.engineHours}</TableCell>
                    <TableCell>{object.spentFuel}lts</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*Table for SUMMARY Reports*/}
        <div onScroll={handleScroll} style={{display: `${summary.length === 0 ? 'none' : 'block'}`}} className={`scrollbar ${classes.tableReports}`}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>{t('reportDeviceName')}</TableCell>
                  <TableCell>{t('sharedDistance')}</TableCell>
                  <TableCell>{t('reportStartOdometer')}</TableCell>
                  <TableCell>{t('reportEndOdometer')}</TableCell>
                  <TableCell>{t('reportAverageSpeed')}</TableCell>
                  <TableCell>{t('reportMaximumSpeed')}</TableCell>
                  <TableCell>{t('reportEngineHours')}</TableCell>
                  <TableCell>{t('reportSpentFuel')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.slice(sliceFirstIndex < summary.length - 30 ? sliceFirstIndex : (summary.length - 30) * (summary.length > 30), sliceLastIndex < summary.length ? sliceLastIndex : summary.length).map((object) => (
                  <TableRow key={object.id} style={{padding: '3px', fontSize: '13px'}}>
                    <TableCell>{object.deviceName}</TableCell>
                    <TableCell>{object.distance} Km</TableCell>
                    <TableCell>{object.startOdometer}</TableCell>
                    <TableCell>{object.endOdometer}</TableCell>
                    <TableCell>{object.averageSpeed}</TableCell>
                    <TableCell>{object.maxSpeed}</TableCell>
                    <TableCell>{object.engineHours}</TableCell>
                    <TableCell>{object.spentFuel}lts</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className={classes.graphic} style={{width: '70%', display: reportConfiguration.report !== 'graphic' ? 'none' : 'block'}}>
          <Line data={chartData} options={{
            responsive: true,
            fill: false,
            title: {text: 'GRAFICO', display: true},
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true,
                  },
                }
              ]
            }}}/>
        </div>


        <div className={`${classes.overflowHidden} ${fullscreen ? classes.fullscreen : classes.miniature} ${hidden ? classes.hidden : classes.visible}`}>
          <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'} fa-lg ${classes.fullscreenToggler}`} onClick={() => handleFullscreen()}></i>
          <i className={`fas ${hidden ? 'fa-chevron-up' : 'fa-chevron-down'} fa-lg ${classes.miniatureToggler}`} onClick={() => handleVisibility()}></i>
          <ReportsMap geozones={geozones} route={route} events={positions} trips={tripsRoutes} showMarkers={reportConfiguration.showMarkers} selectedPosition={selectedPosition}/>
        </div>
      </Dialog>
    </div>
  );
}
