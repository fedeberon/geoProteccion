import React, {useEffect, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import t from "../common/localization";
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
    maxWidth: 200,
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
  const [ reportType, setReportType ] = useState('route');
  const [ graphicType, setGraphicType ] = useState('speed');
  const [ showMarkers, setShowMarkers ] = useState(false);

  useEffect(() => {
    handleShowReport()
  },[reportType, deviceSelected, typeEventSelected,
          fromDateTime, toDateTime, showMarkers, graphicType]);

  const handleShowReport = () => {
    const configuration = {};
      configuration.arrayDevices = devices;
      configuration.arrayDeviceSelected = deviceSelected;
      configuration.arrayTypeEventSelected = typeEventSelected;
      configuration.fromDate = fromDateTime;
      configuration.toDate = toDateTime;
      configuration.report = reportType;
      configuration.showMarkers = showMarkers;
      configuration.graphicType = graphicType;

      handleReportsConfig(configuration);
  };

  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value);
  };

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value);
  };

  const handleChangeDevices = (event) => {
    setDeviceSelected(event.target.value);
  };

  const handleChangeTypeEvent = (event) => {
    setTypeEventSelected(event.target.value);
  };

  const handleChangeReportType = (event) => {
    setReportType(event.target.value);
  };

  const handleChangeGraphicType = (event) => {
    setGraphicType(event.target.value);
  };

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
  };

  return (
    <div>
      <Table>
        <TableRow>
          <TableCell>
            {t('reportType')}:
          </TableCell>
          <TableCell>
            <FormControl required className={classes.formControlReportType}>
              <InputLabel htmlFor="age-native-required">{t('reportTitle')}</InputLabel>
              <Select
                native
                value={reportType}
                onChange={handleChangeReportType}
                name="Reports"
                inputProps={{
                  id: 'age-native-required',
                }}
              >
                <option value='route'>{t('reportRoute')}</option>
                <option value='events'>{t('reportEvents')}</option>
                <option value='trips'>{t('reportTrips')}</option>
                <option value='stops'>{t('reportStops')}</option>
                <option value='summary'>{t('reportSummary')}</option>
                <option value='graphic'>{t('reportChart')}</option>
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t('sharedSelectDevice')}:</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>
              <InputLabel id="demo-mutiple-checkbox-label">{t('deviceTitle')}</InputLabel>
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
          <TableCell>{t('sharedSelectGroup')}:</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices} disabled>
              <InputLabel htmlFor="age-native-disabled">{t('groupDialog')}</InputLabel>
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
        <TableRow style={{display: `${reportType === 'graphic' ? '' : 'none'}`}}>
          <TableCell>
            {t('reportChartType')}:
          </TableCell>
          <TableCell>
            <FormControl required className={classes.formControlDevices}>
              <Select
                native
                value={graphicType}
                onChange={handleChangeGraphicType}
                name="Graphic Type"
              >
                <option value='speed'>{t('positionSpeed')}</option>
                <option value='accuracy'>{t('positionAccuracy')}</option>
                <option value='altitude'>{t('positionAltitude')}</option>
                <option value='index'>{t('positionIndex')}</option>
                <option value='hdop'>{t('positionHdop')}</option>
                <option value='vdop'>{t('positionVdop')}</option>
                <option value='pdop'>{t('positionPdop')}</option>
                <option value='sat'>{t('positionSat')}</option>
                <option value='satVisible'>{t('positionSatVisible')}</option>
                <option value='rssi'>{t('positionRssi')}</option>
                <option value='gps'>{t('positionGp')}</option>
                <option value='odometer'>{t('positionOdometer')}</option>
                <option value='odometerMaintenance'>{t('positionServiceOdometer')}</option>
                <option value='odometerTrip'>{t('positionTripOdometer')}</option>
                <option value='hours'>{t('positionHours')}</option>
                <option value='steps'>{t('positionSteps')}</option>
                <option value='power'>{t('positionPower')}</option>
                <option value='batery'>{t('positionBattery')}</option>
                <option value='bateryLelel'>{t('positionBatteryLevel')}</option>
                <option value='fuel'>{t('positionFuel')}</option>
                <option value='fuelConsumtion'>{t('positionFuelConsumption')}</option>
                <option value='distance'>{t('sharedDistance')}</option>
                <option value='totalDistance'>{t('deviceTotalDistance')}</option>
                <option value='rpm'>{t('positionRpm')}</option>
                <option value='throttle'>{t('positionThrottle')}</option>
                <option value='armado'>{t('positionArmed')}</option>
                <option value='acceleration'>{t('positionAcceleration')}</option>
                <option value='deviceTemperature'>{t('positionDeviceTemp')}</option>
                <option value='obdSpeed'>{t('positionObdSpeed')}</option>
                <option value='obdOdometer'>{t('positionObdOdometer')}</option>
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          </TableCell>
        </TableRow>
        <TableRow style={{display: `${reportType === 'events' ? '' : 'none'}`}}>
          <TableCell>
            {t('sharedSelectEvent')}:
          </TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>
              <InputLabel id="demo-mutiple-checkbox-label">{t('sharedNotifications')}</InputLabel>
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
                <MenuItem value='allEvents'>{t('eventAll')}</MenuItem>
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
            {t('reportFrom')}:
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
          <TableCell>{t('reportTo')}:</TableCell>
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
            {t('reportShowMarkers')}:
          </TableCell>
          <TableCell>
            <Radio
              checked={showMarkers === true}
              onClick={handleChangeRadio}
              color="primary"
              value={true}
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'A' }}
            /> {t('reportYes')}
            <Radio
              checked={showMarkers === false}
              onChange={handleChangeRadio}
              color="primary"
              value={false}
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'B' }}
            /> {t('reportNo')}
          </TableCell>
        </TableRow>
      </Table>
    </div>
  )
}


