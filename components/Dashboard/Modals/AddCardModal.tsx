import React, { useState } from 'react';
import { Modal, Button, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createCard } from '@/app/store/slice/dashboardSlice';
import toast from 'react-hot-toast';
import DevicesSelector from '../Modals/DeviceSelector';
import SensorSelector from '../Modals/SensorSelector';
import CardDetails from '../Modals/CardDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CardOptionsType } from '@/type';
import { AppDispatch, RootState } from '@/app/store/store';

const headings: { [key: number]: string } = {
  0: 'Select Devices',
  1: 'Select Sensor',
  2: 'Set Card Options'
};

const cardOptions: CardOptionsType = {
  TWO_X_TWO: {
    key: 'two_x_two',
    rows: 2,
    cols: 2,
  },
  FOUR_X_TWO: {
    key: 'four_x_two',
    rows: 4,
    cols: 2,
  },
};

interface AddCardModalProps {
  dashboardId: string;
  isVisible: boolean;
  onClose: () => void;
}

const AddCardModal = ({ dashboardId, isVisible, onClose }: AddCardModalProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [cardName, setCardName] = useState('');
  const [step, setStep] = useState(0);
  const [cardOption, setCardOption] = useState(cardOptions.TWO_X_TWO);
  const dispatch: AppDispatch = useDispatch();
  const error = useSelector((state: RootState) => state.dashboardReducer.error);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleChooseSensorType = () => {
    setStep(1)
  }

  const handleCreateCard = () => {
    setStep(2)
  }

  const handleGoBack = () => {
    setStep(prevState => prevState - 1)
  }

  const handleAddCardToDashboard = async () => {
    if (dashboardId) {
      await dispatch(createCard({ dashboard: dashboardId, cardName: cardName, cols: cardOption.cols, rows: cardOption.rows, devices: selectedRowKeys, field: selectedSensors.join(',') }))
      if (error) {
        console.log(error);
      } else {
        onClose()
      }
    }
  }

  return (
    <Modal
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={700}
      footer={[

      ]}
    >
      <h3 className=' font-semibold text-xl text-center'>{headings[step]}</h3>
      <div className=' h-[650px] overflow-y-auto'>

        {step === 0 && <DevicesSelector selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />}
        {step === 1 && <SensorSelector selectedRowKeys={selectedRowKeys} selectedSensors={selectedSensors} setSelectedSensors={setSelectedSensors} />}

        {step === 2 && <CardDetails
          cardOption={cardOption}
          setCardOption={setCardOption}
          cardOptions={cardOptions}
          cardName={cardName}
          setCardName={setCardName}

        />}

      </div>
      <Divider className=" h-[1px] bg-gray-100 !m-0" />
      <div className=' my-5 flex justify-between'>
        {
          step === 0 ? <div></div> :
            <Button type='dashed' onClick={handleGoBack} className=' flex flex-row gap-2 items-center'>
              <ArrowLeftIcon width={15} />
              <p className='!mb-0'>Go Back</p>
            </Button>
        }

        {selectedRowKeys.length > 0 && step === 0 && <Button onClick={handleChooseSensorType} type='default'>Choose the Sensor Type</Button>}
        {selectedSensors.length > 0 && step === 1 && <Button onClick={handleCreateCard} type='default'>Set Card Options</Button>}


        {step === 2 && cardName !== '' && <Button onClick={handleAddCardToDashboard} type='default'>Add to Dashboard</Button>}
      </div>
    </Modal>
  )
}

export default AddCardModal