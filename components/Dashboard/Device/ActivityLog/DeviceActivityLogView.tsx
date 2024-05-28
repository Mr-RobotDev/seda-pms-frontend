'use client'
import React, { useEffect, useState, useCallback } from 'react';
import withDashboardLayout from '@/hoc/withDashboardLayout'
import axiosInstance from '@/lib/axiosInstance';
import { DatePicker, Table, TableProps, Tag } from 'antd';
import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { formatDateTime, formatToTitleCase } from '@/lib/helperfunctions';
import '../../Users/UserTable.css'
import Image from 'next/image';

const { RangePicker } = DatePicker;

interface DeviceActivityLogViewProps {
  id: string
}

const paginationInitialState = {
  current: 1,
  pageSize: 10,
  total: 0,
}

interface ActivityLog {
  page: string;
  action: string;
}
const DeviceActivityLogView = ({ id }: DeviceActivityLogViewProps) => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState(paginationInitialState.current);
  const [pageSize, setPageSize] = useState(paginationInitialState.pageSize);
  const [total, setTotal] = useState(paginationInitialState.total);

  const actionColorMapping: { [key: string]: string } = {
    'viewed': 'blue',
    'logged in': 'green',
    'default': 'volcano',
    'updated': 'orange',
  };

  const fetchLogs = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/logs`, {
        params: {
          page,
          limit,
          from: range[0].toISOString(),
          to: range[1].toISOString(),
          device: id,
        },
      });
      if (response.status === 200) {
        setActivityLogs(response.data.results);
        setCurrent(response.data.pagination.page);
        setPageSize(response.data.pagination.limit);
        setTotal(response.data.pagination.totalResults);
      } else {
        toast.error('Error fetching the activity logs');
      }
    } catch (error) {
      toast.error('Error fetching the activity logs');
    } finally {
      setLoading(false);
    }
  }, [id, range]);

  useEffect(() => {
    fetchLogs(current, pageSize);
  }, [id, range, current, pageSize, fetchLogs]);

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length > 0) {
      setRange(dates);
      setCurrent(paginationInitialState.current); // Reset current page
      setPageSize(paginationInitialState.pageSize); // Reset page size
    } else {
      toast.error('Date Range cannot be empty');
    }
  };

  const handlePagination = (page: number, pageSize: number) => {
    setCurrent(page);
    setPageSize(pageSize);
  };

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Page',
      dataIndex: 'page',
      render: (_, { page }) => {
        return (
          page ? <div className='flex flex-col !gap-0'>
            <p className=' !text-base !text-black'>{formatToTitleCase(page)}</p>
          </div> :
            <div>
              <p className=' !text-base !text-black'>-</p>
            </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, { action }) => {
        const color = action ? actionColorMapping[action.toLowerCase()] || actionColorMapping['default'] : actionColorMapping['default'];
        return (
          action && <div className='flex flex-col !gap-0'>
            <Tag color={color} className=' w-min'>
              <p className=' !text-base !text-black inline-block'>{formatToTitleCase(action)}</p>
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'User Detail',
      dataIndex: 'user',
      render: (_, { user }) => {
        return (
          user ?
            <div className='flex gap-2 items-center'>
              <div className=' w-12 h-12'>
                <Image
                  src={user.profile ? user.profile : '/dummyAvatar.png'}
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <p className='!text-sm !text-[#000000e0]'>{user.firstName + ' ' + user.lastName}</p>
              </div>
            </div>
            :
            <div>
              <p className=' !text-base !text-black'>-</p>
            </div>
        );
      },
    },
    {
      title: 'Date',
      key: 'date',
      dataIndex: 'role',
      render: (_, { createdAt }) => {
        let { formattedDate, formattedTime } = formatDateTime(createdAt)
        return (
          <div className='flex flex-col !gap-0'>
            <h3>{formattedDate}</h3>
            <p className=' !text-xs'>{formattedTime}</p>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className=' flex flex-row justify-between items-center mb-10'>
        <h1 className="text-3xl font-semibold !mb-0">User Activity Logs</h1>
        <div className="flex flex-row gap-3 items-center">
          <p className="mb-0 font-semibold">Date Range: </p>
          <RangePicker onChange={handleRangeChange} showTime defaultValue={range} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={activityLogs}
        scroll={{ x: 500 }}
        loading={loading}
        pagination={{
          current,
          pageSize,
          total,
          onChange: handlePagination,
        }}
      />
    </div>
  );
}

export default withDashboardLayout(DeviceActivityLogView);
