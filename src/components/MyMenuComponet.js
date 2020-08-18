import React from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {modalsActions} from "../store";
import DraftsIcon from '@material-ui/icons/Drafts';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MapIcon from '@material-ui/icons/Map';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import DateRangeIcon from '@material-ui/icons/DateRange';
import BuildIcon from '@material-ui/icons/Build';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListSubheader from "@material-ui/core/ListSubheader";

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
    margin: 30,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    background: 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(255,208,108,1) 100%)',
    borderRadius:   5
  }

});

export default function MyMenuComponet() {
  const open = useSelector(state => state.modals.items.menu);
  const classes = useStyles();
  const history = useHistory();
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
            <List subheader={<ListSubheader>Menu</ListSubheader>}>
              <ListItem button>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary={t('settingsUser')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <GpsFixedIcon />
                </ListItemIcon>
                <ListItemText primary={t('sharedDevice')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <GroupWorkIcon />
                </ListItemIcon>
                <ListItemText primary={t('settingsGroups')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary={t('geozones')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <NotificationsActiveIcon />
                </ListItemIcon>
                <ListItemText primary={t('sharedNotifications')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText primary={t('sharedCalendars')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText primary={t('sharedMaintenance')} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <ChevronLeftIcon />
                </ListItemIcon>
                <Button color="inherit" onClick={e => {
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
