import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps { }

const DeviceStatsPieChart: React.FC<ApexChartProps> = () => {
  const devicesStats = useSelector((state: RootState) => state.statisticsReducer)

  const [series] = useState<number[]>([devicesStats.online, devicesStats.offline]);
  const [options] = useState<any>({
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Online', 'Offline'],
    colors: ['#008FFB', '#FF4560'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });

  return (
    <div id="chart" className=' w-full h-[400px]'>
      <ReactApexChart options={options} series={series} type="pie" width={'100%'} height={'100%'} />
    </div>
  );
};

export default DeviceStatsPieChart;
