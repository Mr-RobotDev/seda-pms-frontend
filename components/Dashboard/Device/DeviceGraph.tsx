'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, DatePicker, Row, Spin, Button, Dropdown, Menu, Divider } from 'antd';
import axiosInstance from '@/lib/axiosInstance';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast';
import { DevicesType } from '@/type';
import Image from 'next/image';
import CountUp from 'react-countup';
import dynamic from 'next/dynamic';
import { CalendarIcon } from '@heroicons/react/20/solid';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
import ReactApexChart from 'react-apexcharts';
import { WifiIcon } from '@heroicons/react/16/solid';

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

const temperatureIcon = (
  <svg className="fill-white" width="30" height="30" viewBox="0 0 13 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.88282 6.61371V1.57427C7.88282 0.704811 7.178 0 6.30855 0C5.4391 0 4.73428 0.704811 4.73428 1.57427V6.61147C3.37358 7.47961 2.97426 9.28646 3.8424 10.6472C4.37814 11.4869 5.30466 11.9959 6.30072 11.9978L6.31638 12C7.93045 11.997 9.23644 10.6861 9.23342 9.07203C9.23154 8.07597 8.72251 7.14945 7.88282 6.61371ZM5.0789 11.2221C3.89406 10.538 3.48813 9.02299 4.17219 7.83818C4.38961 7.46159 4.70231 7.1489 5.0789 6.93147C5.14841 6.89133 5.1911 6.81703 5.19079 6.73678V1.57427C5.19079 0.952 5.69524 0.447552 6.3175 0.447552C6.93977 0.447552 7.44421 0.952 7.44421 1.57427V6.73678C7.44391 6.81703 7.48659 6.89133 7.5561 6.93147C8.74094 7.61552 9.14687 9.13057 8.46282 10.3154C7.77876 11.5002 6.26371 11.9062 5.0789 11.2221Z" />
    <path d="M6.54017 7.46856V4.07387C6.54017 3.95029 6.43997 3.8501 6.31639 3.8501C6.19281 3.8501 6.09262 3.95029 6.09262 4.07387V7.46856C5.24727 7.58979 4.66025 8.37334 4.78148 9.21868C4.89091 9.98171 5.54557 10.5476 6.31639 10.5455C7.17038 10.5478 7.86459 9.85745 7.86697 9.00347C7.86909 8.23264 7.30319 7.57799 6.54017 7.46856ZM6.31639 10.0957C5.70957 10.0957 5.21765 9.60378 5.21765 8.99695C5.21888 8.39066 5.71007 7.89944 6.31639 7.89821C6.92322 7.89821 7.41513 8.39013 7.41513 8.99695C7.41513 9.60378 6.92319 10.0957 6.31639 10.0957Z" />
    <path d="M10.0648 1.53857H8.66616C8.54258 1.53857 8.44238 1.63877 8.44238 1.76235C8.44238 1.88593 8.54258 1.98613 8.66616 1.98613H10.0648C10.1883 1.98613 10.2885 1.88593 10.2885 1.76235C10.2885 1.63877 10.1883 1.53857 10.0648 1.53857Z" />
    <path d="M9.7672 2.65723H8.94594C8.82236 2.65723 8.72217 2.75742 8.72217 2.881C8.72217 3.00458 8.82236 3.10478 8.94594 3.10478H9.7672C9.89078 3.10478 9.99098 3.00458 9.99098 2.881C9.99098 2.75742 9.89078 2.65723 9.7672 2.65723Z" />
    <path d="M10.0648 3.77637H8.66616C8.54258 3.77637 8.44238 3.87656 8.44238 4.00014C8.44238 4.12372 8.54258 4.22392 8.66616 4.22392H10.0648C10.1883 4.22392 10.2885 4.12372 10.2885 4.00014C10.2885 3.87656 10.1883 3.77637 10.0648 3.77637Z" />
    <path d="M9.7672 4.89502H8.94594C8.82236 4.89502 8.72217 4.99522 8.72217 5.1188C8.72217 5.24238 8.82236 5.34257 8.94594 5.34257H9.7672C9.89078 5.34257 9.99098 5.24238 9.99098 5.1188C9.99098 4.99522 9.89078 4.89502 9.7672 4.89502Z" />
    <path d="M10.0648 6.01416H8.66616C8.54258 6.01416 8.44238 6.11436 8.44238 6.23794C8.44238 6.36152 8.54258 6.46171 8.66616 6.46171H10.0648C10.1883 6.46171 10.2885 6.36152 10.2885 6.23794C10.2885 6.11436 10.1883 6.01416 10.0648 6.01416Z" />
  </svg>
);

const humidityIcon = (
  <svg className="fill-white" width="30" height="30" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_2426_3501)">
      <path d="M10.9944 3.82178C9.99262 3.82178 9.17803 4.6366 9.17803 5.6381C9.17803 5.88887 9.38112 6.09219 9.63211 6.09219C9.8831 6.09219 10.0862 5.88887 10.0862 5.6381C10.0862 5.13722 10.4937 4.72994 10.9944 4.72994C11.495 4.72994 11.9025 5.13722 11.9025 5.6381C11.9025 6.13898 11.495 6.54627 10.9944 6.54627H0.586406C0.335412 6.54627 0.132324 6.74958 0.132324 7.00035C0.132324 7.25112 0.335412 7.45443 0.586406 7.45443H10.9944C11.9961 7.45443 12.8107 6.63961 12.8107 5.6381C12.8107 4.6366 11.9961 3.82178 10.9944 3.82178Z" />
      <path d="M0.550273 5.63802H6.45333C7.45507 5.63802 8.26966 4.8232 8.26966 3.8217C8.26966 2.82019 7.45507 2.00537 6.45333 2.00537C5.4516 2.00537 4.63701 2.82019 4.63701 3.8217C4.63701 4.07246 4.8401 4.27578 5.09109 4.27578C5.34208 4.27578 5.54517 4.07246 5.54517 3.8217C5.54517 3.32082 5.95268 2.91353 6.45333 2.91353C6.95399 2.91353 7.3615 3.32082 7.3615 3.8217C7.3615 4.32258 6.95399 4.72986 6.45333 4.72986H0.550273C0.299279 4.72986 0.0961914 4.93318 0.0961914 5.18394C0.0961914 5.43471 0.299279 5.63802 0.550273 5.63802Z" />
      <path d="M6.45333 8.36279H0.550273C0.299279 8.36279 0.0961914 8.56611 0.0961914 8.81687C0.0961914 9.06764 0.299279 9.27096 0.550273 9.27096H6.45333C6.95399 9.27096 7.3615 9.67824 7.3615 10.1791C7.3615 10.68 6.95399 11.0873 6.45333 11.0873C5.95268 11.0873 5.54517 10.68 5.54517 10.1791C5.54517 9.92835 5.34208 9.72504 5.09109 9.72504C4.8401 9.72504 4.63701 9.92835 4.63701 10.1791C4.63701 11.1806 5.4516 11.9954 6.45333 11.9954C7.45507 11.9954 8.26966 11.1806 8.26966 10.1791C8.26966 9.17761 7.45507 8.36279 6.45333 8.36279Z" />
    </g>
    <defs>
      <clipPath id="clip0_2426_3501">
        <rect width="12.7143" height="12.7143" transform="translate(0.0961914 0.643066)" />
      </clipPath>
    </defs>
  </svg>
);

const commonChartOptions = {
  chart: {
    type: 'line',
    group: 'device',
    zoom: {
      enabled: true,
    },
    animations: {
      enabled: true,
    },
  },
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy HH:mm',
    },
    shared: true,
  },
  stroke: {
    width: 2, // Set the line thickness
    curve: 'smooth', // Optional: make the line smooth
    colors: ['#373737']
  },
  markers: {
    size: 4, // Size of the points on the line
    colors: ['#111111'], // Optional: custom color for the markers
    strokeWidth: 2, // Optional: width of the marker border
    hover: {
      size: 6
    }
  },
};

interface DeviceGraphProps {
  id: string;
}

const DeviceGraph = ({ id }: DeviceGraphProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [deviceOem, setDeviceOem] = useState<string>('');
  const [deviceData, setDeviceData] = useState<DevicesType>();
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(3, 'day').startOf('day'), dayjs().endOf('day')]);
  const [loading, setLoading] = useState<boolean>(true);
  const [graphloading, setGraphLoading] = useState<boolean>(false);
  const [currentPreset, setCurrentPreset] = useState<string>('Last 3 Days');

  const [temperatureData, setTemperatureData] = useState<DataPoint[]>([])
  const [humidityData, setHumidityData] = useState<DataPoint[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const to = params.get('to');
    if (from && to) {
      setRange([dayjs(from), dayjs(to)]);
    }
  }, []);

  const TemperatureChart = ({ data }: { data: any }) => {
    const options = {
      ...commonChartOptions,
      chart: {
        id: 'TemperatureChart',
        group: 'device',
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: false,
            pan: false,
            reset: true,
          },
        },
      },
      yaxis: {
        title: {
          text: 'Temperature (°C)',
        },
      },
      series: [
        {
          name: 'Temperature',
          data,
        },
      ]
    };
    return <ReactApexChart options={options as any} series={options.series} type="line" height={350} width={"100%"} />;
  };

  const HumidityChart = ({ data }: { data: any }) => {
    const options = {
      ...commonChartOptions,
      chart: {
        id: 'HumidityChart',
        group: 'device',
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: false,
            pan: false,
            reset: true,
          },
        },
      },
      yaxis: {
        title: {
          text: 'Humidity (%)',
        },
        labels: {
          formatter: (value: number) => `${value}%`
        },
      },
      series: [
        {
          name: 'Humidity',
          data,
        }
      ],
    };
    return <ReactApexChart options={options as any} series={options.series} type="line" height={350} width={"100%"} />;
  };


  const fetchData = useCallback(async (from: string, to: string) => {
    if (deviceOem) {
      try {
        setGraphLoading(true)
        const response = await axiosInstance.get(`/events?oem=${deviceOem}&from=${from}&to=${to}&limit=1000`);
        if (response.status === 200) {
          const sortedData = response.data.results.sort((a: DataPoint, b: DataPoint) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });

          const tempData = sortedData.map((point: DataPoint) => ({
            x: new Date(point.createdAt).getTime(),
            y: point.temperature
          }));

          const humidData = sortedData.map((point: DataPoint) => ({
            x: new Date(point.createdAt).getTime(),
            y: point.relativeHumidity
          }));

          setData(sortedData);
          setTemperatureData(tempData)
          setHumidityData(humidData)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setGraphLoading(false)
      }
    }
  }, [deviceOem]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(`/devices/${id}`);
        if (response.status === 200) {
          setDeviceOem(response.data.oem);
          setDeviceData(response.data);
        } else {
          console.log('error->', response);
        }
      } catch (error: any) {
        console.log('error->', error);
      }
    })();
  }, [id]);

  useEffect(() => {
    const from = dayjs(range[0].toISOString()).format('YYYY-MM-DD');
    const to = dayjs(range[1].toISOString()).format('YYYY-MM-DD');
    fetchData(from, to);

    if (window && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('from', from);
      url.searchParams.set('to', to);
      window.history.replaceState({}, '', url.toString());
    }

  }, [range, fetchData]);

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      let newRange: [Dayjs, Dayjs];
      newRange = [dayjs(dates[0]), dayjs(dates[1])];
      setRange(newRange);
      const from = newRange[0].format('YYYY-MM-DD');
      const to = newRange[1].format('YYYY-MM-DD');
      if (window && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set('from', from);
        url.searchParams.set('to', to);
        window.history.replaceState({}, '', url.toString());
      }
    } else {
      toast.error('Date Range cannot be empty');
    }
  };

  const handleDatePreset = (preset: string) => {
    let newRange: [Dayjs, Dayjs];
    switch (preset) {
      case 'Today':
        newRange = [dayjs().startOf('day'), dayjs().endOf('day')];
        break;
      case 'Yesterday':
        newRange = [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')];
        break;
      case 'This Week':
        newRange = [dayjs().startOf('week'), dayjs().endOf('week')];
        break;
      case 'Last Week':
        newRange = [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')];
        break;
      case 'Last 3 Days':
        newRange = [dayjs().subtract(3, 'day').startOf('day'), dayjs().endOf('day')];
        break;
      case 'Last 7 Days':
        newRange = [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')];
        break;
      case 'Last 30 Days':
        newRange = [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')];
        break;
      default:
        newRange = [dayjs().startOf('day'), dayjs().endOf('day')];
    }
    setRange(newRange);
    const from = newRange[0].format('YYYY-MM-DD');
    const to = newRange[1].format('YYYY-MM-DD');
    if (window && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('from', from);
      url.searchParams.set('to', to);
      window.history.replaceState({}, '', url.toString());
    }
    setCurrentPreset(preset);
  };

  const menu = (
    <Menu>
      {['Today', 'Yesterday', 'This Week', 'Last Week', 'Last 3 Days', 'Last 7 Days', 'Last 30 Days'].map((preset) => (
        <Menu.Item key={preset} onClick={() => handleDatePreset(preset)} style={{ fontWeight: preset === currentPreset ? 'bold' : 'normal' }}>
          {preset}
        </Menu.Item>
      ))}
      <Divider className=' h-[1px] bg-[#111111] !m-0' />
      <Menu.Item key='custom' onClick={() => setCurrentPreset('Custom')}>
        Custom
      </Menu.Item>
    </Menu>
  );

  return (
    loading ?
      <div className='flex justify-center items-center h-full mt-20'>
        <Spin size="large" />
      </div>
      :
      <>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-3 md:px-8 lg:px-16 mx-auto mb-14'>
          <div className=' h-full'>
            <Card bordered={false} className="criclebox h-full">
              <div className=" text-2xl flex flex-row justify-between">
                <div>
                  <span className=" text-lg">Name</span>
                  <div className="">
                    <span className="">
                      <p className='!text-2xl !font-bold !mb-0'>{deviceData?.name}</p>
                    </span>
                  </div>
                </div>
                <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                  <Image src={deviceData?.type === 'cold' ? '/snowflake.png' : '/thermometer-1.png'} className=' w-full h-full' alt='icon' width={100} height={100} />
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card bordered={false} className="criclebox h-full">
              <div className=" text-2xl flex flex-row justify-between">
                <div>
                  <span className=" text-lg !mb-0">Highest Temperature</span>
                  <div className="text-2xl font-bold">
                    <span className="!text-3xl !font-bold">
                      <CountUp decimals={2} end={deviceData?.temperature as number} duration={2} />
                    </span>
                  </div>
                </div>
                <div className="icon-box flex items-center justify-center">
                  {temperatureIcon}
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card bordered={false} className="criclebox h-full">
              <div className=" text-2xl flex flex-row justify-between">
                <div>
                  <span className=" text-lg !mb-0">Highest Relative Humidity</span>
                  <div className="">
                    <span className="!text-3xl !font-bold">
                      <CountUp decimals={2} end={deviceData?.relativeHumidity as number} duration={2} />
                    </span>
                  </div>
                </div>
                <div className="icon-box flex items-center justify-center">
                  {humidityIcon}
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card bordered={false} className="criclebox h-full">
              <div className=" text-2xl flex flex-row justify-between">
                <div>
                  <span className=" text-lg">{deviceData?.isOffline ? 'Connectivity' : 'Signal Strength'}</span>
                  <div className="">
                    <span className="!text-3xl !font-bold">
                      {deviceData?.signalStrength && <CountUp end={deviceData?.signalStrength as number} duration={2} />}
                      {!deviceData?.signalStrength && <p className='!text-2xl !font-bold !mb-0'>Offline</p>}
                    </span>
                  </div>
                </div>
                <div className="icon-box flex items-center justify-center">
                  <WifiIcon width={20} />
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div>
          <div className='px-3 md:px-16 mx-auto'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-end'>
                <div className=' flex flex-row gap-3 items-center justify-center'>
                  <div className={`flex-row gap-3 items-center ${currentPreset === 'Custom' ? 'flex' : 'hidden'}`} >
                    <p className='!m-0 font-semibold'>Date Range</p>
                    <RangePicker onChange={handleRangeChange} defaultValue={range} />
                  </div>
                  <Dropdown overlay={menu} placement="bottomRight" arrow>


                    <Button className=' flex flex-row gap-2 items-center'>
                      <CalendarIcon width={20} />
                      <p className='!m-0'>{currentPreset}</p>
                    </Button>

                  </Dropdown>
                </div>
              </div>
              <div className=' w-full h-[700px]'>
                {graphloading ? (
                  <div className='flex justify-center items-center h-full'>
                    <Spin size="large" />
                  </div>
                ) : data.length === 0 ? (
                  <div className='flex justify-center items-center h-full'>
                    <p>No data available for the selected date range</p>
                  </div>
                ) : (
                  <>
                    <div className=' h-[350px]'>
                      {temperatureData.length !== 0 && <TemperatureChart data={temperatureData} />}
                    </div>
                    <div className=' h-[350px]'>
                      {humidityData.length !== 0 && <HumidityChart data={humidityData} />}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default DeviceGraph;
