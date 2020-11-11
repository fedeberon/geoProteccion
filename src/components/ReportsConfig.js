import React, {useEffect, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import * as service from "../utils/serviceManager";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  formControlDevices: {
    margin: theme.spacing(1),
    minWidth: 200,
    maxWidth: 300,
  },
  formControlReportType: {
    margin: '4px',
    minWidth: 200,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  containerDateTime: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textFieldDateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ReportsConfig({ handleReportsConfig }) {

  const userId = useSelector((state) => state.session.user.id)
  const classes = useStyles();
  const [ devices, setDevices ] = useState([])
  const [ deviceSelected, setDeviceSelected ] = useState([]);
  const [ typeEventSelected, setTypeEventSelected ] = useState([]);
  const [ fromDateTime, setFromDateTime ] = useState('');
  const [ toDateTime, setToDateTime ] = useState('');
  const [ availableTypes, setAvailableTypes ] = useState([]);
  const [ reportType, setReportType ] = useState('');
  const [ showMarkers, setShowMarkers ] = useState(false);

  useEffect(() => {
    handleShowReport()
  },[reportType, deviceSelected, typeEventSelected,
          fromDateTime, toDateTime, showMarkers]);

  const handleShowReport = () => {
    const configuration = {};
      configuration.arrayDevices = devices;
      configuration.arrayDeviceSelected = deviceSelected;
      configuration.arrayTypeEventSelected = typeEventSelected;
      configuration.fromDate = fromDateTime;
      configuration.toDate = toDateTime;
      configuration.report = reportType;
      configuration.showMarkers = showMarkers;

      handleReportsConfig(configuration);
  }

  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value);
  }

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value);
  }

  const handleChangeDevices = (event) => {
    setDeviceSelected(event.target.value);
  };

  const handleChangeTypeEvent = (event) => {
    setTypeEventSelected(event.target.value);
  };

  const handleChangeReportType = (event) => {
    setReportType(event.target.value);
  }

  const handleChangeRadio = () => {
    setShowMarkers(!showMarkers);
  };

  useEffect(() => {
    const getDevices = async (userId) => {
      const response = await service.getDeviceByUserId(userId);
      setDevices(response);
    }
    getDevices(userId);
    getAvailableTypes();
  }, [userId]);

  const getAvailableTypes = async () => {
    const response = await service.getAvailableTypes();
    setAvailableTypes(response);
  }

  return (
    <div>
      <Table>
        <TableRow>
          <TableCell>
            Tipo de reporte:
          </TableCell>
          <TableCell>
            <FormControl required className={classes.formControlReportType}>
              <InputLabel htmlFor="age-native-required">Reporte</InputLabel>
              <Select
                native
                value={reportType}
                onChange={handleChangeReportType}
                name="Reports"
                inputProps={{
                  id: 'age-native-required',
                }}
              >
                <option value=''/>
                <option value='route'>Ruta</option>
                <option value='events'>Eventos</option>
                <option value='trips'>Viajes</option>
                <option value='stops'>Paradas</option>
                <option value='summary'>Resumen</option>
                <option value='graphic'>Gráfico</option>
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Seleccionar dispositivo(s):</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>
              <InputLabel id="demo-mutiple-checkbox-label">Dispositivos</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={deviceSelected}
                onChange={handleChangeDevices}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    <Checkbox checked={deviceSelected.indexOf(device.id) > -1} />
                    <ListItemText primary={device.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl><br/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Seleccionar grupo:</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices} disabled>
              <InputLabel htmlFor="age-native-disabled">Grupo</InputLabel>
              <Select
                native
                value=""
              >
                <option aria-label="None" value="" />
                <option value={10}>1</option>
                <option value={20}>2</option>
                <option value={30}>3</option>
              </Select>
            </FormControl><br/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Seleccionar evento(s):
          </TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>
              <InputLabel id="demo-mutiple-checkbox-label">Notificaciones</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={typeEventSelected}
                onChange={handleChangeTypeEvent}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                <MenuItem value='allEvents'>Todos los eventos</MenuItem>
                {availableTypes.map((type) => (
                  <MenuItem key={type.type} value={type.type}>
                    <Checkbox checked={typeEventSelected.indexOf(type.type) > -1} />
                    <ListItemText primary={type.type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl><br/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Desde:
          </TableCell>
          <TableCell>
            <form className={classes.containerDateTime} noValidate>
              <TextField
                label=' '
                value={fromDateTime}
                onChange={onChangeFromDateTime}
                type="datetime-local"
                defaultValue="2020-11-09T00:30"
                className={classes.textFieldDateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form><br/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Hasta:</TableCell>
          <TableCell>
            <form className={classes.containerDateTime} noValidate>
              <TextField
                label=' '
                value={toDateTime}
                onChange={onChangeToDateTime}
                type="datetime-local"
                defaultValue="2020-11-09T00:30"
                className={classes.textFieldDateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form><br/>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Mostrar marcadores:
          </TableCell>
          <TableCell>
            <Radio
              checked={showMarkers === true}
              onClick={handleChangeRadio}
              color="primary"
              value={true}
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'A' }}
            /> Si
            <Radio
              checked={showMarkers === false}
              onChange={handleChangeRadio}
              color="primary"
              value={false}
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'B' }}
            /> No
          </TableCell>
        </TableRow>
      </Table>
    </div>
  )
}


