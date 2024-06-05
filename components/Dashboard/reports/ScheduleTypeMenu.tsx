import React, { useState } from "react";
import { Popover } from "antd";
import { SelectSecondary } from "@/components/ui/Select/Select";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { scheduletypeOptions } from "@/utils/form";

interface ScheduleTypeMenuProps {
  handleScheduleTypeChange: (value: string) => void;
  scheduleType: string;
}

const ScheduleTypeMenu = ({ handleScheduleTypeChange, scheduleType }: ScheduleTypeMenuProps) => {
  const [visible, setVisible] = useState(false);

  const handleScheduleTimeClick = (value: string) => {
    handleScheduleTypeChange(value)
    setVisible(false)
  }

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className="w-[170px]">
          <div className="flex flex-col">
            <div
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleScheduleTimeClick('everyday')}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${scheduleType === 'everyday'
                    ? "visible"
                    : "hidden"
                    }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">Every Day</span>
            </div>
            <div
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleScheduleTimeClick('weekdays')}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${scheduleType === 'weekdays'
                    ? "visible"
                    : "hidden"
                    }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">Week Days</span>
            </div>
            <div
              className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
              onClick={() => handleScheduleTimeClick('custom')}
            >
              <span className="flex flex-col justify-center w-[6px]">
                <span
                  className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${scheduleType === 'custom'
                    ? "visible"
                    : "hidden"
                    }`}
                ></span>
              </span>
              <span className="text-sm font-medium !text-black">
                Custom
              </span>
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
            only={scheduletypeOptions.find(option => option.value === scheduleType)?.label}
            Icon={<CalendarDaysIcon width={20}
            />}
          />
        </div>
      </div>
    </Popover>
  );
};

export default ScheduleTypeMenu;
