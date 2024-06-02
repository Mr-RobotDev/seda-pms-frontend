import dynamic from 'next/dynamic';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import { EventsMap, Event } from '@/type';
import { humidityColors, temperatureColors } from '@/utils/graph'
import { SeriesType } from '@/type';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TemperatureChartProps = {
  data: EventsMap;
  eventTypes: string;
};

const transformDataForChart = (data: EventsMap, eventTypes: string): SeriesType[] => {
  return Object.keys(data).map((deviceId) => {
    const deviceData = data[deviceId];
    return {
      name: deviceData.name,
      data: deviceData.data.map((event: Event) => ({
        x: new Date(event.createdAt),
        y: eventTypes.toLowerCase().includes('temperature') ? event.temperature : event.relativeHumidity,
      })),
    };
  });
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, eventTypes }) => {
  const seriesData = transformDataForChart(data, eventTypes);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      group: "no-group",
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: true,
          zoomout: false,
          pan: false,
          reset: true,
        },
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: eventTypes === 'temperature' ? 'Temperature (°C)' : 'Relative Humidity (%)',
      },
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors:eventTypes === 'temperature' ? temperatureColors : humidityColors,
    },
    colors: eventTypes === 'temperature' ? temperatureColors : humidityColors
  };


  return <>
    <Chart options={options} series={seriesData} type="line" width="100%" height="100%" />
  </>
};

export default TemperatureChart;
