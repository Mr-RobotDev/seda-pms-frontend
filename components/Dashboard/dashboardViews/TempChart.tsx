import dynamic from 'next/dynamic';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import { EventsMap, Event } from '@/type';
import OptionsMenu from './OptionMenu';
import { formatToTitleCase } from '@/lib/helperfunctions';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type DataPoint = {
  x: Date;
  y: number;
};

type Series = {
  name: string;
  data: DataPoint[];
};

type TemperatureChartProps = {
  data: EventsMap;
  eventTypes: string;
};

const transformDataForChart = (data: EventsMap, eventTypes: string): Series[] => {
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

const TempChart: React.FC<TemperatureChartProps> = ({ data, eventTypes }) => {
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
        text: eventTypes,
      },
    },
    stroke: {
      width: 1,
    },
  };


  return <>
    <Chart options={options} series={seriesData} type="line" width="100%" height="100%" />
  </>
};

export default TempChart;
