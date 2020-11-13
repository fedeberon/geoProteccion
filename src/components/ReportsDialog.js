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
import {useTheme} from '@material-ui/core/styles';
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
} from '../utils/serviceManager';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";
import {useSelector} from "react-redux";

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
  const [ stops, setStops ] = useState([]);
  const [ summary, setSummary ] = useState([]);
  const [ positions, setPositions ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ sliceLastIndex, setSliceLastIndex ] = useState(15);
  const [ sliceFirstIndex, setSliceFirstIndex ] = useState(0);

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
    setStops([]);
    setSummary([]);
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
        break;
      default:
        break;
    }
    handleCloseConfigModal();
  }

  const handleSelectedPosition = (position) => {
    setSelectedPosition(position);
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
            Configuracion de reporte
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
            <IconButton style={{padding: 0}}edge="start" color="inherit" onClick={handleCloseConfigModal} aria-label="close">
              <CloseIcon />
            </IconButton>
            </Toolbar>
            <Divider/>
            <DialogContent>
                  <ReportsConfig handleReportsConfig={handleReportsConfig} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResetConfig} color="primary">
                Reset
              </Button>
              <Button onClick={handleShowConfig} color="primary" autoFocus>
                Show
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*Table for ROUTE Reports*/}
        <div onScroll={handleScroll} style={{display: `${route.length === 0 ? 'none' : 'block'}`}} className={classes.tableReports}>
          <TableContainer component={Paper}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>N° Dispos</TableCell>
                <TableCell>Válida</TableCell>
                <TableCell>Fecha y hora</TableCell>
                <TableCell>Latitud</TableCell>
                <TableCell>Longitud</TableCell>
                <TableCell>Altitud</TableCell>
                <TableCell>Velocidad</TableCell>
                <TableCell>Dirección</TableCell>
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
        <div onScroll={handleScroll} style={{display: `${events.length === 0 ? 'none' : 'block'}`}} className={classes.tableReports}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>Fecha y hora</TableCell>
                  <TableCell>Nombre de dispositivo</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Geocerca</TableCell>
                  <TableCell>Mantenimiento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.slice(sliceFirstIndex < events.length - 30 ? sliceFirstIndex : (events.length - 30) * (events.length > 30), sliceLastIndex < events.length ? sliceLastIndex : events.length).map((object) => (
                  <TableRow key={object.id} style={{padding: '3px', fontSize: '13px'}}>
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
        <div onScroll={handleScroll} style={{display: `${trips.length === 0 ? 'none' : 'block'}`}} className={classes.tableReports}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>Nombre de dispositivo</TableCell>
                  <TableCell>Hora de Inicio</TableCell>
                  <TableCell>Hora de Fin</TableCell>
                  <TableCell>Odómetro Inicial</TableCell>
                  <TableCell>Dirección de Inicio</TableCell>
                  <TableCell>Odómetro Final</TableCell>
                  <TableCell>Dirección Final</TableCell>
                  <TableCell>Distancia</TableCell>
                  <TableCell>Velocidad Promedio</TableCell>
                  <TableCell>Velocidad Máxima</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Combustible Utilizado</TableCell>
                  <TableCell>Conductor</TableCell>
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
        <div onScroll={handleScroll} style={{display: `${stops.length === 0 ? 'none' : 'block'}`}} className={classes.tableReports}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>Nombre de dispositivo</TableCell>
                  <TableCell>Hora de Inicio</TableCell>
                  <TableCell>Hora de Fin</TableCell>
                  <TableCell>Odómetro</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Duracion</TableCell>
                  <TableCell>Horas Motor</TableCell>
                  <TableCell>Combustible Utilizado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stops.slice(sliceFirstIndex < stops.length - 30 ? sliceFirstIndex : (stops.length - 30) * (stops.length > 30), sliceLastIndex < stops.length ? sliceLastIndex : stops.length).map((object) => (
                  <TableRow key={object.id} style={{padding: '3px', fontSize: '13px'}}>
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
        <div onScroll={handleScroll} style={{display: `${summary.length === 0 ? 'none' : 'block'}`}} className={classes.tableReports}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>Nombre de dispositivo</TableCell>
                  <TableCell>Distancia</TableCell>
                  <TableCell>Odómetro Inicial</TableCell>
                  <TableCell>Odódetro Final</TableCell>
                  <TableCell>Velocidad Promedio</TableCell>
                  <TableCell>Velocidad Máxima</TableCell>
                  <TableCell>Horas Motor</TableCell>
                  <TableCell>Combustible Utilizado</TableCell>
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

        <div className={`${classes.overflowHidden} ${fullscreen ? classes.fullscreen : classes.miniature} ${hidden ? classes.hidden : classes.visible}`}>
          <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'} fa-lg ${classes.fullscreenToggler}`} onClick={() => handleFullscreen()}></i>
          <i className={`fas ${hidden ? 'fa-chevron-up' : 'fa-chevron-down'} fa-lg ${classes.miniatureToggler}`} onClick={() => handleVisibility()}></i>
          <ReportsMap geozones={geozones} route={route} events={positions} showMarkers={reportConfiguration.showMarkers} selectedPosition={selectedPosition}/>
        </div>
      </Dialog>
    </div>
  );
}
