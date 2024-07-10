import { Card } from 'antd'
import Image from 'next/image';
import React from 'react'
import CountUp from "react-countup";

interface DeviceTypeDetailProps {
  title: string;
  value: number;
  image: string;
  notDecimal?: boolean;
  bigHeadings?: boolean;
}

const DeviceTypeDetail = ({ title, value, image, notDecimal, bigHeadings }: DeviceTypeDetailProps) => {
  return (
    <>
      <Card bordered={false} className="criclebox h-full">
        <div className=" text-2xl flex flex-row justify-between">
          <div className=''>
            <span className={`text-lg !mb-0 ${bigHeadings ? '!text-xl' : ''}`}>{title}</span>
            <div className="text-2xl font-bold">
              <span className={`!text-3xl !font-bold ${bigHeadings ? '!text-4xl' : ''}`}>
                <CountUp
                  decimals={notDecimal ? 0 : 2}
                  end={value}
                  duration={2}
                />
              </span>
            </div>
          </div>
          <div className=" w-12 h-12 flex items-center justify-center ml-auto">
            <Image
              src={image}
              className=" w-full h-full"
              alt="icon"
              width={100}
              height={100}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default DeviceTypeDetail