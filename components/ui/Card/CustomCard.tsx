import TemperatureChart from "@/components/Dashboard/dashboardViews/TemperatureChart";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardCardType } from "@/type";
import { memo, useEffect, useState } from "react";
import { Button, Spin, Tooltip } from "antd";
import { EventsMap, Event, DeviceData } from "@/type";
import OptionsMenu from "@/components/Dashboard/dashboardViews/OptionMenu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import Image from "next/image";
import { PrimaryInput } from "../Input/Input";
import { updateCard } from "@/app/store/slice/dashboardSlice";
import SingleDeviceDashCard from "@/components/Dashboard/dashboardViews/SingleDeviceDashCard";

interface CardProps {
  cardObj: DashboardCardType;
}

const CustomCard: React.FC<CardProps> = ({ cardObj }) => {
  const [eventsMap, setEventsMap] = useState<EventsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editingName, setEditingName] = useState(cardObj.name);
  const [card, setCard] = useState<DashboardCardType>(cardObj);
  const { timeFrame, currentDashboard } = useSelector(
    (state: RootState) => state.dashboardReducer
  );
  const { isAdmin } = useSelector((state: RootState) => state.authReducer);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setCard(cardObj);
  }, [cardObj]);

  useEffect(() => {
    let isCancelled = false;

    const fetchEventsForDevices = async () => {
      if (!isCancelled) {
        setLoading(true);
        const eventsMapTemp: EventsMap = {};

        const fetchPromises = card.devices.map(async (device) => {
          const { id, name } = device;
          try {
            const response = await axiosInstance.get(`/devices/${device.id}/events`, {
              params: {
                from: timeFrame.startDate,
                to: timeFrame.endDate,
                eventTypes: card.field,
              },
            });
            if (!isCancelled) {
              eventsMapTemp[id] = { data: response.data, name: name };
            }
          } catch (error) {
            console.error(`Error fetching events for device ${id}:`, error);
          }
        });

        await Promise.all(fetchPromises);
        if (!isCancelled) {
          setEventsMap(eventsMapTemp);
          setLoading(false);
        }
      }
    };

    fetchEventsForDevices();

    return () => {
      isCancelled = true;
    };
  }, [card, timeFrame.startDate, timeFrame.endDate]); // Ensure dependencies are stable

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleOnCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRenaming(false);
    console.log("clicked");
    setEditingName(card.name);
  };

  const handleUpdateCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setCard((prevCard) => {
      return {
        ...prevCard,
        name: editingName,
      };
    });

    dispatch(
      updateCard({
        dashboardId: currentDashboard.id,
        cardObj: {
          ...card,
          name: editingName,
        },
      })
    ).then(() => {
      setIsRenaming(false);
    });
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
              <div className=" w-11 h-11 border border-blue-100 rounded-md p-1">
                <Image
                  src={card.field === "temperature" ? "/icons/cold-or-freeze.png" : (card.field === 'pressure' ? '/icons/highest-pressure.png' : "/icons/humidity.png")}
                  alt="Sensors"
                  className="w-full h-full object-cover rounded-sm"
                  unoptimized
                  width={100}
                  height={100}
                />
              </div>
              <div className=" flex flex-col">
                {!isRenaming ? (
                  <div className="!text-lg font-semibold">{card.name}</div>
                ) : (
                  <div className="flex border rounded-md">
                    <PrimaryInput
                      placeholder="Dashboard name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className=" !border-t-0 !border-l-0 !border-b-0 !border-r !rounded-none !border-gray-300 "
                    />
                    <Tooltip
                      getTooltipContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      title={`${
                        editingName.length < 3 ? "Atleast 3 characters" : ""
                      }`}
                    >
                      <span className="flex">
                        <button
                          disabled={editingName.length < 3}
                          onMouseDown={handleUpdateCard}
                          className="mini-button hover:bg-blue-50 bg-transparent border-l-none px-3 disabled:cursor-not-allowed disabled:opacity-80 hover:bg-hover-primary transition-all ease-in-out duration-300 w-full"
                        >
                          Save
                        </button>
                      </span>
                    </Tooltip>
                    <span className="flex">
                      <button
                        disabled={false}
                        className="mini-button border-l px-2 bg-transparent border-l-none rounded-e-lg hover:bg-blue-50 !w-full transition-all ease-in-out duration-300"
                        onMouseDown={handleOnCancelClick}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                )}
                <span className=" text-xs text-slate-400">
                  {card.devices.length} Sensors
                </span>
              </div>
            </div>
            {isAdmin && !isRenaming && (
              <Button onMouseDown={handleOnClick} className=" w-10 h-10 border flex items-center justify-center">
                <OptionsMenu cardId={card.id} setIsRenaming={setIsRenaming} />
              </Button>
            )}
          </div>
          <div className="flex-grow">
            {Object.keys(eventsMap).length > 0 &&
              cardObj.field.split(",").length === 1 && (
                <TemperatureChart data={eventsMap} eventTypes={cardObj.field} />
              )}
            {Object.keys(eventsMap).length > 0 &&
              cardObj.field.split(",").length > 1 && (
                <SingleDeviceDashCard
                  data={eventsMap}
                  eventTypes={cardObj.field}
                />
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CustomCard);
