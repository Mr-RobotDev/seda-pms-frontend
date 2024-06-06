'use client'
import React, { useEffect, useState } from 'react';
import SingleAlertDetailsView from '@/components/Dashboard/alerts/SingleAlertDetailsView';
import { AlertDataType, DevicesType } from '@/type';
import axiosInstance from '@/lib/axiosInstance';
import { Spin } from 'antd';

const fetchAlertRecord = async (id: string) => {
  const response = await axiosInstance.get(`/alerts/${id}`)
  return response.data
};

const fetchDevice = async (id: string) => {
  const response = await axiosInstance.get(`/devices/${id}`)
  return response.data
};

const SingleAlertPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [alert, setAlert] = useState<AlertDataType>()
  const [device, setDevice] = useState<DevicesType>()

  useEffect(() => {
    (async () => {
      try {
        const alertRecord = await fetchAlertRecord(id);
        const deviceRecord = await fetchDevice(alertRecord.device.id);
        setAlert(alertRecord)
        setDevice(deviceRecord)
      } catch (error) {
        console.log('Error->', error);
      }
    })()
  }, [id])

  if(!alert || !device){
    return (
      <div className=' w-full h-full flex justify-center items-center'>
        <Spin />
      </div>
    )
  }


  return (
    <div>
      {alert && device && <SingleAlertDetailsView alert={alert} device={device} creatingNewAlert={false} />}
    </div>
  );
};

export const fetchCache = 'force-no-store';
export default SingleAlertPage;
