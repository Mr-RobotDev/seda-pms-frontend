import React, { useEffect, useState } from 'react'
import AlertsPieChart from './AlertsPieChart'
import { Card } from 'antd'
import DeviceTypeDetail from '../Device/DeviceTypeDetail'
import axiosInstance from '@/lib/axiosInstance'
import { AlertStatsType } from '@/type'
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper'

const AlertsStats = () => {
  const [alertStats, setAlertStats] = useState<AlertStatsType>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get('/alerts/stats')
        if (response.status === 200) {
          setAlertStats(response.data)
        } else {
          console.log('Error fetching alert stats', response)
        }
      } catch (err) {
        console.log('Error fetching alert stats', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className=' my-4'>
      <LoadingWrapper loading={loading}>
        {alertStats ? <div className=' grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className=' w-full flex flex-col gap-5 '>
            <div className='flex-1'>
              <DeviceTypeDetail title="Active Alerts" value={alertStats?.totalActiveAlerts} notDecimal={true} image="/devices.png" bigHeadings={true} />
            </div>
            <div className='flex-1'>
              <DeviceTypeDetail title="Non Active Alerts" value={alertStats?.totalNonActiveAlerts} notDecimal={true} image="/devices.png" bigHeadings={true} />
            </div>
          </div>
          <Card className=' flex justify-center items-center'>
            <AlertsPieChart data={alertStats} />
          </Card>
        </div>
        :
        !loading && <div className=' text-center my-4 text-xl '>Could Not Fetch the Alerts Stats</div>  
      }
      </LoadingWrapper>
    </div>
  )
}

export default AlertsStats