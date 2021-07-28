import React, { useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import t from "../common/localization";
import * as service from "../utils/serviceManager";
import { useSelector, shallowEqual } from "react-redux";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import Chip from '@material-ui/core/Chip';
import reportsConfigStyles from "./styles/ReportsConfigStyles";

const useStyles = reportsConfigStyles;

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

export default function ReportsConfig({ handleReportsConfig, reportType }) {
  const userId = useSelector((state) => state.session.user.id);
  const devices = useSelector((state) => Object.values(state.devices.items), shallowEqual);
  const classes = useStyles();
  let dateNow = new Date();
  let week = new Date();
  const [deviceSelected, setDeviceSelected] = useState([]);
  const [listDeviceSelected, setListDeviceSelected] = useState([]);
  const [typeEventSelected, setTypeEventSelected] = useState(['allEvents']);
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupsSelected, setGroupsSelected] = useState([]);
  const [listGroupsSelected, setListGroupsSelected] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);  
  const [graphicType, setGraphicType] = useState("speed");
  const [showMarkers, setShowMarkers] = useState(false);
  const [period, setPeriod] = useState('');

  useEffect(() => {
    handleShowReport();
  }, [
    deviceSelected,
    typeEventSelected,
    fromDateTime,
    toDateTime,
    showMarkers,
    graphicType,
  ]);

  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value);
  };

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value);
  };

  const handleChangeDevices = (event) => {
    let ids = [];
    event.target.value.map(object => {
      devices.map(dev => {        
        if(dev.name === object){
          ids.push(dev.id);          
        }        
      })      
    })    
    setDeviceSelected(ids);
    setListDeviceSelected(event.target.value);
  };

  const handleChangeGroup = (event) => {
    let ids = [];
    event.target.value.map(object => {
      groups.map(group => {        
        if(group.name === object){
          ids.push(group.id);          
        }        
      })      
    })    
    setGroupsSelected(ids);
    setListGroupsSelected(event.target.value);
  };

  const handleShowReport = () => {
    let configuration = {};
    configuration.arrayDevices = devices;
    configuration.arrayDeviceSelected = deviceSelected;
    configuration.arrayGroupSelected = groupsSelected;
    configuration.arrayTypeEventSelected = typeEventSelected;
    configuration.fromDate = fromDateTime;
    configuration.toDate = toDateTime;
    configuration.showMarkers = showMarkers;
    configuration.graphicType = graphicType;

    handleReportsConfig(configuration);
  };

  const handleChangeTypeEvent = (event) => {
    setTypeEventSelected(event.target.value);
  };  

  const handleChangeGraphicType = (event) => {
    setGraphicType(event.target.value);
  };

  const handleChangeRadio = () => {
    setShowMarkers(!showMarkers);
  };

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value)
  }
  
  useEffect(()=> {
    function previous (date, days){
      date.setDate(date.getDate() - days);
      return date;
    }
    function forward (date, days){
      date.setDate(date.getDate() + days);
      return date;
    }
    switch(period) {
      case 'today':
        forward(week, 1);    
        setFromDateTime(`${dateNow.getFullYear()}-${dateNow.getMonth()+1 < 10 ? `0${dateNow.getMonth()+1}` : dateNow.getMonth()+1}-${dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate()}T03:00`)
        setToDateTime(`${week.getFullYear()}-${week.getMonth()+1 < 10 ? `0${week.getMonth()+1}` : week.getMonth()+1}-${week.getDate() < 10 ? `0${week.getDate()}` : week.getDate()}T03:00`)
        break;
      case 'yesterday':
        previous(week, 1);
        setFromDateTime(`${week.getFullYear()}-${week.getMonth()+1 < 10 ? `0${week.getMonth()+1}` : `${week.getMonth()+1}`}-${week.getDate() < 10 ? `0${week.getDate()}` : week.getDate()}T03:00`)
        setToDateTime(`${dateNow.getFullYear()}-${dateNow.getMonth()+1 < 10 ? `0${dateNow.getMonth()+1}` : dateNow.getMonth()+1}-${dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate()}T03:00`)
        break;
      case 'thisWeek':
        week.setDate(dateNow.getDate() - dateNow.getDay() + 1);
        forward(week, 7);
        dateNow.setDate(dateNow.getDate() - dateNow.getDay() + 1);     
        setFromDateTime(`${dateNow.getFullYear()}-${dateNow.getMonth()+1 < 10 ? `0${dateNow.getMonth()+1}` : dateNow.getMonth()+1}-${dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate()}T03:00`)
        setToDateTime(`${week.getFullYear()}-${week.getMonth()+1 < 10 ? `0${week.getMonth()+1}` : week.getMonth()+1}-${week.getDate() < 10 ? `0${week.getDate()}` : week.getDate()}T03:00`)
        break;
      case 'previousWeek':        
        week.setDate(dateNow.getDate() - dateNow.getDay() + 1);
        previous(week, 7);
        dateNow.setDate(dateNow.getDate() - dateNow.getDay() + 1);
        setFromDateTime(`${week.getFullYear()}-${week.getMonth()+1 < 10 ? `0${week.getMonth()+1}` : `${week.getMonth()+1}`}-${week.getDate() < 10 ? `0${week.getDate()}` : week.getDate()}T03:00`)
        setToDateTime(`${dateNow.getFullYear()}-${dateNow.getMonth()+1 < 10 ? `0${dateNow.getMonth()+1}` : dateNow.getMonth()+1}-${dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate()}T03:00`)
        break;
      case 'thisMonth':
        week.setMonth(dateNow.getMonth() + 1)
        setFromDateTime(`${dateNow.getFullYear()}-${dateNow.getMonth()+1 < 10 ? `0${dateNow.getMonth()+1}` : dateNow.getMonth()+1}-01T03:00`)
        setToDateTime(`${week.getFullYear()}-${week.getMonth()+1 < 10 ? `0${week.getMonth()+1}` : week.getMonth()+1}-01T03:00`)
        break;
      case 'previousMonth':
        week.setDate(dateNow.getDate() - 30)
        setFromDateTime(`${week.getFullYear()}-${(week.getMonth()+1) < 10 ? `0${(week.getMonth()+1)}` : (week.getMonth()+1)}-01T03:00`)
        setToDateTime(`${dateNow.getFullYear()}-${dateNow.getMonth()+1 < 10 ? `0${dateNow.getMonth()+1}` : dateNow.getMonth()+1}-01T03:00`)
        break;
      default: 
        break;  
    }
  },[period]);

  useEffect(() => {
    getAvailableTypes();
    getAvailableGroups();
  }, [userId]);

  const getAvailableTypes = async () => {
    const response = await service.getAvailableTypes();
    setAvailableTypes(response);
  };

  const getAvailableGroups = async () => {
    const response = await service.getGroups();
    setGroups(response);
  }

  return (
    <div>
      <Table>
        <TableBody>
        <TableRow>
          <TableCell>{t("sharedSelectDevice")}:</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>              
              <Select
                multiple
                id="select-multiple-chip"
                value={listDeviceSelected}
                onChange={handleChangeDevices}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} className={classes.chip} />
                    ))}
                  </div>
                )}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.name} className={classes.itemsReportsMenu}>
                    {device.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
          </TableCell>
        </TableRow>
        {!(reportType === "graphic") && (
          <TableRow>
          <TableCell>{t("sharedSelectGroup")}:</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>              
                <Select
                  multiple
                  id="select-multiple-groups"
                  value={listGroupsSelected}
                  onChange={handleChangeGroup}
                  input={<Input id="select-multiple-groups" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} className={classes.chip} />
                      ))}
                    </div>
                  )}
                >
                  {groups.map((group) => (
                    <MenuItem key={group.name} value={group.name}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>           
            <br />
          </TableCell>
        </TableRow> 
        )}              

        <TableRow>
          <TableCell>{t("reportPeriod")}:</TableCell>
          <TableCell>
            <FormControl required className={classes.formControlDevices}>              
              <Select
                native
                value={period}
                onChange={handleChangePeriod}
                name="Reports"
                inputProps={{
                  id: "age-native-required",
                }}
              >
                <option value=""/>
                <option value="custom">{t('reportCustom')}</option>
                <option value="today">{t("reportToday")}</option>
                <option value="yesterday">{t("reportYesterday")}</option>
                <option value="thisWeek">{t("reportThisWeek")}</option>
                <option value="previousWeek">{t("reportPreviousWeek")}</option>
                <option value="thisMonth">{t("reportThisMonth")}</option>
                <option value="previousMonth">{t("reportPreviousMonth")}</option>
              </Select> 
            </FormControl>           
            <br />
          </TableCell>
        </TableRow>
        <TableRow>

        </TableRow>
        <TableRow
          style={{ display: `${reportType === "graphic" ? "" : "none"}` }}
        >
          <TableCell>{t("reportChartType")}:</TableCell>
          <TableCell>
            <FormControl required className={classes.formControlDevices}>
              <Select
                native
                value={graphicType}
                onChange={handleChangeGraphicType}
                name="Graphic Type"
              >
                <option value="speed">{t("positionSpeed")}</option>
                <option value="accuracy">{t("positionAccuracy")}</option>
                <option value="altitude">{t("positionAltitude")}</option>
                {/* <option value="index">{t("positionIndex")}</option>
                <option value="hdop">{t("positionHdop")}</option>
                <option value="vdop">{t("positionVdop")}</option>
                <option value="pdop">{t("positionPdop")}</option>
                <option value="sat">{t("positionSat")}</option>
                <option value="satVisible">{t("positionSatVisible")}</option>
                <option value="rssi">{t("positionRssi")}</option>
                <option value="gps">{t("positionGps")}</option>
                <option value="odometer">{t("positionOdometer")}</option>
                <option value="odometerMaintenance">
                  {t("positionServiceOdometer")}
                </option>
                <option value="odometerTrip">
                  {t("positionTripOdometer")}
                </option>
                <option value="hours">{t("positionHours")}</option>
                <option value="steps">{t("positionSteps")}</option>
                <option value="power">{t("positionPower")}</option>
                <option value="batery">{t("positionBattery")}</option>
                <option value="bateryLelel">{t("positionBatteryLevel")}</option>
                <option value="fuel">{t("positionFuel")}</option>
                <option value="fuelConsumtion">
                  {t("positionFuelConsumption")}
                </option>
                <option value="distance">{t("sharedDistance")}</option>
                <option value="totalDistance">
                  {t("deviceTotalDistance")}
                </option>
                <option value="rpm">{t("positionRpm")}</option>
                <option value="throttle">{t("positionThrottle")}</option>
                <option value="armado">{t("positionArmed")}</option>
                <option value="acceleration">
                  {t("positionAcceleration")}
                </option>
                <option value="deviceTemp">{t("positionDeviceTemp")}</option>
                <option value="obdSpeed">{t("positionObdSpeed")}</option>
                <option value="obdOdometer">{t("positionObdOdometer")}</option> */}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          </TableCell>
        </TableRow>

        <TableRow style={{ display: `${reportType === "events" ? "" : "none"}` }}>
          <TableCell>{t("sharedSelectEvent")}:</TableCell>
          <TableCell>
            <FormControl className={classes.formControlDevices}>              
                <Select
                  multiple
                  id="select-multiple-chip3"
                  value={typeEventSelected}
                  onChange={handleChangeTypeEvent}
                  input={<Input id="select-multiple-chip3" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (                        
                        <Chip key={value} 
                        label={value === 'allEvents' ? `${t('eventAll')}` : `${t(`${value}`)}`} 
                        className={classes.chip} />
                      ))}
                    </div>
                  )}
                >
                    <MenuItem value="allEvents">{t('eventAll')}</MenuItem>
                  {availableTypes.map((type) => (
                    <MenuItem key={type.type} value={type.type}>
                      {t(`${type.type}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>           
            <br />
          </TableCell>
        </TableRow> 
        
        <TableRow style={{ display: `${period === 'custom' ? '' : 'none'}` }}>
          <TableCell>{t("reportFrom")}:</TableCell>
          <TableCell>
            <form className={classes.containerDateTime} noValidate>
              <TextField
                label=" "
                value={fromDateTime}
                onChange={onChangeFromDateTime}
                type="datetime-local"
                className={classes.textFieldDateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <br />
          </TableCell>
        </TableRow>
        <TableRow style={{ display: `${period === 'custom' ? '' : 'none'}` }}>
          <TableCell>{t("reportTo")}:</TableCell>
          <TableCell>
            <form className={classes.containerDateTime} noValidate>
              <TextField
                label=" "
                value={toDateTime}
                onChange={onChangeToDateTime}
                type="datetime-local"
                className={classes.textFieldDateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <br />
          </TableCell>
        </TableRow>      
        <TableRow>
          <TableCell>{t("reportShowMarkers")}:</TableCell>
          <TableCell >
            <Radio
              checked={showMarkers === true}
              onClick={handleChangeRadio}
              disabled={reportType === 'graphic'}
              color="primary"
              value={true}
              name="radio-button-demo"
              inputProps={{ "aria-label": "A" }}
            />{" "}
            {t("reportYes")}
            <Radio
              checked={showMarkers === false}
              disabled={reportType === 'graphic'}
              onChange={handleChangeRadio}
              color="primary"
              value={false}
              name="radio-button-demo"
              inputProps={{ "aria-label": "B" }}
            />{" "}
            {t("reportNo")}
          </TableCell>
        </TableRow> 
        </TableBody>         
      </Table>
    </div>
  );
}
