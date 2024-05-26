'use client'
import React from 'react'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import DevicesTable from './DevicesTable'

const DeviceMainView = () => {
  return (
    <>
      <h1 className=" text-3xl font-semibold">Devices</h1>
      <DevicesTable />
    </>
  )
}

export default withDashboardLayout(DeviceMainView)