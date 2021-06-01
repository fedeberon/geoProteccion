import React, { useEffect, useState } from "react";
import t from "../common/localization";
import { GetDeviceName, getDateTime, getHoursMinutes } from '../utils/functions';
import { DataGrid } from '@material-ui/data-grid';
import reportsEventsStyles from "./styles/ReportsEventsStyles";
import Paper from "@material-ui/core/Paper";
import { useSelector, shallowEqual } from "react-redux";

const useStyles = reportsEventsStyles;

const ReportsEvents = ({dataEvents}) => {

const eventsRows = [];
const classes = useStyles();
const [events, setEvents] = useState([]);
const devices = useSelector((state) => Object.values(state.devices.items),
    shallowEqual
  );

useEffect(()=> {
  setEvents(dataEvents);
  console.log(dataEvents)
},[dataEvents]);

const GetDeviceName = (id) => {

    let name;
    devices && devices.map((dev) => {
        if(dev.id === id){
            name = dev.name;
        }
    })
    return name;
}

const eventsColumns = [
{ field: 'date', headerName: `${t(`positionDate`)}`, width: 200 },
{ field: 'deviceName', headerName: `${t("reportDeviceName")}`, width: 260 },    
{ field: 'type', headerName: `${t(`sharedType`)}`, width: 200 },
{ field: 'geofence', headerName: `${t(`sharedGeofence`)}`, width: 150 },
{ field: 'maintenance', headerName: `${t(`sharedMaintenance`)}`, width: 150 },
];

try {
  events && events.map((event,index) => {
    eventsRows.push({
    id: index,
    date: getDateTime(event.serverTime),
    deviceName: GetDeviceName(event.deviceId),        
    type: t(`${event.type}`),
    geofence: event.geofenceId === 0 ? '' : event.geofenceId,
    maintenance: event.maintenance === 0 ? '' : event.maintenance,
    positionId: event.id
    });
});
} catch (error) {
console.error(error);
};

return (
    <>
        {events.length > 0 && 
        <div className={classes.dataGrid}>
        <DataGrid
            component={Paper}
            rows={eventsRows} 
            columns={eventsColumns} 
            pageSize={eventsRows.length} 
            rowHeight={47}
            hideFooter={false}
            checkboxSelection={false}            
        />
        </div>
    }   
    </>
  );
}

export default ReportsEvents;
