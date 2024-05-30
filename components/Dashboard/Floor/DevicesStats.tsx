"use client";
import { RootState } from "@/app/store/store";
import { DevicePhoneMobileIcon } from "@heroicons/react/16/solid";
import { Card } from "antd";
import CountUp from "react-countup";
import { useSelector } from "react-redux";

const temperatureIcon = (
  <svg
    className=" fill-white"
    width="30"
    height="30"
    viewBox="0 0 13 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.88282 6.61371V1.57427C7.88282 0.704811 7.178 0 6.30855 0C5.4391 0 4.73428 0.704811 4.73428 1.57427V6.61147C3.37358 7.47961 2.97426 9.28646 3.8424 10.6472C4.37814 11.4869 5.30466 11.9959 6.30072 11.9978L6.31638 12C7.93045 11.997 9.23644 10.6861 9.23342 9.07203C9.23154 8.07597 8.72251 7.14945 7.88282 6.61371ZM5.0789 11.2221C3.89406 10.538 3.48813 9.02299 4.17219 7.83818C4.38961 7.46159 4.70231 7.1489 5.0789 6.93147C5.14841 6.89133 5.1911 6.81703 5.19079 6.73678V1.57427C5.19079 0.952 5.69524 0.447552 6.3175 0.447552C6.93977 0.447552 7.44421 0.952 7.44421 1.57427V6.73678C7.44391 6.81703 7.48659 6.89133 7.5561 6.93147C8.74094 7.61552 9.14687 9.13057 8.46282 10.3154C7.77876 11.5002 6.26371 11.9062 5.0789 11.2221Z" />
    <path d="M6.54017 7.46856V4.07387C6.54017 3.95029 6.43997 3.8501 6.31639 3.8501C6.19281 3.8501 6.09262 3.95029 6.09262 4.07387V7.46856C5.24727 7.58979 4.66025 8.37334 4.78148 9.21868C4.89091 9.98171 5.54557 10.5476 6.31639 10.5455C7.17038 10.5478 7.86459 9.85745 7.86697 9.00347C7.86909 8.23264 7.30319 7.57799 6.54017 7.46856ZM6.31639 10.0957C5.70957 10.0957 5.21765 9.60378 5.21765 8.99695C5.21888 8.39066 5.71007 7.89944 6.31639 7.89821C6.92322 7.89821 7.41513 8.39013 7.41513 8.99695C7.41513 9.60378 6.92319 10.0957 6.31639 10.0957Z" />
    <path d="M10.0648 1.53857H8.66616C8.54258 1.53857 8.44238 1.63877 8.44238 1.76235C8.44238 1.88593 8.54258 1.98613 8.66616 1.98613H10.0648C10.1883 1.98613 10.2885 1.88593 10.2885 1.76235C10.2885 1.63877 10.1883 1.53857 10.0648 1.53857Z" />
    <path d="M9.7672 2.65723H8.94594C8.82236 2.65723 8.72217 2.75742 8.72217 2.881C8.72217 3.00458 8.82236 3.10478 8.94594 3.10478H9.7672C9.89078 3.10478 9.99098 3.00458 9.99098 2.881C9.99098 2.75742 9.89078 2.65723 9.7672 2.65723Z" />
    <path d="M10.0648 3.77637H8.66616C8.54258 3.77637 8.44238 3.87656 8.44238 4.00014C8.44238 4.12372 8.54258 4.22392 8.66616 4.22392H10.0648C10.1883 4.22392 10.2885 4.12372 10.2885 4.00014C10.2885 3.87656 10.1883 3.77637 10.0648 3.77637Z" />
    <path d="M9.7672 4.89502H8.94594C8.82236 4.89502 8.72217 4.99522 8.72217 5.1188C8.72217 5.24238 8.82236 5.34257 8.94594 5.34257H9.7672C9.89078 5.34257 9.99098 5.24238 9.99098 5.1188C9.99098 4.99522 9.89078 4.89502 9.7672 4.89502Z" />
    <path d="M10.0648 6.01416H8.66616C8.54258 6.01416 8.44238 6.11436 8.44238 6.23794C8.44238 6.36152 8.54258 6.46171 8.66616 6.46171H10.0648C10.1883 6.46171 10.2885 6.36152 10.2885 6.23794C10.2885 6.11436 10.1883 6.01416 10.0648 6.01416Z" />
  </svg>
);

const humidityIcon = (
  <svg
    className=" fill-white"
    width="30"
    height="30"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2426_3501)">
      <path d="M10.9944 3.82178C9.99262 3.82178 9.17803 4.6366 9.17803 5.6381C9.17803 5.88887 9.38112 6.09219 9.63211 6.09219C9.8831 6.09219 10.0862 5.88887 10.0862 5.6381C10.0862 5.13722 10.4937 4.72994 10.9944 4.72994C11.495 4.72994 11.9025 5.13722 11.9025 5.6381C11.9025 6.13898 11.495 6.54627 10.9944 6.54627H0.586406C0.335412 6.54627 0.132324 6.74958 0.132324 7.00035C0.132324 7.25112 0.335412 7.45443 0.586406 7.45443H10.9944C11.9961 7.45443 12.8107 6.63961 12.8107 5.6381C12.8107 4.6366 11.9961 3.82178 10.9944 3.82178Z" />
      <path d="M0.550273 5.63802H6.45333C7.45507 5.63802 8.26966 4.8232 8.26966 3.8217C8.26966 2.82019 7.45507 2.00537 6.45333 2.00537C5.4516 2.00537 4.63701 2.82019 4.63701 3.8217C4.63701 4.07246 4.8401 4.27578 5.09109 4.27578C5.34208 4.27578 5.54517 4.07246 5.54517 3.8217C5.54517 3.32082 5.95268 2.91353 6.45333 2.91353C6.95399 2.91353 7.3615 3.32082 7.3615 3.8217C7.3615 4.32258 6.95399 4.72986 6.45333 4.72986H0.550273C0.299279 4.72986 0.0961914 4.93318 0.0961914 5.18394C0.0961914 5.43471 0.299279 5.63802 0.550273 5.63802Z" />
      <path d="M6.45333 8.36279H0.550273C0.299279 8.36279 0.0961914 8.56611 0.0961914 8.81687C0.0961914 9.06764 0.299279 9.27096 0.550273 9.27096H6.45333C6.95399 9.27096 7.3615 9.67824 7.3615 10.1791C7.3615 10.68 6.95399 11.0873 6.45333 11.0873C5.95268 11.0873 5.54517 10.68 5.54517 10.1791C5.54517 9.92835 5.34208 9.72504 5.09109 9.72504C4.8401 9.72504 4.63701 9.92835 4.63701 10.1791C4.63701 11.1806 5.4516 11.9954 6.45333 11.9954C7.45507 11.9954 8.26966 11.1806 8.26966 10.1791C8.26966 9.17761 7.45507 8.36279 6.45333 8.36279Z" />
    </g>
    <defs>
      <clipPath id="clip0_2426_3501">
        <rect
          width="12.7143"
          height="12.7143"
          transform="translate(0.0961914 0.643066)"
        />
      </clipPath>
    </defs>
  </svg>
);

const DevicesStats = () => {
  const devicesStats = useSelector((state: RootState) => state.statisticsReducer)
  return (
    <div>
      <div className="layout-content">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 mx-auto">
          <div className=" h-full">
            <Card bordered={false} className="criclebox h-full ">
              <div className=" text-2xl flex flex-row justify-between h-full">
                <div>
                  <span className=" text-lg">Total Devices</span>
                  <div className="text-2xl font-bold">
                    <span className="!text-3xl !font-bold">
                      <CountUp className="" end={devicesStats.totalDevices} duration={2} />
                    </span>
                  </div>
                </div>
                <div className="icon-box flex items-center justify-center">
                  <DevicePhoneMobileIcon width={25} />
                </div>
              </div>
            </Card>
          </div>

          <div className=" h-full">
            <Card bordered={false} className="criclebox h-full">
              <div className=" text-2xl flex flex-row justify-between">
                <div>
                  <span className=" text-lg">Highest Temperature</span>
                  <div className="text-2xl font-bold">
                    <span className="!text-3xl !font-bold">
                      <CountUp decimals={2} end={devicesStats.highestTemperature} duration={2} />
                    </span>
                  </div>
                </div>
                <div className="icon-box flex items-center justify-center">
                  {temperatureIcon}
                </div>
              </div>
            </Card>
          </div>

          <div className=" h-full">
            <Card bordered={false} className="criclebox h-full">
              <div className=" text-2xl flex flex-row justify-between">
                <div>
                  <span className=" text-lg">Highest Relative Humidity</span>

                  <div className="">
                    <span className="!text-3xl !font-bold">
                      <CountUp decimals={2} end={devicesStats.highestRelativeHumidity} duration={2} />
                    </span>
                  </div>
                </div>
                <div className="icon-box flex items-center justify-center">
                  {humidityIcon}
                </div>
              </div>
            </Card>
          </div>
          </div>
      </div>
    </div>
  );
};

export default DevicesStats;
