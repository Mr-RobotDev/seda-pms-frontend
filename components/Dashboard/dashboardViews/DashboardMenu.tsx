'use client'
import React, { useEffect, useState } from 'react';
import { Popover, Tooltip, Spin, Card } from 'antd';

import { useSelector, useDispatch } from 'react-redux';

import { createDashboard, deleteDashboard, setCurrentDashboard } from '@/app/store/slice/dashboardSlice';
import { AppDispatch, RootState } from '@/app/store/store';
import { faCirclePlus, faEllipsisVertical, faSquareXmark, faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DashboardType } from '@/type';
import { SelectSecondary } from '@/components/ui/Select/Select'
import { ArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PrimaryInput } from '@/components/ui/Input/Input'
import { useRouter } from 'next/navigation';
import { MdOutlineDashboard } from "react-icons/md";

interface DashboardTypeProps {
  dashboardsList: DashboardType[];
}

const DashboardMenu = ({ dashboardsList }: DashboardTypeProps) => {
  const { isLoading, currentDashboard, dashboardCards } = useSelector((state: RootState) => state.dashboardReducer);
  const [visible, setVisible] = useState(false);
  const [dashboards, setDashboards] = useState(dashboardsList || []);
  const [isCreating, setIsCreating] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (dashboardsList) {
      setDashboards(dashboardsList);
    }
  }, [dashboardsList]);

  const setDashboard = (dashboard: DashboardType) => {
    dispatch(setCurrentDashboard(dashboard));
    router.push(`/dashboard/${dashboard.id}`);
    setVisible(false);
  };

  const createDashboardHandler = () => {
    dispatch(createDashboard({ name: newDashboardName }))
    router.push(`/dashboard/${currentDashboard.id}`);
    setIsCreating(false);
    setVisible(false);
  }

  const handleDeleteDashboard = (id: string) => {
    dispatch(deleteDashboard({ dashboardId: id }))
  }

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className=' w-auto'>
          {dashboards.length ? (
            dashboards.map((dashboard) => {
              return (
                <div key={dashboard.id} className=' flex flex-row w-full justify-between gap-2'>
                  <div
                    key={dashboard.id}
                    onClick={() => setDashboard(dashboard)}
                    className="p-2 flex-1 rounded-md cursor-pointer hover:bg-hover-primary flex justify-between gap-3 transition-all ease-in-out duration-300 hover:bg-gray-200"
                  >
                    <div className="flex flex-col">
                      <span className="!text-sm !text-black">{dashboard.name}</span>
                    </div>
                  </div>
                  <div className=' mt-2 group cursor-pointer' onClick={() => handleDeleteDashboard(dashboard.id)}>
                    <TrashIcon width={15} className=' group-hover:text-red-600 duration-300 transition-all ease-in-out' />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-2">No dashboards found</div>
          )}
          <div className="bg-gray-300  my-2" style={{ height: '1px' }}></div>
          <div>
            {!isCreating && (
              <div
                className="flex gap-2 p-2 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer w-full hover:bg-gray-200"
                onClick={() => setIsCreating(true)}
              >
                <span className="flex flex-col justify-center">
                  <FontAwesomeIcon icon={faCirclePlus} />
                </span>
                <span>Create new dashboard</span>
              </div>
            )}
            {isCreating && !isLoading.create && (
              <div className="flex">
                <PrimaryInput
                  placeholder="Dashboard name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className=" !border !border-gray-200 "
                />
                <Tooltip
                  title={`${newDashboardName.length < 3 ? 'Atleast 3 characters' : ''}`}
                  getTooltipContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                  <span className="flex">
                    <button
                      disabled={newDashboardName.length < 3}
                      onClick={createDashboardHandler}
                      className="mini-button bg-transparent border-l-none px-3 disabled:cursor-not-allowed disabled:opacity-80 hover:bg-hover-primary transition-all ease-in-out duration-300"
                    >
                      Create
                    </button>
                  </span>
                </Tooltip>
                <span className="flex">
                  <button
                    disabled={false}
                    className="mini-button bg-transparent border-l-none rounded-e-lg hover:bg-hover-primary transition-all ease-in-out duration-300"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </button>
                </span>
              </div>
            )}
            {isCreating && isLoading.create && (
              <div className="flex justify-center p-2">
                <Spin />
              </div>
            )}
          </div>
        </div>
      }
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
    >
      <div className=' inline-block shadow-lg rounded-lg !bg-white p-1 px-2'>
        <div className=' flex flex-row gap-2'>
          <SelectSecondary only={currentDashboard.name || 'Select a Dashboard'} Icon={<MdOutlineDashboard className=' w-5 h-5' />} />
        </div>
      </div>
    </Popover>
  );
};

export default DashboardMenu;
