import axiosInstance from '@/lib/axiosInstance'
import { DeviceData, DevicesType } from '@/type'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingWrapper from '../ui/LoadingWrapper/LoadingWrapper'

const DeviceDetail = ({ deviceOem }: { deviceOem: string }) => {

  const [device, setDevice] = useState<DevicesType>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/devices/${deviceOem}/info`)
        if (response.status === 200) {
          setDevice(response.data)
        } else {
          setError('Device not found')
          toast.error('Error fetching device info')
        }
      } catch (error) {
        console.error('Error fetching device info:', error)
        setError('Device not found')
        toast.error('Error fetching device info')
      } finally {
        setLoading(false)
      }
    })()
  }, [deviceOem])

  return (
    <LoadingWrapper loading={loading} size='small'>
      {error && <p className=' text-center text-xl font-semibold'>{error}</p>}
      {
        device &&
        <div className=" flex flex-col gap-2 mt-4 p-3">
          <div className=" flex flex-row items-center justify-between">
            <p className="!m-0 text-center text-slate-700 !text-lg rounded-lg pb-3 font-semibold">
              {device.name}
            </p>
          </div>

          {
            device.pressure ?
              <div className="!m-0 flex flex-row items-center gap-2">
                <div className="w-6 h-6">
                  <Image
                    src="/icons/highest-pressure.png"
                    alt="Pressure"
                    width={100}
                    height={100}
                  />
                </div>
                <strong className=" text-lg">{device.pressure} Pa</strong>
              </div>
              :
              <div className=" flex flex-col justify-between gap-6">
                <div className="!m-0 flex flex-row items-center gap-2">
                  <div className="w-6 h-6">
                    <Image
                      src="/icons/highest-temperature.png"
                      alt="temperature"
                      width={100}
                      height={100}
                    />
                  </div>
                  <strong className=" text-lg">{device.temperature}°C</strong>
                </div>
                <div className="!m-0 flex flex-row items-center gap-2">
                  <div className="w-6 h-6">
                    <Image
                      src="/icons/highest-humidity.png"
                      alt="temperature"
                      width={100}
                      height={100}
                    />
                  </div>
                  <strong className=" text-lg">{device.relativeHumidity} %</strong>
                </div>
              </div>
          }
        </div>
      }
    </LoadingWrapper>
  )
}

export default DeviceDetail
