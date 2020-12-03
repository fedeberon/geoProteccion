import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import t from '../common/localization';
import { useSelector } from 'react-redux';
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Checkbox from '@material-ui/core/Checkbox';
import ButtonGroup from "@material-ui/core/ButtonGroup";

const styles = theme => ({});

const useStyles = makeStyles(theme => ({

  root: {
    width: '100%',
    height: '100%',
    paddingTop: '5%',
    overflowY: 'auto',
  },
  rootTab: {
    flexGrow: 1,
    backgroundColor: "white",
    color: "black",
  },
  formControlType: {
    minWidth: 120,
  },
  subtitles: {
    backgroundColor: 'lavender',
    padding: '4px',
    color: 'currentColor',
    display: 'flow-root',
  },
  UserPageSize : {
    float: 'right',
    width:'70%',
    marginRight: '10%',
    marginTop: '6%',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'left',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function createData(field, userData) {
  userData = userData !== undefined ? userData.toString() : '';
  return { field, userData };
}

const UserPage = () => {
  const classes = useStyles();
  const user = useSelector(state => state.session.user);
  const [rows, setRows] = useState([]);
  const [value, setValue] = React.useState(0);
  const [showAdministration, setShowAdministration] = useState(false);
  const [capsMap, setCapsMap] = useState([]);
  const [checked, setChecked] = React.useState(true);

  const handleChangeCheckBox = (event) => {
    setChecked(event.target.checked);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const showMenuAdmin = () => {
    setShowAdministration(!showAdministration);
  }

  const handleChangeType = (event) => {
    setCapsMap(event.target.value);
  };

  useEffect(() => {
    let name = createData(t('sharedName'), user.name);
    let email = createData(t('userEmail'), user.email);
    let phone = createData(t('sharedPhone'), user.phone);
    let map = createData(t('mapTitle'), user.map);
    let latitude = createData(t('positionLatitude'), user.latitude);
    let longitude = createData(t('positionLongitude'), user.longitude);
    let zoom = createData(t('serverZoom'), user.zoom);
    let attributes = createData(t('sharedAttributes'), 'NOT FINISHED');
    let twelveHourFormat = createData(t('settingsTwelveHourFormat'), user.twelveHourFormat);
    let coordinatesFormat = createData(t('settingsCoordinateFormat'), user.coordinateFormat);
    setRows([ name, email, phone, map, latitude, longitude, zoom, attributes, twelveHourFormat, coordinatesFormat ]);
  },[user]);

  return (

    <div className={classes.root}>
      <div className="title-section" style={{justifyContent: 'space-between', display: 'flex'}}>
        <h2>Información de Usuario</h2>
        <Typography>
          <Button onClick={() => showMenuAdmin()} button style={{textTransform: 'capitalize'}}>
            Administrador
          </Button>
        </Typography>
      </div>
      <div className={classes.rootTab} style={{display: `${showAdministration ? 'block' : 'none'}`}}>

          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
            <Tab label="Servidor" {...a11yProps(0)} />
            <Tab label="Estadísticas" {...a11yProps(1)} />
            <Tab label="Atributos Calculados" {...a11yProps(2)} />
            <Tab label="Comandos Guardados" {...a11yProps(3)} />
          </Tabs>

        <TabPanel value={value} index={0} style={{paddingBottom: '10%'}}>
          <div className={classes.subtitles}>
            <h2>Preferencias</h2>
          </div>
          <div className={classes.buttonGroup}>
            <ButtonGroup variant="text" color="default" aria-label="text primary button group">
              <Button>Atributos</Button>
              <Button><i className="fas fa-map-marker-alt"/>&nbsp;Obtener estado del mapa</Button>
            </ButtonGroup>
          </div>
          <form>
          <Table style={{display: 'table-cell'}}>
            <TableBody>
              <TableRow>
                <TableCell>Capa de Mapa:</TableCell>
                <TableCell>
                  <FormControl variant="outlined" className={classes.formControlType}>
                    <Select style={{width: '229px'}}
                      native
                      value="custom"
                      onChange={handleChangeType}
                    >
                      <option aria-label="None" value="" />
                      {/*{typesValues.map((types, index) => (*/}
                        <option key={1} value="custom">CUSTOM(X,Y,Z)</option>
                        <option key={2} value="custom">BING MAPS</option>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bing Maps Key:</TableCell>
                <TableCell>
                  <TextField fullWidth id="outlined-basic" label="Outlined" variant="outlined" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mapa Personalizado:</TableCell>
                <TableCell>
                  <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Latitud:</TableCell>
                <TableCell>
                  <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Longitud:</TableCell>
                <TableCell>
                  <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Zoom:</TableCell>
                <TableCell>
                  <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Formato 12 Horas:</TableCell>
                <TableCell>
                  <Checkbox
                    defaultChecked
                    checked={checked}
                    onChange={handleChangeCheckBox}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Forzar Valores:</TableCell>
                <TableCell>
                  <Checkbox
                    defaultChecked
                    checked={checked}
                    onChange={handleChangeCheckBox}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Formato de coordenadas:</TableCell>
                <TableCell>
                  <FormControl style={{width: '229px'}} variant="outlined" className={classes.formControlType}>
                    <Select
                      native
                      value="custom"
                      onChange={handleChangeType}
                    >
                      <option aria-label="None" value="" />
                      {/*{typesValues.map((types, index) => (*/}
                      <option key={1} value="custom">Grados</option>
                      <option key={2} value="custom">Minutos</option>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
              <TableCell>Capa POI:</TableCell>
              <TableCell>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
              </TableCell>
            </TableRow>
            </TableBody>
          </Table>
        </form>
          <div className={classes.subtitles}>
            <h2>Permisos</h2>
          </div>
          <div>
            <form>
              <TableBody>
                <TableRow>
                  <TableCell>Registro</TableCell>
                  <TableCell>
                    <Checkbox
                      defaultChecked
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sólo lectura:</TableCell>
                  <TableCell>
                    <Checkbox
                      defaultChecked
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dispositivo de sólo lectura:</TableCell>
                  <TableCell>
                    <Checkbox
                      defaultChecked
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Limitar Comandos:</TableCell>
                  <TableCell>
                    <Checkbox
                      defaultChecked
                      checked={checked}
                      onChange={handleChangeCheckBox}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </form>
          </div>

        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Three
        </TabPanel>
      </div>
      <div className={classes.UserPageSize} style={{display: `${showAdministration ? 'none' : 'block'}`}}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.field}>
                  <TableCell component="th" scope="row">
                    {row.field}
                  </TableCell>
                  <TableCell align="left">{row.userData}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default withWidth()(withStyles(styles)(UserPage));
