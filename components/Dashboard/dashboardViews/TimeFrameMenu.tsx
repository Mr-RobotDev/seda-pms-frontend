import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";

import { SelectSecondary } from "@/components/ui/Select/Select";
import { setTimeFrame } from "@/app/store/slice/dashboardSlice";

import timeFrames from "@/utils/time_frames";
import { RootState } from "@/app/store/store";
import { TimeFrameType } from "@/type";
import { ArrowDownIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

interface TimeFrameProps {
  functionality: boolean;
  initialValue?: string;
}
const TimeFrameMenu = ({ functionality, initialValue }: TimeFrameProps) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { timeFrame } = useSelector(
    (state: RootState) => state.dashboardReducer
  );

  const handleTimeFrame = (timeFrame: TimeFrameType) => {
    dispatch(setTimeFrame(timeFrame));
    setVisible(false);
  };

  useEffect(() => {
    if (window && window.history && functionality) {
      const from = timeFrame.startDate;
      const to = timeFrame.endDate;
      const key = timeFrame.key;

      const url = new URL(window.location.href);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);
      url.searchParams.set("key", key);
      window.history.replaceState({}, "", url.toString());
    }
  }, [timeFrame, functionality]);

  useEffect(() => {
    if (initialValue) {
      dispatch(setTimeFrame(timeFrames[initialValue]));
    }
  }, [initialValue, dispatch]);

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className="w-[170px]">
          <div className="flex flex-col">
            <div
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleTimeFrame(timeFrames.today)}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                    timeFrame.key === timeFrames.today.key
                      ? "visible"
                      : "hidden"
                  }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">Today</span>
            </div>
            <div
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleTimeFrame(timeFrames.yesterday)}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                    timeFrame.key === timeFrames.yesterday.key
                      ? "visible"
                      : "hidden"
                  }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">Yesterday</span>
            </div>
            <div
              className="bg-slate-300 dark:bg-slate-700 my-2"
              style={{ height: "1px" }}
            ></div>
            <div>
              <div className="text-[11px] text-secondary-300 ml-3 !text-black">
                Monday - Sunday
              </div>
              <div
                className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => handleTimeFrame(timeFrames.this_week)}
              >
                <span className="flex flex-col justify-center w-[6px]">
                  <span
                    className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                      timeFrame.key === timeFrames.this_week.key
                        ? "visible"
                        : "hidden"
                    }`}
                  ></span>
                </span>
                <span className="text-sm font-medium !text-black">
                  This Week
                </span>
              </div>
              <div
                className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => handleTimeFrame(timeFrames.last_week)}
              >
                <span className="flex flex-col justify-center w-[6px]">
                  <span
                    className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                      timeFrame.key === timeFrames.last_week.key
                        ? "visible"
                        : "hidden"
                    }`}
                  ></span>
                </span>
                <span className="text-sm font-medium !text-black">
                  Last Week
                </span>
              </div>
            </div>
            <div
              className="bg-slate-300 dark:bg-slate-700 my-2"
              style={{ height: "1px" }}
            ></div>
            <div>
              <div
                className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => handleTimeFrame(timeFrames.last_3_days)}
              >
                <span className="flex flex-col justify-center w-[6px]">
                  <span
                    className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                      timeFrame.key === timeFrames.last_3_days.key
                        ? "visible"
                        : "hidden"
                    }`}
                  ></span>
                </span>
                <span className="text-sm font-medium !text-black">
                  Last 3 days
                </span>
              </div>
              <div
                className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => handleTimeFrame(timeFrames.last_7_days)}
              >
                <span className="flex flex-col justify-center w-[6px]">
                  <span
                    className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                      timeFrame.key === timeFrames.last_7_days.key
                        ? "visible"
                        : "hidden"
                    }`}
                  ></span>
                </span>
                <span className="text-sm font-medium !text-black">
                  Last 7 days
                </span>
              </div>
              <div
                className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => handleTimeFrame(timeFrames.last_30_days)}
              >
                <span className="flex flex-col justify-center w-[6px]">
                  <span
                    className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${
                      timeFrame.key === timeFrames.last_30_days.key
                        ? "visible"
                        : "hidden"
                    }`}
                  ></span>
                </span>
                <span className="text-sm font-medium !text-black">
                  Last 30 days
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
    >
      <div className=" inline-block shadow-sm rounded-lg !bg-white p-1 px-2 w-full">
        <div className=" flex flex-row gap-2">
          <SelectSecondary
            only={timeFrame.title}
            Icon={<CalendarDaysIcon width={20} />}
          />
        </div>
      </div>
    </Popover>
  );
};

export default TimeFrameMenu;
