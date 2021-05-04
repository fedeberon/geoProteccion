import React from 'react';
import { Box, Paper } from '@material-ui/core';
import t from "../common/localization";
import {LineChart, Line, XAxis, YAxis, Label, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from "react-redux";
import { getDateTime } from '../utils/functions';


const ReportsGraphic = ({ type, items, graphicType, devices, selected }) => {

  const server = useSelector((state) => state.session.server);
  let deviceData; 

  const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  try{
    if(items) {
      deviceData = items.find((item) => item.name !== null);
    }
  } catch (error) {
    console.error(error);
  }

  function getDatefromData (data) {

    let value;

    if(graphicType === 'speed'){
      value = items.find((item) => item.speed === data);
    } else if (graphicType === 'altitude'){
      value = items.find((item) => item.id === data);
    } else if (graphicType === 'accuracy'){
      value = items.find((item) => item.id === data);
    }    
    return getDateTime(value.fixTime);
  }

  function getUnit (data) {

    let value;
    switch(data){
      case 'speed':
        value = server.attributes.speedUnit;
        break;
      case 'accuracy': 
        value = server.attributes.distanceUnit;
        break;
      default: 
        value = '';
    }
    return value;
  };

  function CustomTooltip({ payload, active}) {

    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload?.name}</p>
          <p className="label">{`${t(`position${capitalize(graphicType)}`)} : ${payload[0].value} ${getUnit(graphicType)}`}</p>
          <p className="desc" >
            {`${t('positionDate')}: ${graphicType === 'speed' ? getDatefromData(payload[0].value) : getDatefromData(payload[0].payload?.id)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const selectedPoint = (e) => {
    selected(e.activePayload[0].payload);
  };

  return (
    <Paper>
      <Box height={390}>
        <ResponsiveContainer>
          <LineChart data={items} onClick={(e) => selectedPoint(e)}>
            <XAxis dataKey={`${deviceData && deviceData.fixTime}`} height={60} >
              <Label value={`${deviceData && deviceData.name}`} offset={0} position="insideBottom"/>
            </XAxis>
            <YAxis 
              label={{ value: `${getUnit(graphicType)}`, angle: -90, position: 'insideLeft' }}
              domain={graphicType === 'speed' ? [0, 'auto'] : [-1.5, dataMax => (dataMax + 1.5)]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip  content={<CustomTooltip/>}/>
            <Legend />            
                <Line  dataKey={`${graphicType}`}/>
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default ReportsGraphic;