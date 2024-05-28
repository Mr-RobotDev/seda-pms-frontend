'use client'
import React, { useEffect, useState, useCallback } from 'react';
import withDashboardLayout from '@/hoc/withDashboardLayout';
import axiosInstance from '@/lib/axiosInstance';
import { DatePicker, Table, TableProps, Tag } from 'antd';
import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { formatDateTime, formatToTitleCase } from '@/lib/helperfunctions';
import './UserTable.css';

const { RangePicker } = DatePicker;

interface UserActivityLogProps {
  id: string;
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

const UserActivityLog = ({ id }: UserActivityLogProps) => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState(paginationInitialState);

  const actionColorMapping: { [key: string]: string } = {
    'viewed': 'blue',
    'logged in': 'green',
    'created': 'volcano',
    'updated': 'orange',
    'default': 'gray',
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
          user: id,
        },
      });
      if (response.status === 200) {
        if(pagination.current === response.data.pagination.current) {
          return;
        }
        setActivityLogs(response.data.results);
        
        setPagination({
          current: response.data.pagination.page,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.totalResults,
        });
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
    fetchLogs(pagination.current, pagination.pageSize);
  }, [id, range, pagination.current, pagination.pageSize, fetchLogs]);

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length > 0) {
      setRange(dates);
      setPagination(paginationInitialState); // Reset pagination
    } else {
      toast.error('Date Range cannot be empty');
    }
  };

  const handlePagination = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
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
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePagination,
        }}
      />
    </div>
  );
};

export default withDashboardLayout(UserActivityLog);
