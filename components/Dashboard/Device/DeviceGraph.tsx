"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, DatePicker, Spin, Button, Dropdown, Menu, Divider } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import toast from "react-hot-toast";
import { DevicesType } from "@/type";
import Image from "next/image";
import CountUp from "react-countup";
import dynamic from "next/dynamic";
import { CalendarIcon } from "@heroicons/react/20/solid";
import ReactApexChart from "react-apexcharts";
import {
  ArrowUpRightIcon,
  SignalIcon,
  SignalSlashIcon,
} from "@heroicons/react/16/solid";
import FileDownloadButton from "../Floor/FileDownloadButton";
import Link from "next/link";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface DataPoint {
  oem: string;
  eventType: string;
  temperature: number;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

const commonChartOptions = {
  chart: {
    type: "line",
    group: "device",
    zoom: {
      enabled: true,
    },
    animations: {
      enabled: true,
    },
  },
  xaxis: {
    type: "datetime",
  },
  tooltip: {
    x: {
      format: "dd MMM yyyy HH:mm",
    },
    shared: true,
  },
  stroke: {
    width: 2, // Set the line thickness
    curve: "smooth", // Optional: make the line smooth
    colors: ["#808080"],
  },
  markers: {
    size: 4, // Size of the points on the line
    colors: ["#FF0000"], // Optional: custom color for the markers
    strokeWidth: 2, // Optional: width of the marker border
    hover: {
      size: 6,
    },
  },
};

interface DeviceGraphProps {
  id: string;
}

const DeviceGraph = ({ id }: DeviceGraphProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [deviceOem, setDeviceOem] = useState<string>("");
  const [deviceData, setDeviceData] = useState<DevicesType>();
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(3, "day").startOf("day"),
    dayjs().endOf("day"),
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [graphloading, setGraphLoading] = useState<boolean>(false);
  const [currentPreset, setCurrentPreset] = useState<string>("Last 3 Days");

  const [temperatureData, setTemperatureData] = useState<DataPoint[]>([]);
  const [humidityData, setHumidityData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");
    if (from && to) {
      setRange([dayjs(from), dayjs(to)]);
    }
  }, []);

  const TemperatureChart = ({ data }: { data: any }) => {
    const options = {
      ...commonChartOptions,
      chart: {
        id: "TemperatureChart",
        group: "device",
        toolbar: {
          show: true,
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
      yaxis: {
        title: {
          text: "Temperature (°C)",
        },
      },
      series: [
        {
          name: "Temperature",
          data,
        },
      ],
    };
    return (
      <ReactApexChart
        options={options as any}
        series={options.series}
        type="line"
        height={275}
        width={"100%"}
      />
    );
  };

  const HumidityChart = ({ data }: { data: any }) => {
    const options = {
      ...commonChartOptions,
      chart: {
        id: "HumidityChart",
        group: "device",
        toolbar: {
          show: true,
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
      yaxis: {
        title: {
          text: "Humidity (%)",
        },
        labels: {
          formatter: (value: number) => `${value}%`,
        },
      },
      series: [
        {
          name: "Humidity",
          data,
        },
      ],
      markers: {
        size: 4, // Size of the points on the line
        colors: ["#43A6C6"], // Optional: custom color for the markers
        strokeWidth: 2, // Optional: width of the marker border
        hover: {
          size: 6,
        },
      },
    };
    return (
      <ReactApexChart
        options={options as any}
        series={options.series}
        type="line"
        height={275}
        width={"100%"}
      />
    );
  };

  const fetchData = useCallback(
    async (from: string, to: string) => {
      if (deviceOem) {
        try {
          setGraphLoading(true);
          const response = await axiosInstance.get(
            `/events?oem=${deviceOem}&from=${from}&to=${to}`
          );
          if (response.status === 200) {
            const sortedData = response.data.results.sort(
              (a: DataPoint, b: DataPoint) => {
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                );
              }
            );

            const tempData = sortedData.map((point: DataPoint) => ({
              x: new Date(point.createdAt).getTime(),
              y: point.temperature,
            }));

            const humidData = sortedData.map((point: DataPoint) => ({
              x: new Date(point.createdAt).getTime(),
              y: point.relativeHumidity,
            }));

            setData(sortedData);
            setTemperatureData(tempData);
            setHumidityData(humidData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
          setGraphLoading(false);
        }
      }
    },
    [deviceOem]
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(`/devices/${id}`);
        if (response.status === 200) {
          setDeviceOem(response.data.oem);
          setDeviceData(response.data);
        } else {
          console.log("error->", response);
        }
      } catch (error: any) {
        console.log("error->", error);
      }
    })();
  }, [id]);

  useEffect(() => {
    const from = dayjs(range[0].toISOString()).format("YYYY-MM-DD");
    const to = dayjs(range[1].toISOString()).format("YYYY-MM-DD");
    fetchData(from, to);

    if (window && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      window.history.replaceState({}, "", url.toString());
    }
  }, [range, fetchData]);

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      let newRange: [Dayjs, Dayjs];
      newRange = [dayjs(dates[0]), dayjs(dates[1])];
      setRange(newRange);
      const from = newRange[0].format("YYYY-MM-DD");
      const to = newRange[1].format("YYYY-MM-DD");
      if (window && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        window.history.replaceState({}, "", url.toString());
      }
    } else {
      toast.error("Date Range cannot be empty");
    }
  };

  const handleDatePreset = (preset: string) => {
    let newRange: [Dayjs, Dayjs];
    switch (preset) {
      case "Today":
        newRange = [dayjs().startOf("day"), dayjs().endOf("day")];
        break;
      case "Yesterday":
        newRange = [
          dayjs().subtract(1, "day").startOf("day"),
          dayjs().subtract(1, "day").endOf("day"),
        ];
        break;
      case "This Week":
        newRange = [dayjs().startOf("week"), dayjs().endOf("week")];
        break;
      case "Last Week":
        newRange = [
          dayjs().subtract(1, "week").startOf("week"),
          dayjs().subtract(1, "week").endOf("week"),
        ];
        break;
      case "Last 3 Days":
        newRange = [
          dayjs().subtract(3, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
        break;
      case "Last 7 Days":
        newRange = [
          dayjs().subtract(7, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
        break;
      case "Last 30 Days":
        newRange = [
          dayjs().subtract(30, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
        break;
      default:
        newRange = [dayjs().startOf("day"), dayjs().endOf("day")];
    }
    setRange(newRange);
    const from = newRange[0].format("YYYY-MM-DD");
    const to = newRange[1].format("YYYY-MM-DD");
    if (window && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      window.history.replaceState({}, "", url.toString());
    }
    setCurrentPreset(preset);
  };

  const menu = (
    <Menu className=" w-36">
      {["Today", "Yesterday"].map((preset) => (
        <Menu.Item
          key={preset}
          onClick={() => handleDatePreset(preset)}
          style={{ fontWeight: preset === currentPreset ? "bold" : "normal" }}
        >
          {preset}
        </Menu.Item>
      ))}
      <Divider className=" h-[1px] bg-gray-100 !m-0" />

      {["This Week", "Last Week"].map((preset) => (
        <Menu.Item
          key={preset}
          onClick={() => handleDatePreset(preset)}
          style={{ fontWeight: preset === currentPreset ? "bold" : "normal" }}
        >
          {preset}
        </Menu.Item>
      ))}
      <Divider className=" h-[1px] bg-gray-100 !m-0" />
      {["Last 3 Days", "Last 7 Days", "Last 30 Days"].map((preset) => (
        <Menu.Item
          key={preset}
          onClick={() => handleDatePreset(preset)}
          style={{ fontWeight: preset === currentPreset ? "bold" : "normal" }}
        >
          {preset}
        </Menu.Item>
      ))}

      <Divider className=" h-[1px] bg-gray-100 !m-0" />
      <Menu.Item key="custom" onClick={() => setCurrentPreset("Custom")}>
        Custom
      </Menu.Item>
    </Menu>
  );

  return loading ? (
    <div className="flex justify-center items-center h-full mt-20">
      <Spin size="large" />
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-auto mb-14 ">
        <div className=" h-full">
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div>
                <span className=" text-lg">Name</span>
                <div className="">
                  <span className="">
                    <p className="!text-2xl !font-bold !mb-0">
                      {deviceData?.name}
                    </p>
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                <Image
                  src={
                    deviceData?.type === "cold"
                      ? "/snowflake.png"
                      : "/thermometer.png"
                  }
                  className=" w-full h-full"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div>
                <span className=" text-lg !mb-0">Highest Temperature</span>
                <div className="text-2xl font-bold">
                  <span className="!text-3xl !font-bold">
                    <CountUp
                      decimals={2}
                      end={deviceData?.temperature as number}
                      duration={2}
                    />
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                <Image
                  src={"/high-temperature.png"}
                  className=" w-full h-full"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div>
                <span className=" text-lg !mb-0">Highest Humidity</span>
                <div className="">
                  <span className="!text-3xl !font-bold">
                    <CountUp
                      decimals={2}
                      end={deviceData?.relativeHumidity as number}
                      duration={2}
                    />
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                <Image
                  src={"/humidity.png"}
                  className=" w-full h-full"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card bordered={false} className="criclebox h-full">
            <div className=" text-2xl flex flex-row justify-between">
              <div>
                <span className=" text-lg">
                  {deviceData?.isOffline ? "Connectivity" : "Signal Strength"}
                </span>
                <div className="">
                  <span className="!text-3xl !font-bold">
                    {deviceData?.signalStrength && (
                      <CountUp
                        end={deviceData?.signalStrength as number}
                        duration={2}
                      />
                    )}
                    {!deviceData?.signalStrength && (
                      <p className="!text-2xl !font-bold !mb-0 ">Offline</p>
                    )}
                  </span>
                </div>
              </div>
              <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                {deviceData?.signalStrength && (
                  <Image
                    src={"/network-signal.png"}
                    className=" w-full h-full"
                    alt="icon"
                    width={100}
                    height={100}
                  />
                )}
                {!deviceData?.signalStrength && (
                  <Image
                    src={"/offline.png"}
                    className=" w-full h-full"
                    alt="icon"
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div>
        <div className=" mx-auto">
          <Card>
            <div className="flex flex-col gap-2">
              <div className=" flex flex-row items-center gap-3 justify-end">
                <FileDownloadButton
                  oem={deviceOem}
                  from={range[0].format("YYYY-MM-DD")}
                  to={range[1].format("YYYY-MM-DD")}
                />
                <Link
                  href={`/dashboard/devices/${id}/activity-logs`}
                  target="_blank"
                >
                  <Button className=" flex flex-row items-center justify-center gap-3 w-36">
                    Activity Logs
                    <div>
                      <ArrowUpRightIcon
                        width={16}
                        className="transform transition-transform duration-150 group-hover:translate-x-1"
                      />
                    </div>
                  </Button>
                </Link>
              </div>
              <div className="flex justify-end">
                <div className=" flex flex-row gap-3 items-center justify-center w-full md:w-auto">
                  <div
                    className={`flex-row gap-3 items-center justify-between md:justify-end w-full ${currentPreset === "Custom" ? "flex" : "hidden"
                      }`}
                  >
                    <p className="!m-0 font-semibold">Date Range</p>
                    <RangePicker
                    className="hidden md:flex"
                      onChange={handleRangeChange}
                      defaultValue={range}
                    />
                  </div>
                  <Dropdown overlay={menu} placement="bottomRight" arrow className="flex ml-auto">
                    <Button className="w-36 flex flex-row gap-2 items-center">
                      <CalendarIcon width={20} />
                      <p className="!m-0">{currentPreset}</p>
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className={` justify-end md:hidden ${currentPreset === "Custom" ? "flex" : "hidden"}`}>
                <RangePicker
                className=" w-full"
                  onChange={handleRangeChange}
                  defaultValue={range}
                />
              </div>
              <div className=" w-full">
                {graphloading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spin size="large" />
                  </div>
                ) : data.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p>No data available for the selected date range</p>
                  </div>
                ) : (
                  <>
                    <div className=" h-[275px]">
                      {temperatureData.length !== 0 && (
                        <TemperatureChart data={temperatureData} />
                      )}
                    </div>
                    <div className=" h-[275px]">
                      {humidityData.length !== 0 && (
                        <HumidityChart data={humidityData} />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DeviceGraph;
