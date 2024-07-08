import { AppDispatch, RootState } from "@/app/store/store";
import { Button, Modal, Popover } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { deleteCard, updateCard, updateCardDevices } from "@/app/store/slice/dashboardSlice";
import DevicesSelector from "../Modals/DeviceSelector";
import { DashboardCardType } from "@/type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingWrapper from "@/components/ui/LoadingWrapper/LoadingWrapper";

interface OptionMenuProps {
  setIsRenaming: Dispatch<SetStateAction<boolean>>;
  card: DashboardCardType
}

const OptionsMenu = ({ card, setIsRenaming }: OptionMenuProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [updateDeviceModalShow, setUpdateDeviceModalShow] = useState(false);
  const { currentDashboard, isLoading } = useSelector(
    (state: RootState) => state.dashboardReducer
  );
  const router = useRouter()

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(card.devices.map(device => device.id));

  const handleCloseUpdateDeviceModal = () => {
    setUpdateDeviceModalShow(false)
  }

  const handleUpdateCardDevices = async () => {

    console.log(selectedRowKeys)
    if(selectedRowKeys.length === 0) {
      toast.error('Please select at least one device')
      return
    }

    const resultAction = await dispatch(
      updateCardDevices({
        dashboardId: currentDashboard.id,
        cardId: card.id,
        devices: selectedRowKeys
      })
    );

    if (updateCardDevices.fulfilled.match(resultAction)) {
      setUpdateDeviceModalShow(false)
      toast.success('Card devices updated successfully')
    } else {
      toast.error('Error updating the card devices')
    }
  }

  return (
    <div>
      <Popover
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        content={
          <div className="flex flex-col">
            <div
              className="flex gap-2 p-1 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
              onClick={() => {
                setVisible(false);
                setIsRenaming(true);
              }}
            >
              <span className="flex flex-col justify-center">
                <PencilSquareIcon width={15} />
              </span>
              <span className="!text-xs font-medium">Rename Card</span>
            </div>
            { card.field !== 'temperature,relativeHumidity' && <div
              className="flex gap-2 p-1 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
              onClick={() => {
                setVisible(false);
                setUpdateDeviceModalShow(true)
              }}
            >
              <span className="flex flex-col justify-center">
                <PencilSquareIcon width={15} />
              </span>
              <span className="!text-xs font-medium">Update Devices</span>
            </div>}
            <div
              className="bg-slate-300 dark:bg-slate-700 my-2"
              style={{ height: "1px" }}
            ></div>
            <div
              className="flex gap-2 p-1 danger-menu transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
              onClick={() => {
                dispatch(
                  deleteCard({ dashboardId: currentDashboard.id, cardId: card.id })
                );
              }}
            >
              <span className="flex flex-col justify-center">
                <XMarkIcon width={15} />
              </span>
              <span className="!text-xs font-medium">Remove Card</span>
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

      <Modal
        title="Update Devices"
        width={700}
        onCancel={handleCloseUpdateDeviceModal}
        onOk={handleUpdateCardDevices}
        okText='Update Devices'
        open={updateDeviceModalShow}

      >
        <LoadingWrapper loading={isLoading.updateCardDevices}>
          {selectedRowKeys && <div className=" !h-[600px] overflow-y-auto py-3">
            <DevicesSelector
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              deviceType={card.field}
              updatingDevice={true}
            />
          </div>}
        </LoadingWrapper>
      </Modal>
    </div>
  );
};

export default OptionsMenu;
