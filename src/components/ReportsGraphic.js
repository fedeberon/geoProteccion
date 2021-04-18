import React from 'react';
import { Box, Paper } from '@material-ui/core';
import t from "../common/localization";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const CustomizedAxisTick = ({ x, y, payload }) =>{
//   const parts = payload.value.split(' ');
//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{parts[0]}</text>
//       <text x={0} y={16} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{parts[1]}</text>
//     </g>
//   );
// }
let array = new Array();

const ReportsGraphic = ({ type, items, graphicType, devices }) => {

  // const arrayConstructor = () => {
  //   if(devices > 1){
  //     devices.map((device,index) => {
  //       if(index === 0){
  //         ({       
  //           id: device.deviceId,
  //           accuracy: accuracy,
  //           altitude: altitude,
  //           [`speed${index}`]: speed,
  //           fixTime: fixTime,
  //           index: index,
  //         })
  //       }
  //     } 
  //   )}
  // }

  return (
    <Paper>
      <Box height={390}>
        <ResponsiveContainer>
          <LineChart data={items}>
            <XAxis dataKey={t(`position${type && type.toUpperCase()}`)} tick={""} height={60} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {/* {devices && devices.map((index) => { */}
                <Line type="natural" dataKey={`${graphicType}`}/>
            {/* // })}             */}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default ReportsGraphic;