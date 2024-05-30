import React from 'react'
import DeviceActivityLogView from '@/components/Dashboard/Device/ActivityLog/DeviceActivityLogView'

const DeviceActivityLogs = (props: any) => {
  const { id } = props.params
  return id && <DeviceActivityLogView id={id} />
}

export default DeviceActivityLogs