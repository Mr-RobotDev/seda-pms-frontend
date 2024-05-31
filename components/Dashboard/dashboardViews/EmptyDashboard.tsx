'use client';
import { useState } from 'react';
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';
import AddCardModal from '../Modals/AddCardModal';

interface EmptyDashboardProps {
  openCreateCardModal?: (args: { dashboardId: string }) => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { error, currentDashboard } = useSelector((state: RootState) => state.dashboardReducer)

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-center md:mt-36 mt-24">
        <div>
          <div className="flex justify-center">
            <div className="empty-boxes">
              <div className="content-box empty-box animate-1"></div>
              <div className="content-box empty-box"></div>
              <div className="content-box empty-box"></div>
              <div className="content-box empty-box animate-2"></div>
            </div>
          </div>
          <div className="font-semibold text-center mt-2 text-xl">Empty Dashboard</div>
          <div className="!text-sm !text-black font-light text-secondary-300 text-center mt-3">
            Create an overview and visualize sensor data by adding cards
          </div>
          <div className="flex justify-center mt-3">
            <span
              onClick={showModal}
              className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg p-2 pt-3 px-3 bg-blue-800 text-white hover:bg-hover-primary transition-all ease-in-out duration-300"
            >
              Create New Card
            </span>
          </div>
        </div>
        <AddCardModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} dashboardId={currentDashboard.id} />
      </div>
    </>
  );
};

export default EmptyDashboard;
