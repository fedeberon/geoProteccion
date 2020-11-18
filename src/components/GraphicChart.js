import React from 'react';
import CanvasJSReact from '../canvasjs.react';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

let startTime = 0;
let endTime = 0

class GraphicChart extends React.Component {
  //
  // componentDidMount() {
  //   endTime = new Date();
  //   document.getElementById("timeToRender").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
  // }

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

    const spanStyle = {
      position:'absolute',
      top: '10px',
      fontSize: '20px',
      fontWeight: 'bold',
      backgroundColor: '#d85757',
      padding: '0px 4px',
      color: '#ffffff'
    }

    const options = {
      zoomEnabled: true,
      animationEnabled: true,
      title: {
        text: "Velocidad"
      },
      data: data  // random data
    }

    startTime = new Date();

    return (
      <div>
        <CanvasJSChart options = {options}
                       onRef={ref => this.chart = ref}
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        <span id="timeToRender" style={spanStyle}/>
      </div>
    );
  }
}

export default GraphicChart
