import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { getSVG } from '../utils/svgGetter';
import t from "../common/localization";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { getDateTimeDevices } from '../utils/functions';
import { useHistory } from "react-router-dom";
import deviceListStyles from "./styles/DeviceListStyles";
import { devicesActions, positionsActions } from "../store";

const useStyles = deviceListStyles;

function DeviceList  ({list, enableIcon, upIcon, closing}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const server = useSelector((state) => state.session.server);
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const classes = useStyles();
  const devicesRedux = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const selectedItems = useSelector((state) => state.positions.selectedItems);

  const dispatchDevice = (device) => {
    dispatch(devicesActions.select(device));
    dispatch(devicesActions.selectedDevice(device));
    closing();
    if(selectedItems.findIndex(elem => elem.id === device.id) === -1){
      handleSetItems(device);
    }
    setTimeout(()=> {
      dispatch(devicesActions.select(""));
    },750);
  };

  const handleSetItems = (device) => {
    let icon = document.getElementById(`show-${device.id}`);
    if(icon){
      if(selectedItems.findIndex(elem => elem.id === device.id) === -1){      
        dispatch(positionsActions.addSelectedDevice(device));
        icon.style.color = "chartreuse";
      } else {
        dispatch(positionsActions.removeSelectedDevice(device));
        dispatch(positionsActions.lastRemoved(device.id));
        icon.style.color = "rgb(134, 128, 187)";
      }  
    }      
  }

  useEffect(()=> {
    if(selectedItems.length > 0){
      selectedItems.map(item => {
        let icon = document.getElementById(`show-${item.id}`)
        if(icon){
          icon.style.color = "chartreuse";
        }
      })
    }
  },[devicesRedux, upIcon])

  const Row = ({index, style}) => (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
      <Fragment key={list[index].id}>
        <ListItem
          className={classes.listItem}
          button
          key={list[index].id}
          onClick={() => dispatchDevice(list[index])}
        >
          <ListItemAvatar>
            <Avatar className={classes.MuiAvatarRoot}>
              {getSVG(list[index].category, list[index].status)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText style={{maxWidth: (window.innerWidth > 760 && !enableIcon) ? 450 : ''}}>
            <div className={classes.devsearchSt}>
              <p className={classes.devsearchStP}>
                <strong> {list[index].name} </strong>                
              </p>
              <div className={classes.devsearchSd}>
                {getDateTimeDevices(list[index].lastUpdate)}
                <p
                  className={`status-${list[index].status} ${classes.devsearchSdP}`}
                >
                  {" "}
                  {list[index].status}{" "}
                </p>
              </div>
            </div>
          </ListItemText>

          <div className={classes.devsearchSpeed}>
            <p className={classes.devsearchSpeedP}>                  
              {positions && positions[list[index].id]
                ? positions[list[index].id].speed.toFixed(0)
                : "0"}{" "}
              {server && `${server.attributes?.speedUnit}`}
            </p>
            <i
              className={`far fa-circle fa-2x device-icon-${list[index].status} status-${list[index].status}`}
              style={{
                paddingRight: "0px",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </div>

          <ListItemSecondaryAction>
            <IconButton
              id={`device-info-${list[index].id}`}
              style={{ color: "#8680bb", padding: '6px'}}
              title={t("sharedInfoTitle")}
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/device/${list[index].id}`);
              }}
            >
              <i style={{fontSize: '18px'}} className="fas fa-upload"></i>
            </IconButton>
            {enableIcon &&
              <IconButton
              id={`device-object-${list[index].id}`}
              style={{ color: "#8680bb", padding: '6px'}}
              title={t("reportShow")}
              onClick={(e) => {
                e.stopPropagation();
                handleSetItems(list[index]);
              }}
            >
              <i id={`show-${list[index].id}`} style={{fontSize: '18px'}}className="fas fa-eye"></i>
            </IconButton>
            } 
          </ListItemSecondaryAction>
          </ListItem>
      </Fragment>
      </div>
  );

  return (
    <AutoSizer>
        {({height, width}) => (
          <List
            className="List"
            height={height}
            itemCount={list.length}
            itemSize={55}
            width={width}
          >
            {Row}                    
          </List>                 
        )}
    </AutoSizer>
  );
};

export default DeviceList;
