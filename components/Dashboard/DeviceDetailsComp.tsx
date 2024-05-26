import Link from 'next/link';
import React from 'react'

interface DeviceDetailsCompProps {
  device: {
    oem: string;
    name: string;
    type: string;
    temperature: number;
    relativeHumidity: number;
    location: {
      lat: number;
      long: number;
    };
  }
}

const DeviceDetailsComp = ({ device }: DeviceDetailsCompProps) => {
  return (
    <div className=' w-48'>
      <div className=' flex flex-col gap-2'>
        <p className='!m-0 text-center bg-slate-700 text-white py-2 rounded-lg font-semibold'>{device.name}</p>
        <p className='!m-0'>Temperature: <strong>{device.temperature}</strong></p>
        <p className='!m-0'>Relative Humidity: <strong>{device.relativeHumidity}</strong></p>
        <div className=' duration-150 transition-all hover:underline'>
          <Link href={`/dashboard/devices/${device.oem}`}>Show More Details</Link>
        </div>
      </div>
    </div>
  )
}

export default DeviceDetailsComp