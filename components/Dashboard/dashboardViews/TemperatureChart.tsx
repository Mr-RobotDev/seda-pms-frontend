import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";
import { EventsMap, Event } from "@/type";
import { SeriesType } from "@/type";
import { commonApexOptions } from "@/utils/graph";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TemperatureChartProps = {
  data: EventsMap;
  eventTypes: string;
};

const transformDataForChart = (
  data: EventsMap,
  eventTypes: string
): SeriesType[] => {
  return Object.keys(data).map((deviceId) => {
    const deviceData = data[deviceId];
    return {
      name: deviceData.name,
      data: deviceData.data.map((event: Event) => ({
        x: new Date(event.createdAt),
        y: eventTypes.toLowerCase().includes("temperature")
          ? event.temperature
          : event.relativeHumidity,
      })),
    };
  });
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data,
  eventTypes,
}) => {
  const seriesData = transformDataForChart(data, eventTypes);

  const options: ApexOptions = {
    ...commonApexOptions,
    chart: {
      ...commonApexOptions.chart,
      type: "line",
      group: "no-group",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      title: {
        text:
          eventTypes === "temperature"
            ? "Temperature (°C)"
            : "Relative Humidity (%)",
      },
    },
  };

  return (
    <>
      <Chart
        options={options}
        series={seriesData}
        type="line"
        width="100%"
        height="100%"
      />
    </>
  );
};

export default TemperatureChart;
