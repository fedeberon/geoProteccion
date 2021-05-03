import React, { useEffect, useState } from "react";
import t from "../common/localization";
import { getDateTime, getHoursMinutes } from '../utils/functions';
import { DataGrid } from '@material-ui/data-grid';
import reportsStopsStyles from "./styles/ReportsTripsStyles";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";

const useStyles = reportsStopsStyles;

const ReportsStops = ({dataStops, dataPositions, selected}) => {

  const stopsRows = [];
  const classes = useStyles();
  const [stops, setStops] = useState([]);
  const [positions, setPositions] = useState([]);
  const server = useSelector((state) => state.session.server);

  useEffect(()=> {
    setStops(dataStops);
    setPositions(dataPositions);
  },[dataStops, dataPositions]);

  const stopsColumns = [
    { field: 'deviceName', headerName: `${t(`reportDeviceName`)}`, width: 260 },
    { field: 'startTime', headerName: `${t(`reportStartTime`)}`, width: 165 },    
    { field: 'startOdometer', headerName: `${t(`reportStartOdometer`)}`, width: 130 },
    { field: 'address', headerName: `${t(`reportStartAddress`)}`, width: 300 },
    { field: 'endTime', headerName: `${t(`reportEndTime`)}`, width: 165 },
    { field: 'duration', headerName: `${t(`reportDuration`)}`, width: 130 },
    { field: 'engineHours', headerName: `${t(`reportEngineHours`)}`, width: 130 },    
    { field: 'spentFuel', headerName: `${t(`reportSpentFuel`)}`, width: 100 },
  ];

  try {
    stops && stops.map((stops,index) => {
        stopsRows.push({
        id: index,
        deviceName: stops.deviceName,
        startTime: getDateTime(stops.startTime),        
        startOdometer: Number((stops.startOdometer/1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`,
        address: stops.address,
        endTime: getDateTime(stops.endTime),      
        duration: getHoursMinutes(stops.duration),
        engineHours: getHoursMinutes(stops.engineHours),
        spentFuel: Number(stops.spentFuel.toFixed(1)) + ` ${server && server.attributes?.volumeUnit}`,
        positionId: stops.positionId
      });
    });
  } catch (error) {
    console.error(error);
  }; 

  const handleRowStopSelection = (e) => {
    let selection = positions.find((value) => value.id === e.data.positionId);
    selected(selection);
  }

  return (
    <>
      {stops.length > 0 && 
        <div className={classes.dataGrid}>
        <DataGrid
            component={Paper}
            rows={stopsRows} 
            columns={stopsColumns} 
            pageSize={stopsRows.length} 
            rowHeight={47}
            hideFooter={true}
            checkboxSelection={false}
            onRowSelected={handleRowStopSelection}
        />
      </div>
      }   
    </>
  );
}

export default ReportsStops;
