import React, { useEffect, useState } from "react";
import t from "../common/localization";
import { getDateTime, getHoursMinutes, speedConverter } from '../utils/functions';
import { DataGrid, isOverflown } from '@material-ui/data-grid';
import reportsTripsStyles from "./styles/ReportsTripsStyles";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { useSelector } from "react-redux";

const useStyles = reportsTripsStyles;

const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <div
      ref={wrapper}
      className={classes.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cellDiv}
        style={{
          height: 1,  
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <div ref={cellValue} className="cellValue">
        {value}
      </div>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </div>
  );
});

GridCellExpand.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value ? params.value.toString() : ''}
      width={params.colDef.width}
    />
  );
}

renderCellExpand.propTypes = {
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.any.isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

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
    { field: 'deviceName', headerName: `${t(`reportDeviceName`)}`, width: 260, renderCell: renderCellExpand, },
    { field: 'startTime', headerName: `${t(`reportStartTime`)}`, width: 165 },
    { field: 'endTime', headerName: `${t(`reportEndTime`)}`, width: 165 },
    { field: 'startOdometer', headerName: `${t(`reportStartOdometer`)}`, width: 130 },
    { field: 'startAddress', headerName: `${t(`reportStartAddress`)}`, width: 400, renderCell: renderCellExpand, },
    { field: 'endOdometer', headerName: `${t(`reportEndOdometer`)}`, width: 130 },
    { field: 'endAddress', headerName: `${t(`reportEndAddress`)}`, width: 400, renderCell: renderCellExpand, },
    { field: 'distance', headerName: `${t(`sharedDistance`)}`, width: 150 },
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
        averageSpeed: Number((trip.averageSpeed * speedConverter(server && server.attributes?.speedUnit)).toFixed(0)) + ` ${server && server.attributes?.speedUnit}`,
        maxSpeed: Number((trip.maxSpeed * speedConverter(server && server.attributes?.speedUnit)).toFixed(0)) + ` ${server && server.attributes?.speedUnit}`,
        duration: getHoursMinutes(trip.duration),
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
            rowHeight={47}
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
