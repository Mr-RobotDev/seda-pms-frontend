import React, { memo, useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { DevicesType, Event } from "@/type";
import SimSignal from "../Device/SimSignal";
import { useTimeAgo } from "next-timeago";

interface DevicesSelectorProps {
  setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void;
  selectedRowKeys: React.Key[];
}
const DevicesSelector = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: DevicesSelectorProps) => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const { TimeAgo } = useTimeAgo();

  const columns: TableProps<DevicesType>["columns"] = [
    {
      title: "Type",
      dataIndex: "type",
      render: (_, { type }) => (
        <div className="flex flex-row items-center gap-7">
          <div className="w-5 h-5">
            <Image
              src={type === "cold" ? "/snowflake.png" : "/thermometer.png"}
              alt="icon"
              width={100}
              height={100}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Name",
      render: (_, { name }) => (
        <div className="flex flex-row items-center">
          <p className="!text-black">{name}</p>
        </div>
      ),
    },
    {
      title: "Last Updated",
      key: "lastUpdated",
      render: (_, { lastUpdated }) =>
        lastUpdated ? (
          <div className="flex flex-row items-center">
            <TimeAgo date={new Date(lastUpdated)} locale="en" />
          </div>
        ) : (
          <div>
            <p className="!text-2xl !ml-4">-</p>
          </div>
        ),
    },
    {
      title: "Signal",
      render: (_, { isOffline, signalStrength }) =>
        !isOffline ? (
          <div className="flex flex-row items-center">
            <SimSignal signalStrength={signalStrength} />
          </div>
        ) : (
          <div>
            <Tag color="error">Offline</Tag>
          </div>
        ),
    },
  ];

  useEffect(() => {
    if (devices.length === 0) {
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
    }
  }, [devices]);

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        const selectedKey = record.id;
        if (selectedRowKeys.includes(selectedKey)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((key) => key !== selectedKey)
          );
        } else {
          setSelectedRowKeys([...selectedRowKeys, selectedKey]);
        }
      },
    };
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Event[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className="mt-8">
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        loading={devices.length === 0}
        className="cursor-pointer"
        onRow={(record) => onRowClick(record)}
        rowClassName={(record) =>
          selectedRowKeys.includes(record.id)
            ? "ant-table-row-selected !border-2 !border-blue-500"
            : ""
        }
      />
    </div>
  );
};

export default memo(DevicesSelector);
