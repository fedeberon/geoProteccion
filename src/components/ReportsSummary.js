import React, { useEffect, useState } from "react";
import t from "../common/localization";
import { getHoursMinutes } from '../utils/functions';
import { DataGrid } from '@material-ui/data-grid';
import reportsSummaryStyles from "./styles/ReportsSummaryStyles";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";

const useStyles = reportsSummaryStyles;

const ReportsStops = ({dataSummary}) => {

  const summaryRows = [];
  const classes = useStyles();
  const [summary, setSummary] = useState([]);
  const server = useSelector((state) => state.session.server);

  useEffect(()=> {
    setSummary(dataSummary);
  },[dataSummary]);

  const summaryColumns = [
    { field: 'deviceName', headerName: `${t(`reportDeviceName`)}`, width: 260 },
    { field: 'distance', headerName: `${t(`sharedDistance`)}`, width: 130 },   
    { field: 'startOdometer', headerName: `${t(`reportStartOdometer`)}`, width: 150 },
    { field: 'endOdometer', headerName: `${t(`reportEndOdometer`)}`, width: 150 },
    { field: 'averageSpeed', headerName: `${t(`reportAverageSpeed`)}`, width: 150 },
    { field: 'maxSpeed', headerName: `${t(`reportMaximumSpeed`)}`, width: 150 },
    { field: 'engineHours', headerName: `${t(`reportEngineHours`)}`, width: 150 },    
    { field: 'spentFuel', headerName: `${t(`reportSpentFuel`)}`, width: 150 },
  ];

  try {
    summary && summary.map((summary,index) => {
        summaryRows.push({
        id: index,
        deviceName: summary.deviceName,
        distance: Number((summary.distance / 1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`,        
        startOdometer: Number((summary.startOdometer/1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`,
        endOdometer: Number((summary.endOdometer / 1000).toFixed(2)) + ` ${server && server.attributes?.distanceUnit}`,
        averageSpeed: Number(summary.averageSpeed.toFixed(2)) + ` ${server && server.attributes?.speedUnit}`,
        maxSpeed: Number(summary.maxSpeed.toFixed(2)) + ` ${server && server.attributes?.speedUnit}`,
        engineHours: getHoursMinutes(summary.engineHours),
        spentFuel: Number(summary.spentFuel.toFixed(1)) + ` ${server && server.attributes?.volumeUnit}`,
      });
    });
  } catch (error) {
    console.error(error);
  }; 

  return (
    <>
      {summary.length > 0 && 
        <div className={classes.dataGrid}>
        <DataGrid
            component={Paper}
            rows={summaryRows} 
            columns={summaryColumns} 
            pageSize={summaryRows.length} 
            rowHeight={47}
            hideFooter={true}
            checkboxSelection={false}
        />
      </div>
      }   
    </>
  );
}

export default ReportsStops;
