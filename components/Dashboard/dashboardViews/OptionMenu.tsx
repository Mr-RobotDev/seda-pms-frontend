import { AppDispatch, RootState } from "@/app/store/store";
import { faEllipsisVertical, faSquarePen, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteCard } from "@/app/store/slice/dashboardSlice";

interface OptionMenuProps {
  cardId: string;
}

const OptionsMenu = ({ cardId }: OptionMenuProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { currentDashboard } = useSelector((state: RootState) => state.dashboardReducer)

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className="flex flex-col">
          <div
            className="flex gap-2 p-2 danger-menu transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
            onClick={() => {
              dispatch(deleteCard({ dashboardId: currentDashboard.id, cardId: cardId }));
            }}
          >
            <span className="flex flex-col justify-center">
              <XMarkIcon width={15} />
            </span>
            <span className="!text-sm font-medium">Remove Card</span>
          </div>
        </div>
      }
      trigger="click"
      placement="left"
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
    >
      <div className="flex flex-col justify-center">
        <div className="text-sm rounded-lg p-1 hover:bg-hover-primary transition-all ease-in-out duration-300">
          <EllipsisVerticalIcon width={20} className="!m-0" />
        </div>
      </div>
    </Popover>
  );
};

export default OptionsMenu