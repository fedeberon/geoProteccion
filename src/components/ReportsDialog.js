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
import SwipeableViews from 'react-swipeable-views';
import {useTheme} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import ReportsConfig from "./ReportsConfig";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';;
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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

export default function ReportsDialog({showReports, showReportsDialog}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [ fullscreen, setFullscreen ] = useState(false);
  const [ hidden, setHidden ] = useState(false);
  const theme = useTheme();
  const [openConfigModal, setOpenConfigModal] = useState(false);


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

  return (
    <div>
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
            <DialogTitle style={{textAlign: 'center', backgroundColor: 'ghostwhite'}}
                         id="alert-dialog-title">{"Reportes"}</DialogTitle>
            <Divider/>
            <DialogContent>
                  <ReportsConfig />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfigModal} color="primary">
                Reset
              </Button>
              <Button onClick={handleCloseConfigModal} color="primary" autoFocus>
                Show
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div className={classes.tableReports}>
          <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre de dispositivo</TableCell>
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
              <TableRow style={{padding: '3px',
                fontSize: '13px'}}>
                <TableCell>RAM</TableCell>
                <TableCell>Si</TableCell>
                <TableCell>2020-11-09 00:00:05</TableCell>
                <TableCell>-32.458484</TableCell>
                <TableCell>-71.215893</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0 Km/h</TableCell>
                <TableCell>Mostrar Dirección</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </TableContainer>
        </div>

        <div className={`${classes.overflowHidden} ${fullscreen ? classes.fullscreen : classes.miniature} ${hidden ? classes.hidden : classes.visible}`}>
          <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'} fa-lg ${classes.fullscreenToggler}`} onClick={() => handleFullscreen()}></i>
          <i className={`fas ${hidden ? 'fa-chevron-up' : 'fa-chevron-down'} fa-lg ${classes.miniatureToggler}`} onClick={() => handleVisibility()}></i>
          <ReportsMap />
        </div>
      </Dialog>
    </div>
  );
}
