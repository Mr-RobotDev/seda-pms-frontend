import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DashboardType, ReportsType } from '@/type'
import axiosInstance from '@/lib/axiosInstance'
import { Button, Card, Checkbox, Spin, Switch, Table, TableProps } from 'antd'
import { ArrowLeftIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline'
import { PrimaryInput } from '@/components/ui/Input/Input'
import { scheduletypeOptions, timeFrameOptions } from '@/utils/form'
import CustomTags from './CustomTags'
import WrappedSelect from '@/components/ui/Select/WrappedSelect'
import toast from 'react-hot-toast'
import TimeFrameMenu from '../dashboardViews/TimeFrameMenu'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'
import NoReport from './NoReport'

interface ReportsTableProps {
  currentDashboard: DashboardType
  createNewReport: boolean
  setCreateNewReport: Dispatch<SetStateAction<boolean>>
}

const emptyReportState: ReportsType = {
  name: '',
  timeframe: '',
  recipients: [],
  scheduleType: '',
  enabled: false,
  weekdays: [],
  times: [],
  id: ''
}

const ReportsTable = ({ currentDashboard, setCreateNewReport, createNewReport }: ReportsTableProps) => {
  const [reports, setReports] = useState<ReportsType[]>([])
  const [showDetailsReport, setShowDetailsReport] = useState<ReportsType | null>()
  const [formData, setFormData] = useState<ReportsType | null>(null)
  const [loading, setLoading] = useState(false)
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const { timeFrame } = useSelector((state: RootState) => state.dashboardReducer)

  useEffect(() => {
    if (showDetailsReport) {
      setFormData(showDetailsReport)
      setCreateNewReport(false)
    }
  }, [showDetailsReport, setCreateNewReport])

  useEffect(() => {
    if (currentDashboard.id !== '') {

      (async () => {
        try {
          setLoading(true)
          const response = await axiosInstance.get(`/dashboards/${currentDashboard.id}/reports`)
          if (response.status === 200) {
            setReports(response.data.results);
          } else {
            console.log("error ->", response);
          }
        } catch (error: any) {
          console.log('Error:', error);
        } finally {
          setLoading(false);
        }
      })()
    }
  }, [currentDashboard])

  useEffect(() => {
    if (createNewReport) {
      setFormData(emptyReportState)
    }
  }, [createNewReport, setCreateNewReport])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox && (e.target as HTMLInputElement).checked;

    setFormData(prevState => prevState && {
      ...prevState,
      [name]: isCheckbox ? checked : value
    });
  };

  const handleDeleteReport = async (e: any, reportId: string) => {
    e.stopPropagation()
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/dashboards/${currentDashboard.id}/reports/${reportId}`)
      if (response.status === 200) {
        const updatedReports = reports.filter(report => report.id !== reportId)
        setReports(updatedReports)
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  const handleSwitchChange = (checked: boolean) => {
    setFormData(prevState => prevState && { ...prevState, enabled: checked });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SCHEDULE TYPE",
      key: "scheduleType",
      dataIndex: "scheduleType",
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
      title: "TIMEFRAME",
      key: "timeframe",
      dataIndex: "timeframe",
      render: (_, { timeframe }) => (
        <div className="flex flex-row gap-4 items-center">
          <p className=' !text-black !mb-0'>{timeFrameOptions.find(option => option.value === timeframe)?.label}</p>
        </div>
      ),
    },
    {
      title: "ENABLED",
      key: "enabled",
      dataIndex: "enabled",
      render: (_, { enabled }) => (
        <div className="flex flex-row gap-4 items-center">
          <Switch disabled={true} checked={enabled} />
        </div>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      dataIndex: "aactions",
      render: (_, { id }) => {
        return (
          <div className=" flex flex-row gap-4 items-center">
            <p
              onClick={(e) => handleDeleteReport(e, id)}
              className="!  text-red-400 hover:text-red-600 duration-200 transition-all transform cursor-pointer flex flex-row gap-2 items-center"
            >
              <TrashIcon width={20} />
            </p>
          </div>
        );
      },
    },
  ];

  const showReportsDetails = (record: ReportsType) => ({
    onClick: () => setShowDetailsReport(record),
  });

  const handleChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => prevState && { ...prevState, [name]: value });
  };

  const handleGoBack = () => {
    setCreateNewReport(false);
    setShowDetailsReport(null);
  };

  const handleUpdateReport = async () => {
    if (formData) {
      setLoading(true);
      const dataToSend = { ...formData };
      dataToSend.timeframe = timeFrame.key
      delete dataToSend.dashboard;

      try {
        const response = await axiosInstance.patch(`/dashboards/${currentDashboard.id}/reports/${dataToSend.id}`, dataToSend);
        if (response.status === 200) {
          console.log(response)
          setReports(prevReports => prevReports.map(report => report.id === formData.id ? response.data : report));
          setShowDetailsReport(null);
          toast.success('Report Updated Successfully')
        } else {
          console.log("error ->", response);
        }
      } catch (error) {
        console.log('error->', error)
      } finally{
        setLoading(false)
      }
    }
  }

  const handleCreateReport = async () => {
    if (formData) {
      setLoading(true)
      formData.timeframe = timeFrame.key
      try {
        const response = await axiosInstance.post(`/dashboards/${currentDashboard.id}/reports`, formData);
        if (response.status === 201) {
          setReports(prevReports => [...prevReports, response.data]);
          setShowDetailsReport(null);
          setCreateNewReport(false);
          toast.success('Report added successfully')
        } else {
          console.log("error ->", response);
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDaysCheckbox = (e: any, day: string) => {
    const checked = e.target.checked;
    setFormData(prevState => {
      if (prevState) {
        const newWeekdays = checked ? [...prevState.weekdays, day] : prevState.weekdays.filter(d => d !== day);
        return { ...prevState, weekdays: newWeekdays };
      }
      return prevState;
    });
  };

  const renderCheckboxes = () => daysOfWeek.map(day => (
    <Checkbox
      key={day}
      name="weekdays"
      checked={
        (day !== 'saturday' && day !== 'sunday' && (isWeekdaysScheduleType || isEverydayScheduleType)) ||
        (day === 'saturday' || day === 'sunday') && isEverydayScheduleType ||
        formData?.weekdays.includes(day)
      }
      disabled={!isCustomScheduleType}
      onChange={(e) => handleDaysCheckbox(e, day)}
    >
      {day.charAt(0).toUpperCase() + day.slice(1)}
    </Checkbox>
  ));

  const isCustomScheduleType = formData?.scheduleType === 'custom';
  const isWeekdaysScheduleType = formData?.scheduleType === 'weekdays';
  const isEverydayScheduleType = formData?.scheduleType === 'everyday';

  return (
    <div className='mt-6'>
      <div >
        <div className={`${showDetailsReport || createNewReport ? 'hidden' : 'block'}`}>
          {
            reports.length > 0 ?
              <div className=' shadow-md p-2 bg-white'>
                <Table
                  columns={columns}
                  className='cursor-pointer h-full'
                  dataSource={reports}
                  scroll={{ x: 500 }}
                  rowClassName='overflow-hidden'
                  loading={loading}
                  onRow={showReportsDetails}
                />
              </div> :
              <NoReport />
          }

        </div>
        <div className={`${showDetailsReport || createNewReport ? 'block' : 'hidden'}`}>
          <div className='container px-24'>
            <div className='text-blue-500 hover:underline cursor-pointer flex flex-row gap-2 items-center' onClick={handleGoBack}>
              <ArrowLeftIcon width={12} />
              <p className='!mb-0 text-blue-500 cursor-pointer'>Back to full list</p>
            </div>
            <Spin spinning={loading}>
              <div>
                <Card>
                  <div className='flex flex-row items-center gap-4'>
                    <div className='flex-1'>
                      <p className='font-semibold text-lg !mb-1'>Name</p>
                      <PrimaryInput name="name" value={formData?.name} onChange={onChange} />
                    </div>
                    <div className='px-8'>
                      <p className='font-semibold text-lg !mb-1'>Enabled</p>
                      <Switch checked={formData?.enabled} onChange={handleSwitchChange} />
                    </div>
                  </div>
                </Card>
                <div className='flex items-center justify-center'>
                  <div className='w-[2px] h-[40px] bg-slate-300'></div>
                </div>
                <Card>
                  <p className='font-semibold text-lg'>Recipient Emails</p>
                  {formData?.recipients && <CustomTags recipientEamils={formData?.recipients} type='email' setFormData={setFormData} />}
                </Card>
                <div className='flex items-center justify-center'>
                  <div className='w-[2px] h-[40px] bg-slate-300'></div>
                </div>
                <Card>
                  <div className='flex flex-row justify-between'>
                    <p className='font-semibold text-lg'>Schedule</p>
                    <div>
                      <p className='!mb-1 text-sm'>Time Frame: </p>
                      <div className='flex flex-row items-center border rounded-md shadow-md w-[170px]'>
                        <TimeFrameMenu functionality={false} initialValue={formData?.timeframe} />
                      </div>
                      {/* <WrappedSelect name="timeframe" options={timeFrameOptions} className='w-52' value={formData?.timeframe} onChange={onChange} /> */}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <p className='!mb-1 text-sm'>Type: </p>
                  </div>
                  <div className='flex flex-row items-center gap-12'>
                    <WrappedSelect name="scheduleType" options={scheduletypeOptions} className='w-52' value={formData?.scheduleType as string} onChange={handleChangeSelect} />
                    <div className='flex flex-row justify-between w-full'>
                      {renderCheckboxes()}
                    </div>
                  </div>
                  <div>
                    <p className='font-semibold text-lg my-6'>Time</p>
                    {formData?.times && <CustomTags recipientEamils={formData?.times} type='time' setFormData={setFormData} />}
                  </div>
                </Card>
                <div className=' flex flex-row justify-end mt-4'>
                  {!createNewReport && <Button onClick={handleUpdateReport} className=' w-32'>Update</Button>}
                  {createNewReport && <Button onClick={handleCreateReport} className=' w-32'>Create</Button>}
                </div>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsTable;
