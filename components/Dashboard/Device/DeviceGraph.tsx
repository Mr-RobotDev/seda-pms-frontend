import React, { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Col, DatePicker, Spin } from 'antd';
import axiosInstance from '@/lib/axiosInstance';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast';
import { DevicesType } from '@/type';
import Image from 'next/image';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface DataPoint {
  oem: string;
  eventType: string;
  temperature: number;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

const formatDate = (timestamp: string, isLargeRange: boolean) => {
  return dayjs(timestamp).format(isLargeRange ? 'DD MMM' : 'HH:mm');
};

const filterDataByDateRange = (data: DataPoint[], range: [Dayjs, Dayjs]) => {
  const start = range[0].startOf('day');
  const end = range[1].endOf('day');
  return data.filter(point => dayjs(point.createdAt).isBetween(start, end));
};

const prepareChartData = (data: DataPoint[], range: [Dayjs, Dayjs]) => {
  // const filteredData = filterDataByDateRange(data, range);
  const isLargeRange = range[1].diff(range[0], 'days') >= 1;
  return data.map(point => ({
    ...point,
    createdAt: formatDate(point.createdAt, isLargeRange),
  }));
};

interface DeviceGraphProps {
  id: string;
}

const DeviceGraph = ({ id }: DeviceGraphProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [deviceOem, setDeviceOem] = useState()
  const [deviceData, setDeviceData] = useState<DevicesType>()
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'day'), dayjs()]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (from: string, to: string) => {
    if (deviceOem) {
      try {
        const response = await axiosInstance.get(`/events?oem=${deviceOem}&limit=1000`, {
          params: { from, to },
        });
        if (response.status === 200) {
          // Sort the data based on createdAt before storing it in the state
          const sortedData = response.data.results.sort((a: DataPoint, b: DataPoint) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          setData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [deviceOem])

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(`/devices/${id}`)
        if (response.status === 200) {
          setDeviceOem(response.data.oem)
          setDeviceData(response.data)
        } else {
          console.log('error->', response)
        }
      } catch (error: any) {
        console.log('error->', error)
      }
    })()
  }, [id])

  useEffect(() => {
    const from = dayjs(range[0].toISOString()).format('YYYY-MM-DD')
    const to = dayjs(range[1].toISOString()).format('YYYY-MM-DD')
    fetchData(from, to);
  }, [range, fetchData]);

  useEffect(() => {
    console.log(data)
  }, [data])

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      setRange([dayjs(dates[0]), dayjs(dates[1])]);
    } else {
      toast.error('Date Range cannot be empty')
    }
  };

  return (
    loading ?
      <div className=' flex justify-center items-center h-full mt-20'>
        <Spin size="large" />
      </div>
      :
      <>
        <Col span={24} md={14} lg={8} className="mb-24">
          <Card>
            <div className=' flex justify-between'>
              <h2 className=' text-xl font-semibold mb-2'>{deviceData?.name}</h2>
              <div className='w-8 h-8'>
                <Image src={deviceData?.type === 'cold' ? '/snowflake.png' : '/thermometer-1.png'} className=' w-full h-full' alt='icon' width={100} height={100} />
              </div>
            </div>
            <p>Temperature: <strong>{deviceData?.temperature}</strong></p>
            <p>Relative Humidity: <strong>{deviceData?.relativeHumidity}</strong></p>
          </Card>
        </Col>
        <Card>
          <h1 className=" text-xl font-semibold">Device</h1>
          <div className='px-3 md:px-16 mx-auto'>
            <div className='flex flex-col gap-10'>
              <div className='flex justify-end'>
                <div className=' flex flex-row gap-3 items-center justify-center'>
                  <p className='!m-0 font-semibold'>Date Range</p>
                  <RangePicker onChange={handleRangeChange} defaultValue={range} />
                </div>
              </div>
              <div style={{ width: '100%', height: 400 }}>
                {loading ? (
                  <div className='flex justify-center items-center h-full'>
                    <Spin size="large" />
                  </div>
                ) : data.length === 0 ? (
                  <div className='flex justify-center items-center h-full'>
                    <p>No data available for the selected date range</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData(data, range)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="createdAt" interval={10}/>
                      <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="relativeHumidity" strokeWidth={2} stroke="#82ca9d" />
                      <Line yAxisId="left" type="monotone" dataKey="temperature" strokeWidth={2} stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </Card>
      </>
  );
};

export default DeviceGraph;
