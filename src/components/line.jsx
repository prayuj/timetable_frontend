import React from "react";
import { Chart } from "react-google-charts";

export default function Line(props) {
  let ticks = [];
  for (let i = 0; i <= props.iterations; i++) ticks.push(i);
  ticks[0] = { v: 0, f: "Intial" };
  const lineChart = (
    <Chart
      width={"600px"}
      height={"400px"}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={props.data}
      options={{
        hAxis: {
          title: "Iteration",
          ticks: ticks,
        },
        vAxis: {
          title: "Fitness",
          maxValue: 100,
        },
      }}
      rootProps={{ "data-testid": "2" }}
    />
  );
  return lineChart;
}
