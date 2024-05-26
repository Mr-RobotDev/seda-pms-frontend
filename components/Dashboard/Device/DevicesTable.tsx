import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import type { TableProps } from 'antd';
import axiosInstance from '@/lib/axiosInstance';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DevicesType } from '@/type';

const columns: TableProps<DevicesType>['columns'] = [
  {
    title: 'Name',
    render: (_, { type, name }) => (
      <div className=' flex flex-row items-center gap-7'>
        <div className=' w-5 h-5'>
          <Image src={type === 'cold' ? '/snowflake.png' : '/thermometer-1.png'} alt='icon' width={100} height={100} />
        </div>
        <p className=' !text-black'>{name}</p>
      </div>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Temperature',
    dataIndex: 'temperature',
    key: 'temperature',
  },
  {
    title: 'Relative Humidity',
    key: 'relativeHumidity',
    dataIndex: 'relativeHumidity',
  },
];

const DevicesTable = () => {
  const [devices, setDevices] = useState<DevicesType[]>([])
  const router = useRouter()
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/devices?page=1&limit=20");
        if (response.status === 200) {
          setDevices(response.data.results);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onRowClick = (record: DevicesType) => {
    return{
      onClick: () => {
        router.push(`/dashboard/devices/${record.id}`)
      }
    }
  }

  return (
    <div className=' p-4 md:p-16'>
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        onRow={onRowClick}
        loading={devices.length === 0}
        className='cursor-pointer'
      />;
    </div>
  )
}

export default DevicesTable