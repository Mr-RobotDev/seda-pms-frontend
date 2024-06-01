import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DevicesType } from "@/type";
import SimSignal from "./SimSignal";
import { useTimeAgo } from "next-timeago";
import { formatToTitleCase } from "@/lib/helperfunctions";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

const DevicesTable = () => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const { TimeAgo } = useTimeAgo();

  const columns: TableProps<DevicesType>["columns"] = [
    {
      title: "Type",
      dataIndex: "type",
      render: (_, { type }) => (
        <div className=" flex flex-row items-center gap-7">
          <div className=" w-5 h-5">
            <Image
              src={type === "cold" ? "/snowflake.png" : "/thermometer.png"}
              alt="icon"
              width={100}
              height={100}
            />
          </div>
          <p className="!text-black">{formatToTitleCase(type)}</p>
        </div>
      ),
    },
    {
      title: "Name",
      render: (_, { type, name }) => (
        <div className=" flex flex-row items-center">
          <p className=" !text-black">{name}</p>
        </div>
      ),
    },

    {
      title: "Temperature (°C)",
      dataIndex: "temperature",
      render: (_, { temperature }) => (
        <div>
          <p className="!text-black">{temperature.toFixed(2)} °C</p>
        </div>
      ),
    },
    {
      title: "Relative Humidity (%)",
      key: "relativeHumidity",
      render: (_, { relativeHumidity }) => (
        <div>
          <p className="!text-black">{relativeHumidity.toFixed(2)} %</p>
        </div>
      ),
    },
    {
      title: "Last Updated",
      key: "lastUpdated",
      render: (_, { lastUpdated }) =>
        lastUpdated ? (
          <div className=" flex flex-row items-center">
            <TimeAgo date={new Date(lastUpdated)} locale="en" />
          </div>
        ) : (
          <div>
            <p className=" !text-2xl !ml-4">-</p>
          </div>
        ),
    },
    {
      title: "Signal",
      render: (_, { isOffline, signalStrength }) =>
        !isOffline ? (
          <div className=" flex flex-row items-center">
            <SimSignal signalStrength={signalStrength} />
          </div>
        ) : (
          <div>
            <Tag color="error">Offline</Tag>
          </div>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "aactions",
      render: (_, { id }) => {
        return (
          <div className=" flex flex-row gap-2">
            <Link
              target="_blank"
              href={`/dashboard/devices/${id}/activity-logs`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="group px-2 py-1 text-blue-500 hover:text-blue-600 duration-150 transition-all transform rounded-md flex flex-row gap-2">
                Activity Logs
                <ArrowUpRightIcon
                  width={16}
                  className="transform transition-transform duration-150 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>
        );
      },
    },
  ];

  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/devices?page=1&limit=20");
        if (response.status === 200) {
          setDevices(response.data.results);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        router.push(`/dashboard/devices/${record.id}`);
      },
    };
  };

  return (
    <div className=" p-4 md:px-16">
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        loading={devices.length === 0}
        className="cursor-pointer"
        onRow={onRowClick}
      />
    </div>
  );
};

export default DevicesTable;
