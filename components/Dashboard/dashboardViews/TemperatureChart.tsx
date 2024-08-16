import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";
import { EventsMap, Event, alertRange } from "@/type";
import { SeriesType } from "@/type";
import { calculateMinMaxValues, commonApexOptions, generateAnnotations } from "@/utils/graph";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TemperatureChartProps = {
  data: EventsMap;
  eventTypes: string;
  alerts: {
    field: string,
    range: alertRange
  }[] | undefined;
};

const valueToGet = (value: string, event: Event) => {
  if (value.includes("temperature")) {
    return event.temperature
  } else if (value.includes("pressure")) {
    return event.pressure || 0
  } else {
    return event.relativeHumidity
  }
}

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
        y: valueToGet(eventTypes, event)
      })),
    };
  });
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  data,
  eventTypes,
  alerts
}) => {
  const seriesData = transformDataForChart(data, eventTypes);
  const isAlertPresent = alerts?.find((alert: any) => alert.field === eventTypes);

  const annotations = (isAlertPresent && Object.keys(data).length === 1) ? generateAnnotations(isAlertPresent.range) : { yaxis: [] }
  const { minValue, maxValue } = calculateMinMaxValues(seriesData[0].data, annotations, isAlertPresent, eventTypes);

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
      forceNiceScale: true,
      min: Object.keys(data).length === 1 ? minValue : undefined,
      max: Object.keys(data).length === 1 ? maxValue : undefined,
      title: {
        text:
          eventTypes === "temperature"
            ? "Temperature (°C)"
            : eventTypes === 'pressure'
              ? 'Pressure'
              : "Relative Humidity (%)",
      },
      labels: {
        formatter: (value: number) => `${value.toFixed(2)}`,
      },
    },
    annotations: annotations,
  };

  return (
    <>
      {
        seriesData[0].data.length === 0 ?
          <div className=" w-full h-full flex justify-center items-center">
            <p>No Data Available for this Device on this date Range</p>
          </div>
          :
          <Chart
            options={options}
            series={seriesData}
            type="line"
            width="100%"
            height="100%"
          />
      }
    </>
  );
};

export default TemperatureChart;
