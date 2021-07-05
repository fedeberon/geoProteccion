import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import {
  devicesActions,
  notificationActions,
  positionsActions,
} from "../store";

const SocketController = () => {
  const dispatch = useDispatch();

  const connectSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(
      protocol + "//" + window.location.host + "/api/socket"
    );

    socket.onclose = () => {
      setTimeout(() => connectSocket(), 60 * 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.devices) {
        //dispatch(devicesActions.update(data.devices));
      }
      if (data.positions) {
        //dispatch(positionsActions.update(data.positions));
      }
      if (data.events) {
        dispatch(
          notificationActions.apply({
            type: "SNACKBAR_SUCCESS",
            message: data.events,
          })
        );
      }
    };
  };

  useEffect(async() => {
    await fetch("/api/devices").then((response) => {
      if (response.ok) {
        response.json().then((devices) => {
          dispatch(devicesActions.update(devices));
          if(devices.length > 50){
            dispatch(devicesActions.setDisableIcon(true));
          }
          setTimeout(()=> {
            connectSocket();
          },15000) 
        });
      }      
    });
  }, []);

  return null;
};

export default connect()(SocketController);
