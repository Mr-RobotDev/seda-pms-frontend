import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { DevicesType } from "@/type";
import SimSignal from "../Device/SimSignal";
import { useTimeAgo } from "next-timeago";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { setDeviceForAlert, setDevicesToGlobal } from "@/app/store/slice/devicesSlice";
import { convertObjectToQueryString, iconsBasedOnType } from "@/utils/helper_functions";
import { PrimaryInput } from "@/components/ui/Input/Input";
import useDebounce from "@/app/hooks/useDebounce";

interface DevicesSelectorProps {
  setSelectedRowKeys: (selectedRowKeys: string[]) => void;
  selectedRowKeys: string[];
  allowSingleDevice?: boolean;
  deviceType?: string;
  updatingDevice?: boolean;
}

const DevicesSelector = ({
  selectedRowKeys,
  setSelectedRowKeys,
  allowSingleDevice,
  deviceType,
  updatingDevice,
}: DevicesSelectorProps) => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [tempDevices, setTempDevices] = useState<DevicesType[]>([]);
  const [loading, setLoading] = useState(false);
  const { TimeAgo } = useTimeAgo();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const addOrRemoveDeviceIdToTheList = (e: any, id: string) => {
    e.stopPropagation();
    const deviceToStore = devices.find(device => device.id === id);
    dispatch(setDeviceForAlert(deviceToStore));
    setSelectedRowKeys([id]);
  };

  const columns: TableProps<DevicesType>["columns"] = [
    {
      title: "Type",
      dataIndex: "type",
      render: (_, { type }) => (
        <div className="flex flex-row items-center gap-7">
          <div className="w-5 h-5">
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
      render: (_, { isOffline, signalStrength, type }) => (
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
  ];

  if (allowSingleDevice) {
    columns.unshift({
      title: "Add",
      dataIndex: "add",
      render: (_, { id, humidityAlert, temperatureAlert, pressureAlert }) => {
        const alertKeyMap: { [key: string]: boolean | undefined } = {
          'relativeHumidity': humidityAlert,
          'temperature': temperatureAlert,
          'pressure': pressureAlert,
        };
        const alertKey = alertKeyMap[deviceType as string];
        if (alertKey === false) {
          return (
            <div className="flex flex-row items-center" onClick={(e) => addOrRemoveDeviceIdToTheList(e, id)}>
              {selectedRowKeys.includes(id)
                ? <MinusCircleIcon width={25} className="text-red-400" />
                : <PlusCircleIcon width={25} className="text-blue-700" />}
            </div>
          );
        }
        return null;
      },
    });
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const params: any = { page: 1, limit: 50, search: debouncedSearch };

        if (deviceType) {
          params.type = deviceType === 'pressure' ? 'pressure' : ['humidity', 'fridge', 'freezer'];
        }

        const updatedParams = convertObjectToQueryString(params);
        const response = await axiosInstance.get(`/devices?${updatedParams}`);
        if (response.status === 200) {
          const devices = response.data.results;
          setTempDevices(devices);
          dispatch(setDevicesToGlobal(devices));
          setDevices(devices);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, deviceType, debouncedSearch, allowSingleDevice]);

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        if (allowSingleDevice) return;
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

  useEffect(() => {
    if (allowSingleDevice) return;
    if (selectedRowKeys.length === 0) {
      setDevices(tempDevices);
    } else {
      setDevices((prevState: any) => {
        const firstSelectedDevice = prevState.find((device: any) => device.id === selectedRowKeys[0]);
        return prevState.filter((device: any) => device.type === firstSelectedDevice?.type);
      });
    }
  }, [selectedRowKeys, tempDevices, allowSingleDevice]);

  return (
    <div className="mt-8">
      {!updatingDevice && <div className="pr-10 mb-6">
        <p className="!text-base font-bold !mb-0">Search</p>
        <PrimaryInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=""
          placeholder="Search By Name or Sensor ID"
        />
      </div>}
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        loading={loading}
        className="cursor-pointer"
        onRow={(record) => onRowClick(record)}
        rowClassName={(record) => {
          const alertKeyMap: { [key: string]: boolean | undefined } = {
            'relativeHumidity': record.humidityAlert,
            'temperature': record.temperatureAlert,
            'pressure': record.pressureAlert,
          };
          const alertKey = alertKeyMap[deviceType as string];
          const isSelected = selectedRowKeys.includes(record.id);
          const isDisabled = allowSingleDevice && alertKey === true;
          return isSelected
            ? "ant-table-row-selected border-2 border-blue-500"
            : isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "";
        }}
      />
    </div>
  );
};

export default DevicesSelector;
