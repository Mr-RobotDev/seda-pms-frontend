"use client";
import { RootState } from "@/app/store/store";
import { Card } from "antd";
import Image from "next/image";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import DeviceTypeDetail from "../Device/DeviceTypeDetail";

const DevicesStats = () => {
  const devicesStats = useSelector(
    (state: RootState) => state.statisticsReducer
  );
  return (
    <div>
      <div className="layout-content">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 mx-auto">
          <div className=" h-full">
            <Card bordered={false} className="criclebox h-full ">
              <div className=" text-2xl flex flex-row justify-between h-full">
                <div>
                  <span className=" text-lg">Total Devices</span>
                  <div className="text-2xl font-bold">
                    <span className="!text-3xl !font-bold">
                      <CountUp
                        className=""
                        end={devicesStats.totalDevices}
                        duration={2}
                      />
                    </span>
                  </div>
                </div>
                <div className=" w-12 h-12 flex items-center justify-center ml-auto">
                  <Image
                    src={"/devices.png"}
                    className=" w-full h-full"
                    alt="icon"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </Card>
          </div>
          <DeviceTypeDetail title="Highest Temperature" value={devicesStats.highestTemperature} image="/high-temperature.png" type="temperature" />
          <DeviceTypeDetail title="Highest Humidity" value={devicesStats.highestRelativeHumidity} image="/humidity.png" type="humidity" />
          <DeviceTypeDetail title="Highest Pressure" value={devicesStats.highestPressure} image="/pressure.png" type="pressure" />
        </div>
      </div>
    </div>
  );
};

export default DevicesStats;
