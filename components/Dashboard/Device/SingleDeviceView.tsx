'use client'
import React from 'react'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import DeviceGraph from './DeviceGraph'


interface SingleDeviceViewProps {
  oem: string
}
const SingleDeviceView = ({ oem }: SingleDeviceViewProps) => {
  return (
    <>
      <div>
        <DeviceGraph oem={oem} />
      </div>
    </>
  )
}

export default withDashboardLayout(SingleDeviceView)