import TempChart from "@/components/Dashboard/dashboardViews/TempChart";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardCardType } from "@/type";
import { memo, useEffect, useState } from "react";
import { Button, Spin } from 'antd';
import { EventsMap, Event, DeviceData } from '@/type';
import OptionsMenu from "@/components/Dashboard/dashboardViews/OptionMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Image from "next/image";

interface CardProps {
  cardObj: DashboardCardType;
}

const CustomCard: React.FC<CardProps> = ({ cardObj }) => {
  const [eventsMap, setEventsMap] = useState<EventsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const from = '2024-05-25';
  const to = '2024-05-26';
  const eventTypes = cardObj.field;

  const { timeFrame } = useSelector((state: RootState) => state.dashboardReducer)

  console.log(cardObj)

  useEffect(() => {
    const fetchEventsForDevices = async () => {
      setLoading(true);
      const eventsMapTemp: EventsMap = {};

      for (const device of cardObj.devices) {
        const { oem, id, name } = device;
        try {
          const response = await axiosInstance.get(`/events`, {
            params: {
              oem: oem,
              from: timeFrame.startDate,
              to: timeFrame.endDate,
              eventTypes: eventTypes,
            },
          });

          eventsMapTemp[id] = { data: response.data.results, name: name };
        } catch (error) {
          console.error(`Error fetching events for device ${id}:`, error);
        }
      }

      setEventsMap(eventsMapTemp);
      setLoading(false);
    };

    fetchEventsForDevices();
  }, [cardObj.devices, from, to, eventTypes, timeFrame]);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-full bg-white rounded-lg shadow-lg p-3">
          <Spin />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-3">
          <div className=" flex flex-row justify-between items-center border-b pb-2">
            <div className=" flex flex-row items-center gap-2">
              <div className=" w-8 h-8 border border-blue-100 rounded-md p-1">
                <Image
                  src={
                    cardObj.field === 'temperature'
                      ? '/thermometer.png'
                      : "/snowflake.png"
                  }
                  alt="Sensors"
                  className="w-full h-full object-cover rounded-sm"
                  unoptimized
                  width={100}
                  height={100}
                />
              </div>
              <p className=" !mb-0 font-semibold text-xl">{cardObj.name}</p>
            </div>
            <Button onMouseDown={handleOnClick} className="!m-0 !p-0">
              <OptionsMenu cardId={cardObj.id} />
            </Button>
          </div>
          <div className="flex-grow">
            <TempChart data={eventsMap} eventTypes={eventTypes} />
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CustomCard);

