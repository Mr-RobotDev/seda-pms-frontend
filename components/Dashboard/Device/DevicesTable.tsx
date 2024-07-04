import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DevicesType } from "@/type";
import SimSignal from "./SimSignal";
import { useTimeAgo } from "next-timeago";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import useIsMobile from "@/app/hooks/useMobile";
import './DeviceTable.css'
import { iconsBasedOnType } from "@/utils/helper_functions";
import { PrimaryInput } from "@/components/ui/Input/Input";
import useDebounce from "@/app/hooks/useDebounce";
import CustomMenu from "@/components/ui/Menu/CustomMenu";
import { deviceTypeOptions } from "@/utils/form";

const DevicesTable: React.FC = () => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const { TimeAgo } = useTimeAgo();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(false);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);

  const fetchDevices = useCallback(async (searchQuery: string, deviceTypes: string[]) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/devices?page=1&limit=50", {
        params: {
          search: searchQuery,
          type: deviceTypes.join(','),
        },
      });
      if (response.status === 200) {
        setDevices(response.data.results);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices(debouncedSearch, selectedDeviceTypes);
  }, [debouncedSearch, selectedDeviceTypes, fetchDevices]);

  const handleTypeChange = (types: string[]) => {
    setSelectedDeviceTypes(types);
  };

  useEffect(() => {
    console.log('selectedDeviceTypes->', selectedDeviceTypes)
  }, [selectedDeviceTypes])

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        router.push(`/dashboard/devices/${record.id}`);
      },
    };
  };

  let columns: TableProps<DevicesType>["columns"] = [
    {
      title: "TYPE",
      dataIndex: "type",
      render: (_: any, { type }: DevicesType) => (
        <div className=" flex flex-row items-center gap-7">
          <div className=" w-5 h-5">
            <Image
              src={iconsBasedOnType(type)}
              alt="icon"
              width={100}
              height={100}
            />
          </div>
        </div>
      ),
    },
    {
      title: "NAME",
      render: (_: any, { name }: DevicesType) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{name}</p>
        </div>
      ),
    },
    {
      title: 'STATE',
      dataIndex: 'state',
      render: (_: any, { type, temperature, relativeHumidity, pressure }: DevicesType) => (
        <div className=" w-20 md:w-full whitespace-normal">
          {
            type === 'pressure' ? <p className="!text-black">{pressure?.toFixed(2)} Pa</p> : <p className="!text-black"> {relativeHumidity?.toFixed(2)} %RH AT {temperature?.toFixed(2)} °C</p>
          }
        </div>
      ),
    },
    {
      title: "SENSOR ID",
      key: 'sensorId',
      render: (_: any, { oem }: DevicesType) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          {oem ? <p className=" !text-black">{oem}</p> : <p>-</p>}
        </div>
      ),
    },
    {
      title: "LAST UPDATED",
      key: "lastUpdated",
      render: (_: any, { lastUpdated }: DevicesType) =>
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
      title: "SIGNAL",
      render: (_: any, { isOffline, signalStrength, type }: DevicesType) => (
        <>
          {type === 'pressure' ? (
            <p>-</p>
          ) : (
            !isOffline ? (
              <div className="flex flex-row items-center">
                <SimSignal signalStrength={signalStrength} />
              </div>
            ) : (
              <div>
                <Tag color="error">Offline</Tag>
              </div>
            )
          )}
        </>
      )
    },
    {
      title: "ACTIONS",
      key: "actions",
      dataIndex: "actions",
      render: (_: any, { id }: DevicesType) => {
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

  if (isMobile) {
    columns = columns.filter(column => column.key !== 'lastUpdated' && column.key !== 'sensorId');
  }

  const router = useRouter();

  return (
    <div className="mt-8">
      <div className=" flex flex-col md:flex-row gap-3 mb-3">
        <div className="flex-1">
          <p className="!text-base font-bold !mb-1">Search</p>
          <PrimaryInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-full !h-[50px]"
            placeholder="Search By Name or Sensor ID"
          />
        </div>
        <div className="w-72">
          <p className="!text-base font-bold !mb-1">Device Type</p>
          <div className="flex flex-row items-center border rounded-md shadow-md">
            <CustomMenu
              handleTypeChange={handleTypeChange}
              initialValue={selectedDeviceTypes}
              isAdmin={true}
              options={deviceTypeOptions}
              multiple={true}
              searchable={false}
            />
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        loading={loading}
        className="cursor-pointer"
        onRow={onRowClick}
      />
    </div>
  );
};

export default DevicesTable;
