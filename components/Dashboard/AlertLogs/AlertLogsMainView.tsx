'use client'
import { RootState } from '@/app/store/store';
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper';
import withDashboardLayout from '@/hoc/withDashboardLayout'
import axiosInstance from '@/lib/axiosInstance';
import { formatDateTime } from '@/utils/helper_functions';
import { Button, Card, Checkbox, DatePicker, Modal, Table, TableProps } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const { RangePicker } = DatePicker;

const AlertLogsMainView = () => {

  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'day').startOf('day'),
    dayjs().startOf('day').add(1, 'day').subtract(1, 'millisecond'),
  ]);

  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  const [alertLogs, setAlertLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const initialFetchRef = useRef(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [alertLogId, setAlertLogId] = useState('');

  const showModal = (alertLogId: string, alertlogNotes: string) => {
    setNotes(alertlogNotes || '')
    setAlertLogId(alertLogId)
    setIsModalOpen(true);
  };

  const fetchLogs = useCallback(
    async (page: number, limit: number) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/alertLogs`, {
          params: {
            from: range[0].format('YYYY-MM-DD'),
            to: range[1].format('YYYY-MM-DD'),
            page,
            limit,
          },
        });
        if (response.status === 200) {
          console.log(response.data);
          setAlertLogs(response.data.results)
          setCurrentPage(response.data.pagination.page);
          setPageSize(response.data.pagination.limit);
          setTotalItems(response.data.pagination.totalResults);
        } else {
          toast.error("Error fetching the activity logs");
        }
      } catch (error) {
        toast.error("Error fetching the activity logs");
      } finally {
        setLoading(false);
      }
    },
    [range]
  );

  useEffect(() => {
    fetchLogs(currentPage, pageSize);
  }, [fetchLogs, currentPage, pageSize]);

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length > 0) {
      setRange(dates);
      setAlertLogs([]);
      initialFetchRef.current = true;
    } else {
      toast.error("Date Range cannot be empty");
    }
  };

  const handleUpdateLogNotes = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.patch(`/alertLogs/${alertLogId}`, {
        notes: notes
      })

      if (response.status === 200) {
        toast.success("Notes updated successfully");
        fetchLogs(currentPage, pageSize);
      }

    } catch (error) {
      console.log(error)
      toast.error("Error updating notes");
    } finally {
      setLoading(false)
      setIsModalOpen(false);
    }
  }

  const handleAlertLogAccepted = async (e: any, id: string, accepted: boolean) => {
    e.stopPropagation();
    e.preventDefault();
    if (accepted) {
      return;
    }

    try {
      setLoading(true)
      const response = await axiosInstance.patch(`/alertLogs/${id}/accept`)

      if (response.status === 200) {
        toast.success("Log Accepted");

        const responseNote = response.data
        setAlertLogs((prevState) =>
          prevState.map((item) =>
            item.id === id
              ? { ...item, ...responseNote, accepted: true }
              : item
          )
        );
      }

    } catch (error) {
      console.log(error)
      toast.error("Error accepting the log");
    } finally {
      setLoading(false)
    }
  }

  const columns: TableProps<any>["columns"] = [
    {
      title: "ALERT NAME",
      dataIndex: "name",
      render: (_, { alert: { name } }) => (
        <p className='!text-black'>{name}</p>
      ),
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      render: (_, { createdAt }) => {
        const formatedDateTime = formatDateTime(createdAt)
        return (
          <p className='!text-black'>{formatedDateTime.formattedDate} {formatedDateTime.formattedTime}</p>
        )
      },
    },
    {
      title: "ACCEPTED BY",
      dataIndex: "acceptedBy",
      render: (_, { user }) => {
        return (
          user ? <p className='!text-black'>{user.firstName + ' ' + user.lastName}</p> : <p className='text-black'>-</p>
        )
      },
    },
    {
      title: "NOTES",
      dataIndex: "notes",
      render: (_, { id, notes }) => {
        return (
          <Button type='link' onClick={() => showModal(id, notes || '')}>Show & Edit Note</Button>
        )
      },
    },
  ];

  if (isAdmin) {
    columns.push(
      {
        title: "ACCEPTED",
        dataIndex: "accepted",
        render: (_, { id, accepted }) => {
          return (
            <Checkbox className='ml-3' onClick={e => e.stopPropagation()} onChange={(e) => handleAlertLogAccepted(e, id, accepted)} disabled={accepted} checked={accepted} />
          )
        },
      },
    )
  }

  const handleTablePaginationChange = (newPagination: any) => {
    setCurrentPage(newPagination);
    setPageSize(10);
  }


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div className=" flex flex-row w-full flex-wrap md:w-auto justify-between items-center !mb-4 md:!mb-0">
          <h1 className="text-2xl sm:text-3xl font-semibold !mb-0">
            Alert Logs
          </h1>
        </div>
        <div className=" flex flex-col md:flex-row items-end gap-4 w-full md:w-auto">
          <div className=" w-full md:w-auto order-2 md:order-1">
            <p className=" text-sm mb-1">Date Range:</p>
            <RangePicker
              onChange={handleRangeChange}
              defaultValue={range}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <LoadingWrapper loading={loading}>
        <Table
          columns={columns}
          className="cursor-pointer h-full"
          dataSource={alertLogs}
          scroll={{ x: 500 }}
          rowClassName="overflow-hidden cursor-default"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            onChange: handleTablePaginationChange,
          }}
        />
      </LoadingWrapper>


      <Modal title="Alert Notes" open={isModalOpen} onOk={handleUpdateLogNotes} okText="Update" onCancel={handleCancel}>
        <LoadingWrapper loading={loading}>
          <div>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              className=" !text-black !font-medium"
              placeholder="Add Notes for Alert Logs"
              name="change"
            />
          </div>
        </LoadingWrapper>
      </Modal>

    </Card>
  )
}

export default withDashboardLayout(AlertLogsMainView)