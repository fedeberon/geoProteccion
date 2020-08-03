import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { palette } from '@material-ui/system';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RoomIcon from '@material-ui/icons/Room';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SpeedIcon from '@material-ui/icons/Speed';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import NavigationOutlinedIcon from '@material-ui/icons/NavigationOutlined';
import {makeStyles} from '@material-ui/core';

import t from '../common/localization';


const useStyles = makeStyles(theme => ({
  popupBackground: {
    background: 'black',
  },
  textColor:{
    color:'white',
  },
  subTextColor:{
    color:'gray',
  },
  display:{
    display: 'inline-table',
  },
  align:{
    textAlign:'left',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  textSize: {
    fontSize: '50px',
    //MuiTypography : 'disable',
  }
}));

const PopupInfo = (props) => {
  //esto es texto que figura arriba del popup
  const [ idAuto, setidAuto ] = useState('LFPX13');
  
  //esto es texto del tipo de auto
  const [ type, setType ] = useState('Berlingo');
  
  //esto es año del modelo de auto
  const [ model, setModel ] = useState('2019');

  //esto es marca del auto
  const [ brand, setBrand ] = useState('Citroen');

  //esto es marca de empresa
  const [ company, setCompany ] = useState('Cable Nielsen');

  //esto es esto estado
  const [ status, setStatus ] = useState('Conectado');

  //esto es tiempo de conectado
  const [ time, setTime ] = useState('50');

  //esto es la unidad de medida del tiempo transcurrido
  const [ timeUnit, setTimeUnit ] = useState('minutos');
 


  const classes = useStyles();


  return (
    <div>
      <Dialog open={props.open} onClose={props.handleDialog}>
        <List componemt="nav" className={`${classes.popupBackground} ${classes.overflowHidden}`} >
        <ListSubheader component="div" id="nested-list-subheader">
            <Typography align='center' className={classes.textColor}>
              <p><b>{idAuto}</b> ({idAuto} - {type})</p>
              <p className={classes.subTextColor}>{brand} {type} {model}</p>
              <p className={classes.subTextColor}>{company}</p>
              <p className={classes.subTextColor}>{status} .hace {time} {timeUnit}</p>
            </Typography>   
        </ListSubheader>
          <ListItem>
            <ListItemIcon>
              <RoomIcon color="primary"/>
            </ListItemIcon>
            <ListItem className={`${classes.display}`}>
              <ListItemText primary={t('currentAddress').toUpperCase()} className={`${classes.textColor} ${classes.textSize}`}/>
              <ListItemText primary="variable" className={classes.textColor}/>
            </ListItem>
          </ListItem>  
          <ListItem>
            <ListItemIcon>
              <TrendingUpIcon color="primary"/>
            </ListItemIcon>
            <ListItem className={classes.display}> 
              <ListItemText primary={t('currentStatus').toUpperCase()} className={classes.textColor}/>
              <ListItemText primary="variable" className={classes.textColor}/>
            </ListItem>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SpeedIcon color="primary"/>
            </ListItemIcon>
              <ListItem className={classes.display}>
                <ListItemText primary={t('positionSpeed').toUpperCase()} className={classes.textColor}/>
                <ListItemText primary="variable" className={classes.textColor}/>
              </ListItem>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <OfflineBoltOutlinedIcon color="primary"/>
            </ListItemIcon>
              <ListItem className={classes.display}> 
                <ListItemText primary={t('circuitBreaker').toUpperCase()} className={classes.textColor}/>
                <ListItemText primary="variable" className={classes.textColor}/>
              </ListItem>
          </ListItem>
          <ListItem>  
            <ListItemIcon>
              <NavigationOutlinedIcon color="primary"/>
            </ListItemIcon>
            <ListItem className={classes.display}>
              <ListItemText primary={t('mileage').toUpperCase()} className={classes.textColor}/>
              <ListItemText primary="variable" className={classes.textColor}/>
            </ListItem>
          </ListItem>
          <ListItem>  
            <Button variant="contained" color="primary" fullWidth >{t('activateCircuitBreaker').toUpperCase()}</Button>
          </ListItem>
          <ListItem>
            <Button fullWidth className={classes.textColor}>
            {t('reportTitle').toUpperCase()}
            </Button>
          </ListItem>  
        </List>  
      </Dialog>
      
    </div>
  );
}

export default PopupInfo;