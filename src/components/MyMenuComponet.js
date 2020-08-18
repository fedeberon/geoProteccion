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

const useStyles = makeStyles({

  flex: {
    flexGrow: 1
  },
  appBar: {
  },

  list: {
    width: 200,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  paper: {
    margin: 30,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    borderRadius:   5
  }

});

export default function MyMenuComponet() {
  const open = useSelector(state => state.modals.items.search);
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
          classes={{ paper: classes.paper }}>
          <div
               tabIndex={0}
               className={classes.list}
               role="button">
            <List>
              <ListItem button onClick={() => history.push('/')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={t('mapTitle')} />
              </ListItem>
            </List>
            <List>
              <ListItem button disabled>
                <ListItemText primary={t('settingsUser')} />
              </ListItem>
              <ListItem button>
                <ListItemText primary={t('sharedDevice')} />
              </ListItem>
              <ListItem button>
                <ListItemText primary={t('settingsGroups')} />
              </ListItem>
              <ListItem button>
                <ListItemText primary={t('geozones')} />
              </ListItem>
              <ListItem button>
                <ListItemText primary={t('sharedNotifications')} />
              </ListItem>
              <ListItem button>
                <ListItemText primary={t('sharedCalendars')} />
              </ListItem>
              <ListItem button>
                <ListItemText primary={t('sharedMaintenance')} />
              </ListItem>
              <Divider />
              <ListItem>
                <Button color="inherit" onClick={() => handleHideModal('search')}>{t('sharedHide')}</Button>
              </ListItem>
            </List>
          </div>
        </Drawer>
      </>
    );
}
