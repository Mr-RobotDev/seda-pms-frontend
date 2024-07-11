import React, { useEffect, useState } from 'react'
import AlertsPieChart from './AlertsPieChart'
import { Card } from 'antd'
import DeviceTypeDetail from '../Device/DeviceTypeDetail'
import axiosInstance from '@/lib/axiosInstance'
import { AlertStatsType } from '@/type'
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper'
import CountUp from "react-countup";
import Image from 'next/image'

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
        {alertStats ?
          <div className=' grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='!h-full'>
              <Card bordered={false} className="criclebox h-full">
                <div className="text-2xl flex flex-row justify-between">
                  <div className="">
                    <span className="!mb-0 !text-xl">Active Alerts</span>
                    <div className="text-2xl font-bold">
                      <span className="!text-4xl !font-bold">
                        <CountUp end={alertStats?.totalActiveAlerts} duration={2} />
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center ml-auto">
                    <Image
                      src="/icons/active-alerts.png"
                      className="w-full h-full"
                      alt="icon"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="mt-5">
                  {alertStats.activeAlerts.length > 0 ? (
                    <div className="flex flex-wrap md:flex-nowrap gap-0 md:gap-3 w-full overflow-x-auto">
                      {Array.from({ length: Math.ceil(alertStats.activeAlerts.length / 10) }).map((_, columnIndex) => (
                        <ul className=" mb-0" key={columnIndex}>
                          {alertStats.activeAlerts.slice(columnIndex * 10, (columnIndex + 1) * 10).map((alert) => (
                            <li className="mb-[6px] w-64 flex flex-row gap-2 items-center" key={alert}>
                              <div className=' w-[6px] h-[6px] bg-red-500 rounded-full'></div>
                              {alert}
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  ) : (
                    <p>No Active Alerts</p>
                  )}
                </div>
              </Card>




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