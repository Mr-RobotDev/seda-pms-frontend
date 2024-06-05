import React, { useState, useCallback } from "react";
import { Popover } from "antd";
import { SelectSecondary } from "@/components/ui/Select/Select";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { scheduletypeOptions } from "@/utils/form";

interface ScheduleTypeMenuProps {
  handleScheduleTypeChange: (value: string) => void;
  initialScheduleType?: string;
}

const ScheduleTypeMenu = ({ handleScheduleTypeChange, initialScheduleType = 'weekdays' }: ScheduleTypeMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [scheduleType, setScheduleType] = useState(initialScheduleType);

  const handleScheduleTimeClick = useCallback((value: string) => {
    setScheduleType(value);
    setVisible(false);
    handleScheduleTypeChange(value);
  }, [handleScheduleTypeChange]);

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className="w-[170px]">
          <div className="flex flex-col">
            {['everyday', 'weekdays', 'custom'].map(type => (
              <div
                key={type}
                className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
                onClick={() => handleScheduleTimeClick(type)}
              >
                <span className="flex flex-col justify-center w-[6px]">
                  <span
                    className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${scheduleType === type ? "visible" : "hidden"}`}
                  ></span>
                </span>
                <span className="text-sm font-medium !text-black">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      }
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={setVisible}
    >
      <div className="inline-block shadow-sm rounded-lg !bg-white p-1 px-2 w-full">
        <div className="flex flex-row gap-2">
          <SelectSecondary
            only={scheduletypeOptions.find(option => option.value === scheduleType)?.label}
            Icon={<CalendarIcon width={20} />}
          />
        </div>
      </div>
    </Popover>
  );
};

export default ScheduleTypeMenu;
