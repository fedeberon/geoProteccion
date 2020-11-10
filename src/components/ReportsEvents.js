import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import * as service from "../utils/serviceManager";
import {useSelector} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getAvailableTypes} from "../utils/serviceManager";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import {Toolbar} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const useStyles = makeStyles((theme) => ({
  formControlDevices: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
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

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiAccordionDetails);

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

export default function CustomizedAccordions() {
  const classes = useStyles();
  const userId = useSelector((state) => state.session.user.id)
  const [ expanded, setExpanded ] = React.useState('panel1');
  const [ devices, setDevices] = useState([])
  const [ deviceNameSelected, setDeviceNameSelected ] = React.useState([]);
  const [ typeNameSelected, setTypeNameSelected] = useState([]);
  const [ availableTypes, setAvailableTypes ] = useState([]);
  const [ fromDateTime, setFromDateTime] = useState('');
  const [ toDateTime, setToDateTime] = useState('');

  const onChangeFromDateTime = (event) => {
    setFromDateTime(event.target.value)
  }

  const onChangeToDateTime = (event) => {
    setToDateTime(event.target.value)
  }

  const handleChangeDevices = (event) => {
    setDeviceNameSelected(event.target.value);
  };

  const handleChangeType = (event) => {
    setTypeNameSelected(event.target.value);
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

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const getReportEvents = async () => {
    await fetch(
      `api/reports/events?deviceId=${[deviceNameSelected]}&type=${[typeNameSelected]}&from=${fromDateTime}:00Z&to=${toDateTime}:00Z`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }})
      .then(response => console.log(response))
  }

  return (
    <div>
      {/*<Button onClick={() => getSomething()}>GET</Button>*/}
      <div>
        <AppBar position="static">
          <Toolbar variant="dense" style={{backgroundColor: 'white'}}>
            <FormControl className={classes.formControlDevices}>
              <InputLabel id="demo-mutiple-checkbox-label">Dispositivos</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={deviceNameSelected}
                onChange={handleChangeDevices}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    <Checkbox checked={deviceNameSelected.indexOf(device.id) > -1} />
                    <ListItemText primary={device.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControlDevices}>
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
            </FormControl>
            <FormControl className={classes.formControlDevices}>
              <InputLabel id="demo-mutiple-checkbox-label">Notificaciones</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={typeNameSelected}
                onChange={handleChangeType}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                  <MenuItem value='%'>Todos los eventos</MenuItem>
                {availableTypes.map((type) => (
                  <MenuItem key={type.type} value={type.type}>
                    <Checkbox checked={typeNameSelected.indexOf(type.type) > -1} />
                    <ListItemText primary={type.type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <form className={classes.containerDateTime} noValidate>
              <TextField
                label="Desde"
                value={fromDateTime}
                onChange={onChangeFromDateTime}
                type="datetime-local"
                defaultValue="2020-11-09T00:30"
                className={classes.textFieldDateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <form className={classes.containerDateTime} noValidate>
              <TextField
                label="Hasta"
                value={toDateTime}
                onChange={onChangeToDateTime}
                type="datetime-local"
                defaultValue="2020-11-09T00:30"
                className={classes.textFieldDateTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <Button variant="default" onClick={() => getReportEvents()}
                    style={{display: 'flex', border: '1px solid', marginLeft: '8%', width: '100%'}}>
              GET
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div style={{marginTop: '1%'}}>
      {devices.map((device, index) => (
      <Accordion square expanded={expanded === `panel${index+1}`} onChange={handleChange(`panel${index+1}`)}>
        <AccordionSummary aria-controls={`panel${index+1}d-content`} id={`panel${index+1}d-header`}>
          <Typography><strong>#{device.id} - {device.name}</strong></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha y Hora</TableCell>
                  <TableCell>Tipo de Notificación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>2</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Container>
        </AccordionDetails>
      </Accordion>
      ))}
      </div>
    </div>
  );
}
