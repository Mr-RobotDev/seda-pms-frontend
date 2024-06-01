import axiosInstance from '@/lib/axiosInstance';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface SensorSelectorProps {
  selectedSensors: string[];
  setSelectedSensors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRowKeys: React.Key[];
}

const SensorSelector = ({selectedRowKeys, selectedSensors, setSelectedSensors}:SensorSelectorProps) => {

  const handleClick = (field: string) => {
    if (selectedRowKeys.length > 1 && selectedSensors.length === 1 && !selectedSensors.includes(field)) {
      toast.error('Cannot select Multiple Sensors for more than one devices')
      return; // Prevent selecting another sensor if one is already selected and selectedRowKeys length is 1
    }

    setSelectedSensors((prevSensors) => {
      if (prevSensors.includes(field)) {
        return prevSensors.filter(sensor => sensor !== field);
      } else {
        return [...prevSensors, field];
      }
    });
  };

  useEffect(() => {
    setSelectedSensors([]);
  }, [selectedRowKeys, setSelectedSensors]);

  return (
    <div className='flex flex-col gap-4 mt-6'>
      <div 
        onClick={() => handleClick('temperature')} 
        className={`flex flex-row items-center border rounded-lg p-3 gap-3 cursor-pointer duration-300 transition-all transform group ${
          selectedSensors.includes('temperature') ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-blue-100 hover:border-blue-300'
        }`}
      >
        <div className={`w-12 h-12 border rounded-md p-2 duration-300 transition-all ${selectedSensors.includes('temperature') ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 group-hover:bg-blue-100 group-hover:border-blue-300'}`}>
          <Image src='/thermometer-1.png' alt='Temperature' width={100} height={100} />
        </div>
        <p className='!mb-0 text-lg font-semibold'>Temperature Sensors</p>
      </div>
      <div 
        onClick={() => handleClick('relativeHumidity')} 
        className={`flex flex-row items-center border rounded-lg p-3 gap-3 cursor-pointer duration-300 transition-all transform group ${
          selectedSensors.includes('relativeHumidity') ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-blue-100 hover:border-blue-300'
        }`}
      >
        <div className={`w-12 h-12 border rounded-md p-2 duration-300 transition-all ${selectedSensors.includes('relativeHumidity') ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 group-hover:bg-blue-100 group-hover:border-blue-300'}`}>
          <Image src='/snowflake.png' alt='Relative Humidity' width={100} height={100} />
        </div>
        <p className='!mb-0 text-lg font-semibold'>Relative Humidity Sensors</p>
      </div>
    </div>
  );
};

export default SensorSelector;
