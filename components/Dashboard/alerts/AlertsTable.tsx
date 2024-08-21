'use client'
import { scheduletypeOptions, timeFrameOptions } from '@/utils/form';
import { CheckIcon, TrashIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Checkbox, Image, Table, TableProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { AlertDataType } from '@/type';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import toast from 'react-hot-toast';

const AlertsTable = () => {

  const router = useRouter()

  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  const [alerts, setAlerts] = useState<AlertDataType[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const handleDeleteAlert = async (e: any, alertId: string) => {
    e.stopPropagation();
    setLoading(true)
    try {
      const response = await axiosInstance.delete(`/alerts/${alertId}`)
      if (response.status === 200) {
        const updatedAlerts = alerts.filter(
          (alert) => alert.id !== alertId
        );
        setAlerts(updatedAlerts);
      }
    } catch (err) {
      console.log('Error->', err);
    } finally {
      setLoading(false)
    }
  }

  const columns: TableProps<any>["columns"] = [
    {
      title: "ALERT NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "DEVICE",
      dataIndex: "type",
      render: (_, { device: { name } }) => (
        <p className='!text-black'>{name}</p>
      ),
    },
    {
      title: "SCHEDULE TYPE",
      key: "scheduleType",
      dataIndex: "scheduleType",
      render: (_, { scheduleType }) => (
        <div className="flex flex-row gap-4 items-center">
          <p className=" !text-black !mb-0">
            {
              scheduletypeOptions.find(
                (option) => option.value === scheduleType
              )?.label
            }
          </p>
        </div>
      ),
    },
    {
      title: "RECIPIENTS",
      key: "recipients",
      dataIndex: "recipients",
      render: (_, { recipients }) => (
        <div className="flex flex-row gap-2 items-center">
          {recipients.length}
          <UserIcon width={20} />
        </div>
      ),
    },
    {
      title: "ENABLED",
      key: "enabled",
      dataIndex: "enabled",
      render: (_, { enabled }) => (
        <div className="flex flex-row gap-4 items-center">
          {enabled ? <CheckIcon className=" text-green-700" width={20} /> : <XMarkIcon className=" text-red-700" width={20} />}
        </div>
      ),
    },
  ];

  if (isAdmin) {
    columns.push(
      {
        title: "ACTIONS",
        key: "actions",
        dataIndex: "aactions",
        render: (_, { id }) => {
          return (
            <div className=" flex flex-row gap-4 items-center">
              <p
                onClick={(e) => handleDeleteAlert(e, id)}
                className="  !text-red-400 hover:!text-red-600 duration-200 transition-all transform cursor-pointer flex flex-row gap-2 items-center"
              >
                <TrashIcon width={20} />
              </p>
            </div>
          );
        },
      },)
  }

  const fetchAlerts = useCallback(async (page: number, limit: number) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/alerts`, {
        params: { page, limit },
      })

      setAlerts(response.data.results)
      setCurrentPage(response.data.pagination.page);
      setPageSize(response.data.pagination.limit);
      setTotalItems(response.data.pagination.totalResults);
    } catch (err) {
      console.log('Error->', err);
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts(currentPage, pageSize)
  }, [fetchAlerts, currentPage, pageSize])

  const showReportsDetails = (record: AlertDataType) => ({
    onClick: () => router.push(`alerts/${record.id}`)
  });

  const handleTablePaginationChange = (newPagination: any) => {
    setCurrentPage(newPagination);
    setPageSize(10);
  }

  return (
    <div className=" shadow-md p-2 bg-white">
      <Table
        columns={columns}
        className="cursor-pointer h-full"
        dataSource={alerts}
        scroll={{ x: 500 }}
        rowClassName="overflow-hidden"
        loading={loading}
        onRow={showReportsDetails}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handleTablePaginationChange,
        }}
      />
    </div>
  )
}

export default AlertsTable