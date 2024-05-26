import React, { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, DatePicker, Spin } from 'antd';
import axiosInstance from '@/lib/axiosInstance';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast';

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
  return dayjs(timestamp).format(isLargeRange ? 'YYYY-MM-DD' : 'HH:mm');
};

const filterDataByDateRange = (data: DataPoint[], range: [Dayjs, Dayjs]) => {
  const start = range[0].startOf('day');
  const end = range[1].endOf('day');
  return data.filter(point => dayjs(point.createdAt).isBetween(start, end));
};

const prepareChartData = (data: DataPoint[], range: [Dayjs, Dayjs]) => {
  const filteredData = filterDataByDateRange(data, range);
  const isLargeRange = range[1].diff(range[0], 'days') > 1;
  return filteredData.map(point => ({
    ...point,
    createdAt: formatDate(point.createdAt, isLargeRange),
  }));
};

interface DeviceGraphProps {
  oem: string;
}

const DeviceGraph = ({ oem }: DeviceGraphProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'day'), dayjs()]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/events?oem=${oem}&limit=1000`, {
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
  }, [oem])

  useEffect(() => {
    const from = range[0].toISOString();
    const to = range[1].toISOString();
    fetchData(from, to);
  }, [range, fetchData]);

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      setRange([dayjs(dates[0]), dayjs(dates[1])]);
    } else {
      toast.error('Date Range cannot be empty')
    }
  };

  const chartData = prepareChartData(data, range);

  return (
    <Card>
      <h1 className=" text-xl font-semibold">Device</h1>
      <div className=' px-16 mx-auto'>
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
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdAt" />
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
  );
};

export default DeviceGraph;
