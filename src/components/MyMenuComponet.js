import React from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import {useDispatch, useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {modalsActions} from "../store";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MapIcon from '@material-ui/icons/Map';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import DateRangeIcon from '@material-ui/icons/DateRange';
import BuildIcon from '@material-ui/icons/Build';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({

  flex: {
    flexGrow: 1
  },
  appBar: {
  },
  list: {
    width: 250,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  paper: {
    height: 'auto',
    top: '10%',
    color: 'white',
    textDecoration: 'bold',
    margin: 30,
    boxShadow: '0 3px 5px 2px #1c2939aa',
    background: 'linear-gradient(25deg, #2dc6d4 0%, #1c2939 100%)',
    borderRadius: 25,
  },
  white: {
    textDecoration: 'none',
    color: 'white!important'
  }

});



export default function MyMenuComponet() {
  const open = useSelector(state => state.modals.items.menu);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleHideModal = (name) => {
    dispatch(modalsActions.hide(name));
  }


  return (
      <>
        <Drawer
          open={open}
          classes={{ paper: classes.paper }}
          elevation={4}>
          <div
               tabIndex={0}
               className={classes.list}
               role="button">
            <List subheader={<img loading="lazy" style={{ width: 80, marginLeft: 85, marginRight: 85, marginTop: 20 }} src={require('../../public/images/LogoGeos.png')}></img>}>
              <ListItem  component={NavLink} to={"/account"}>
                <ListItemIcon>
                  <AccountBoxIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('settingsUser')}</Typography>}
                />
              </ListItem>
              <ListItem component={NavLink} to={"/device/list"}>
                <ListItemIcon>
                  <GpsFixedIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('deviceTitle')}</Typography>}
                />
              </ListItem>
              <ListItem component={NavLink} to={"/groups"}>
                <ListItemIcon>
                  <GroupWorkIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('settingsGroups')}</Typography>}
                />
              </ListItem>
              <ListItem component={NavLink} to={"/geozones"}>
                <ListItemIcon>
                  <MapIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('geozones')}</Typography>}
                />
              </ListItem>
              <ListItem component={NavLink} to={"/notifications"}>
                <ListItemIcon>
                  <NotificationsActiveIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('sharedNotifications')}</Typography>}
                />
              </ListItem>
              <ListItem component={NavLink} to={"/calendars"}>
                <ListItemIcon>
                  <DateRangeIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('sharedCalendars')}</Typography>}
                />
              </ListItem>
              <ListItem component={NavLink} to={"/maintenance"}>
                <ListItemIcon>
                  <BuildIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  classes={{ white: classes.white }}
                  primary={<Typography type="body2" style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>{t('sharedMaintenance')}</Typography>}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <ChevronLeftIcon htmlColor={'white'} fontSize={'large'} />
                </ListItemIcon>
                <Button color="inherit" style={{ fontSize: 24 }} onClick={e => {
                  e.stopPropagation();
                  handleHideModal('menu')
                }}>{t('sharedHide')}</Button>
              </ListItem>
            </List>
          </div>
        </Drawer>
      </>
    );
}
