import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DevicesType } from "@/type";
import SimSignal from "./SimSignal";
import { useTimeAgo } from "next-timeago";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import useIsMobile from "@/app/hooks/useMobile";
import './DeviceTable.css';
import { convertObjectToQueryString, iconsBasedOnType } from "@/utils/helper_functions";
import { PrimaryInput } from "@/components/ui/Input/Input";
import useDebounce from "@/app/hooks/useDebounce";
import CustomMenu from "@/components/ui/Menu/CustomMenu";
import { deviceTypeOptions } from "@/utils/form";

const DevicesTable: React.FC = () => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const { TimeAgo } = useTimeAgo();
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState({ search: '', type: [] as string[] });
  const debouncedFilters = useDebounce(filters, 500);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const initializeFiltersFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = { search: '', type: [] as string[] };

    if (params.has('search')) {
      initialFilters.search = params.get('search') || '';
    }
    if (params.has('type')) {
      initialFilters.type = params.getAll('type');
    }
    setFilters(initialFilters);
  }, []);

  useEffect(() => {
    initializeFiltersFromUrl();
  }, [initializeFiltersFromUrl]);

  const fetchDevices = useCallback(async (filters: any, page: number, limit: number) => {
    const queryparams = convertObjectToQueryString({
      search: filters.search,
      type: filters.type,
      page,
      limit
    });

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/devices?${queryparams}`);
      if (response.status === 200) {
        setDevices(response.data.results);
        setCurrentPage(response.data.pagination.page);
        setPageSize(response.data.pagination.limit);
        setTotalItems(response.data.pagination.totalResults);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQueryParams = useCallback((filters: any) => {
    const queryParams = new URLSearchParams();

    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    filters.type.forEach((type: any) => queryParams.append('type', type));

    const queryString = queryParams.toString();
    router.push(`/dashboard/devices?${queryString}`, undefined);
  }, [router]);

  useEffect(() => {
    fetchDevices(debouncedFilters, currentPage, pageSize);
    updateQueryParams(debouncedFilters);
  }, [debouncedFilters, fetchDevices, currentPage, pageSize, updateQueryParams]);

  const handleTypeChange = (types: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: types,
    }));
    setCurrentPage(1); // Reset page to 1 when filters are changed
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: e.target.value,
    }));
    setCurrentPage(1); // Reset page to 1 when filters are changed
  };

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        router.push(`/dashboard/devices/${record.id}`);
      },
    };
  };

  const handleTableChange = (newPagination: any) => {
    setCurrentPage(newPagination);
    setPageSize(10);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', type: [] });
    setCurrentPage(1);
    setPageSize(10);
    router.push(`/dashboard/devices`, undefined);
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
        <div className=" w-36 md:w-full whitespace-normal md:whitespace-nowrap flex flex-row items-center">
          <p className=" !text-black">{name}</p>
        </div>
      ),
    },
    {
      title: 'STATE',
      dataIndex: 'state',
      render: (_: any, { type, temperature, relativeHumidity, pressure }: DevicesType) => (
        <div className="  w-20 md:w-full whitespace-normal md:whitespace-nowrap flex flex-row items-center">
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

  return (
    <div className="mt-8">
      <div className=" flex flex-col md:flex-row gap-3 mb-3">
        <div className="flex-1">
          <p className="!text-base font-bold !mb-1">Search</p>
          <PrimaryInput
            value={filters.search}
            onChange={handleSearchChange}
            className=" w-full !h-[45px]"
            placeholder="Search By Name or Sensor ID"
          />
        </div>
        <div className=" md:!w-72">
          <p className="!text-base font-bold !mb-1">Device Type</p>
          <div className="flex flex-row items-center border rounded-md shadow-md">
            <CustomMenu
              handleTypeChange={handleTypeChange}
              initialValue={filters.type}
              isAdmin={true}
              options={deviceTypeOptions}
              multiple={true}
              searchable={false}
              placeholderText="Select the Device Type"
            />
          </div>
        </div>
        <div className="flex items-end justify-end pb-1">
          <Button type="primary" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        loading={loading}
        className="cursor-pointer"
        onRow={onRowClick}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handleTableChange,
        }}
      />
    </div>
  );
};

export default DevicesTable;
