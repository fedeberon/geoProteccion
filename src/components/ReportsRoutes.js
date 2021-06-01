import React, { useEffect, useState } from "react";
import t from "../common/localization";
import { GetDeviceName, getDateTime, getHoursMinutes } from '../utils/functions';
import { DataGrid } from '@material-ui/data-grid';
import reportsRoutesStyles from "./styles/ReportsRoutesStyles";
import Paper from "@material-ui/core/Paper";
import { useSelector, shallowEqual } from "react-redux";

const useStyles = reportsRoutesStyles;

const ReportsRoutes = ({dataRoutes, selected}) => {

const routesRows = [];
const classes = useStyles();
const [routes, setRoutes] = useState([]);
//   const [positions, setPositions] = useState([]);
const server = useSelector((state) => state.session.server);
const devices = useSelector((state) => Object.values(state.devices.items),
    shallowEqual
  );


useEffect(()=> {
    setRoutes(dataRoutes);
// setPositions(dataPositions);
},[dataRoutes]);

const GetDeviceName = (id) => {

    let name;
    devices && devices.map((dev) => {
        if(dev.id === id){
            name = dev.name;
        }
    })
    return name;
}

const routesColumns = [
{ field: 'deviceName', headerName: `${t(`reportDeviceName`)}`, width: 260 },
{ field: 'valid', headerName: `${t("positionValid")}`, width: 100 },    
{ field: 'date', headerName: `${t(`positionDate`)}`, width: 200 },
{ field: 'latitude', headerName: `${t(`positionLatitude`)}`, width: 130 },
{ field: 'longitude', headerName: `${t(`positionLongitude`)}`, width: 130 },
{ field: 'altitude', headerName: `${t(`positionAltitude`)}`, width: 100 },  
{ field: 'speed', headerName: `${t(`positionSpeed`)}`, width: 100 },
];

try {
routes && routes.map((route,index) => {
    routesRows.push({
    id: index,
    deviceName: GetDeviceName(route.deviceId),
    valid: t(`${Boolean(route.valid)}`),
    date: route.deviceTime,
    latitude: route.latitude.toFixed(6) + '°',
    longitude: route.longitude.toFixed(6) + '°',      
    altitude: route.altitude,
    speed: route.speed.toFixed(2) + ` ${server && server.attributes?.speedUnit}`,
    positionId: route.id
    });
});
} catch (error) {
console.error(error);
}; 

const handleRowStopSelection = (e) => {
let selection = routes.find((value) => value.id === e.data.positionId);
selected(selection);
}

return (
    <>
        {routes.length > 0 && 
        <div className={classes.dataGrid}>
        <DataGrid
            component={Paper}
            rows={routesRows} 
            columns={routesColumns} 
            pageSize={routesRows.length} 
            rowHeight={47}
            hideFooter={false}
            checkboxSelection={false}
            onRowSelected={handleRowStopSelection}
        />
        </div>
    }   
    </>
  );
}

export default ReportsRoutes;
