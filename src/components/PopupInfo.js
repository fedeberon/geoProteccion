import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {devicesActions} from '../store'

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";

import RoomIcon from '@material-ui/icons/Room';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SpeedIcon from '@material-ui/icons/Speed';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import NavigationIcon from '@material-ui/icons/Navigation';

import t from '../common/localization';

const PopupInfo = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      color: '#ffffff !important',
      backgroundColor: '#1B1B1B',
      overflow: 'hidden',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    title:{
      textAlign: 'left',
      fontSize: '30 px',
      textTransform: 'uppercase',
    },
    subtitle:{
      textAlign: 'left',
      fontSize: '20 px',
    },
    topStyle: {
      position: 'relative',
      marginLeft: '30%',
    },
    style: {
      position: 'relative',
      marginLeft: '15%',
      textAlign: 'center',
    },
    iconColor: {
      color: '#3f51b5',
    },
  }));

  const dispatch = useDispatch();
  const {device, setDevice} = useState(null);
  useEffect(() => {
    const x = dispatch(devicesActions.get());
      this.setDevice(x);
  }, []);

  const WhiteTextListItemText = withStyles({
    root: {
      color: "#FFFFFF"
    }
  })(ListItemText);

  const classes = useStyles();
  const devices = useSelector(state => (state.positions.deviceSelected));
  return (
    <Dialog open={props.open} onClose={props.handleDialog}> 
      <div className={classes.root}>
        <List component="nav">
          <div className={classes.topStyle}>
            <Typography color="#fff" className={classes.title}>
              name
            </Typography>
            <Typography className={classes.subtitle}>
              model
            </Typography>
            <Typography className={classes.subtitle}>
              type
            </Typography>
            <Typography className={classes.subtitle}>
              status
            </Typography>
          </div>

          <ListItem>
            <ListItemIcon className={classes.iconColor}>
              <RoomIcon />
            </ListItemIcon>
            <ListItemText primary={t('currentAddress')} secondary={<Typography style={{ color: '#FFFFFF', fontSize: 12 }}>MyTitle</Typography>} />
          </ListItem>

          <ListItem>
            <ListItemIcon className={classes.iconColor}>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary={t('currentStatus')} secondary={<Typography style={{ color: '#FFFFFF', fontSize: 12 }}>MyTitle</Typography>} />
          </ListItem>

          <ListItem>
            <ListItemIcon className={classes.iconColor}>
              <SpeedIcon />
            </ListItemIcon>
            <ListItemText primary={t('positionSpeed')} secondary={<Typography style={{ color: '#FFFFFF', fontSize: 12 }}>MyTitle</Typography>} />
          </ListItem>

          <ListItem>
            <ListItemIcon className={classes.iconColor}>
              <OfflineBoltIcon />
            </ListItemIcon>
            <ListItemText primary={t('circuitBreaker')} secondary={<Typography style={{ color: '#FFFFFF', fontSize: 12 }}>MyTitle</Typography>} />
          </ListItem>

          <ListItem>
            <ListItemIcon className={classes.iconColor}>
              <NavigationIcon />
            </ListItemIcon>
            <ListItemText primary={t('mileage')} secondary={<Typography style={{ color: '#FFFFFF', fontSize: 12 }}>MyTitle</Typography>} />
          </ListItem>
        </List>

        <Button variant="contained" className={classes.style} color="primary">
          {t('activateCircuitBreaker')}
        </Button>

        <Button className={classes.root} fullWidth size="medium">
          {t('reportTitle')}
        </Button>
      </div>
    </Dialog>
  );
}

export default PopupInfo;
