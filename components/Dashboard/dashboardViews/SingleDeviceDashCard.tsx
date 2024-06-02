"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { EventsMap, Event } from "@/type";
import OptionsMenu from "./OptionMenu";
import { formatToTitleCase } from "@/lib/helperfunctions";

import ReactApexChart from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type DataPoint = {
  x: Date;
  y: number;
};

type Series = {
  name: string;
  data: DataPoint[];
};

type SingleDeviceDashCardProps = {
  data: EventsMap;
  eventTypes: string;
};

const SingleDeviceDashCard = ({
  data,
  eventTypes,
}: SingleDeviceDashCardProps) => {
  const [temperatureData, setTemperatureData] = useState<Series[]>([]);
  const [relativeHumidityData, setRelativeHumidityData] = useState<Series[]>(
    []
  );

  const temperatureDataForChart = (data: EventsMap) => {
    const temperatureData = Object.keys(data).map((deviceId) => {
      const deviceData = data[deviceId];
      return {
        name: deviceData.name,
        data: deviceData.data.map((event: Event) => ({
          x: new Date(event.createdAt),
          y: event.temperature,
        })),
      };
    });
    setTemperatureData(temperatureData);
  };

  const relativehumidityDataForChart = (data: EventsMap) => {
    const relativeHumidityData = Object.keys(data).map((deviceId) => {
      const deviceData = data[deviceId];
      return {
        name: deviceData.name,
        data: deviceData.data.map((event: Event) => ({
          x: new Date(event.createdAt),
          y: event.relativeHumidity,
        })),
      };
    });

    setRelativeHumidityData(relativeHumidityData);
  };

  useEffect(() => {
    temperatureDataForChart(data);
    relativehumidityDataForChart(data);
  }, [data]);

  const TemperatureChart = ({ data }: { data: any }) => {
    const temperatureOptions: ApexOptions = {
      chart: {
        type: "line",
        id: "temperatureChartDevice",
        group: "device",
        toolbar: {
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Temperature",
        },
      },
      series: [
        {
          name: "Temperature",
          data,
        },
      ],
      stroke: {
        width: 2,
        curve: "smooth",
        colors: ["#808080"],
      },
      markers: {
        size: 4,
        colors: ["#FF0000"],
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
    };

    return (
      <ReactApexChart
        options={temperatureOptions}
        series={relativeHumidityData}
        type="line"
        width={"100%"}
        height={"100%"}
      />
    );
  };

  const RelativeHumidityChart = ({ data }: { data: any }) => {
    const relativeHmidityOptions: ApexOptions = {
      chart: {
        type: "line",
        id: "relativeHumidityChartDevice",
        group: "device",
        toolbar: {
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Relative Humidity",
        },
      },
      series: [
        {
          name: "Relative Humidity",
          data,
        },
      ],
      stroke: {
        width: 2,
        curve: "smooth",
        colors: ["#808080"],
      },
      markers: {
        size: 4,
        colors: ["#43A6C6"],
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
    };

    return (
      <ReactApexChart
        options={relativeHmidityOptions}
        series={relativeHumidityData}
        type="line"
        width={"100%"}
        height={"100%"}
      />
    );
  };

  return (
    <div className=" h-full w-full">
      {temperatureData.length > 0 && (
        <div className="w-full !h-1/2">
          <TemperatureChart data={temperatureData as Series[]} />
        </div>
      )}
      {relativeHumidityData.length > 0 && (
        <div className=" w-full !h-1/2">
          <RelativeHumidityChart data={relativeHumidityData} />
        </div>
      )}
    </div>
  );
};

export default SingleDeviceDashCard;
