import React, {useLayoutEffect, useRef, useState} from 'react';

class GraphicChart extends React.Component {

  render() {
    const limit = 50000;
    let y = 100;
    const data = [];
    const dataSeries = { type: "line" };
    const dataPoints = [];

    for (let i = 0; i < limit; i += 1) {
      y += Math.round(Math.random() * 10 - 5);
      dataPoints.push({
        x: i,
        y: y
      });
    }
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);

    const options = {
      zoomEnabled: true,
      animationEnabled: true,
      title: {
        text: "Velocidad"
      },
      data: data  // random data
    }

    return (
      <div>
        <CanvasJSChart options = {options}
                       onRef={ref => this.chart = ref}
        />
      </div>
    );
  }
}

// function GraphicChart() {
//
//   const limit = 100;
//   let y = 100;
//   let chart = useRef();
//   const [ data, setData ] = useState([]);
//   const [ dataSeries, setDataSeries ] = useState({ type: "line" });
//   const [ dataPoints, setDataPoints ] = useState([]);
//
//   useLayoutEffect(() => {
//     console.log("hola")
//     let dp = [];
//     for (let i = 0; i < limit; i += 1) {
//       y += Math.round(Math.random() * 10 - 5);
//       dp.push({
//         x: i,
//         y: y
//       });
//     }
//     setDataPoints(dp);
//     setDataSeries({...dataSeries, dataPoints: dp});
//     setData([...data, {...dataSeries, dataPoints: dp}])
//   });
//
//   const options = {
//       zoomEnabled: true,
//       animationEnabled: true,
//       title: {
//         text: "Velocidad"
//       },
//       data: data  // random data
//     }
//
//   return (
//       <div>
//         <CanvasJSChart options = {options}
//                        onRef={ref => (chart.current = ref)}
//         />
//       </div>
//   );
// }

export default GraphicChart
