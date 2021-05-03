import React, { useEffect, useState } from "react";
import t from "../common/localization";
import { getDateTime } from '../utils/functions';
import { DataGrid } from '@material-ui/data-grid';
import reportsTripsStyles from "./styles/ReportsTripsStyles";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";

const useStyles = reportsTripsStyles;

const ReportsTrips = ({dataTrips, dataPositions, selected}) => {

  const tripsRows = [];
  const classes = useStyles();
  const [trips, setTrips] = useState([]);
  const [positions, setPositions] = useState([]);
  const server = useSelector((state) => state.session.server);

  useEffect(()=> {
    setTrips(dataTrips);
    setPositions(dataPositions);
  },[dataTrips, dataPositions]);

  const tripsColumns = [
    { field: 'deviceName', headerName: `${t(`reportDeviceName`)}`, width: 260 },
    { field: 'startTime', headerName: `${t(`reportStartTime`)}`, width: 165 },
    { field: 'endTime', headerName: `${t(`reportEndTime`)}`, width: 165 },
    { field: 'startOdometer', headerName: `${t(`reportStartOdometer`)}`, width: 130 },
    { field: 'startAddress', headerName: `${t(`reportStartAddress`)}`, width: 280 },
    { field: 'endOdometer', headerName: `${t(`reportEndOdometer`)}`, width: 130 },
    { field: 'endAddress', headerName: `${t(`reportEndAddress`)}`, width: 280 },
    { field: 'distance', headerName: `${t(`sharedDistance`)}`, width: 100 },
    { field: 'averageSpeed', headerName: `${t(`reportAverageSpeed`)}`, width: 100 },
    { field: 'maxSpeed', headerName: `${t(`reportMaximumSpeed`)}`, width: 100 },
    { field: 'duration', headerName: `${t(`reportDuration`)}`, width: 130 },
    { field: 'spentFuel', headerName: `${t(`reportSpentFuel`)}`, width: 100 },
    { field: 'driverName', headerName: `${t(`sharedDriver`)}`, width: 150 },
  ];

  try {
    trips && trips.map((trip,index) => {
      tripsRows.push({
        id: index,
        deviceName: trip.deviceName,
        startTime: getDateTime(trip.startTime),
        endTime: getDateTime(trip.endTime),
        startOdometer: Number((trip.startOdometer/1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`,
        startAddress: trip.startAddress,
        endOdometer: Number((trip.endOdometer / 1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`,
        endAddress: trip.endAddress,
        distance: Number((trip.distance / 1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`, 
        averageSpeed: Number(trip.averageSpeed.toFixed(2)) + ` ${server && server.attributes?.speedUnit}`,
        maxSpeed: Number(trip.maxSpeed.toFixed(2)) + ` ${server && server.attributes?.speedUnit}`,
        duration: trip.duration,
        spentFuel: Number(trip.spentFuel.toFixed(1)) + ` ${server && server.attributes?.volumeUnit}`,
        driverName: trip.driverName ? trip.driverName : "",
        startPositionId: trip.startPositionId
      });
    });
  } catch (error) {
    console.error(error);
  }; 

  const handleRowTripSelection = (e) => {
    let selection;    
    positions.map((value) => {
      selection = value.find((object) => object.id === e.data.startPositionId)
    });
    selected(selection);
  }

  return (
    <>
      {trips.length > 0 && 
        <div className={classes.dataGrid}>
        <DataGrid
            component={Paper}
            rows={tripsRows} 
            columns={tripsColumns} 
            pageSize={tripsRows.length} 
            rowHeight={42}
            hideFooter={true}
            checkboxSelection={false}
            onRowSelected={handleRowTripSelection}
        />
      </div>
      }   
    </>
  );
}

export default ReportsTrips;
