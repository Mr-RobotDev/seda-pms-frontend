import { DataPoint } from '@/type';
import { commonApexOptions, temperatureColors } from '@/utils/graph';
import React, { useEffect } from 'react'
import ReactApexChart from 'react-apexcharts';

interface PressureChartProp {
  pressureData: DataPoint[]
}

const PressueChart = ({ pressureData }: PressureChartProp) => {
  const options = {
    ...commonApexOptions,
    chart: {
      id: "TemperatureChart",
      group: "device",
    },
    yaxis: {
      title: {
        text: "Temperature (°C)",
      },
    },
    xaxis: {
      type: "datetime",
    },
    series: [
      {
        name: "Temperature",
        pressureData,
      },
    ],
    colors: temperatureColors,
  };

  return (
    <ReactApexChart
      options={options as any}
      type="line"
      height={275}
      width={"100%"}
    />
  );
}

export default PressueChart