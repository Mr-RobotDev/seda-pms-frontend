import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

interface DeviceDetailsCompProps {
  device: {
    id: string;
    oem: string;
    name: string;
    type: string;
    temperature: number;
    relativeHumidity: number;
    location: {
      lat: number;
      long: number;
    };
  };
}

const DeviceDetailsComp = ({ device }: DeviceDetailsCompProps) => {
  return (
    <div className=" w-48">
      <div className=" flex flex-col gap-2">
        <div className=" flex flex-row items-center justify-between">
          <p className="!m-0 text-center bg-slate-700 text-white !text-xs py-2 px-3 rounded-lg font-semibold">
            {device.name}
          </p>
          <Link target="_blank" href={`/dashboard/devices/${device.id}`}>
            <div>
              <ArrowTopRightOnSquareIcon width={20} />
            </div>
          </Link>
        </div>
        <div className=" flex flex-row justify-between">
          <div className="!m-0 flex flex-row items-center gap-2">
            <div className="w-6 h-6">
              <Image
                src="/high-temperature.png"
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
                src="/humidity.png"
                alt="temperature"
                width={100}
                height={100}
              />
            </div>
            <strong className=" text-lg">{device.relativeHumidity} %</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsComp;
