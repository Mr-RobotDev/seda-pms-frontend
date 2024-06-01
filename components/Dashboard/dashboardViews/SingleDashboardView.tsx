'use client'
import React from 'react'
import withDashboardLayout from "@/hoc/withDashboardLayout";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);
import { getDashboardCards, getDashboards, setCurrentDashboard, updateCard } from "@/app/store/slice/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import { DashboardCardType, DashboardType } from "@/type";
import DashboardMenu from "@/components/Dashboard/dashboardViews/DashboardMenu";
import CustomCard from "../../ui/Card/CustomCard";
import EmptyDashboard from './EmptyDashboard';
import { useRouter } from 'next/navigation';
import AddCardModal from '../Modals/AddCardModal';
import TimeFrameMenu from './TimeFrameMenu';
import { Spin } from 'antd';

interface singleDashboardViewProps {
  id: string;
}
const SingleDashboardView = ({ id }: singleDashboardViewProps) => {
  const dispatch: AppDispatch = useDispatch()
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dashboards, isLoading, error, currentDashboard: currentSelectedDashboard, dashboardCards } = useSelector((state: RootState) => state.dashboardReducer)

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      const currentDashboard = dashboards.find(dashboard => dashboard.id === id)
      if (!currentDashboard){
        router.push('/dashboard')
        return
      }
      dispatch(setCurrentDashboard(currentDashboard))
      dispatch(getDashboardCards({ dashboardId: id }))
    }
  }, [currentSelectedDashboard, router, id, dashboards, dispatch])


  const handleLayoutChange = (layout: any, layouts: any) => {
    if (layouts.sm || layouts.xs) return;

    const updatedCards = layout.map((item: any) => {
      const card = dashboardCards.find((card) => card.id === item.i);
      if (card) {
        if (card.x !== item.x || card.y !== item.y || card.rows !== item.w || card.cols !== item.h) {
          return {
            ...card,
            x: item.x,
            y: item.y,
            rows: item.w,
            cols: item.h,
          };
        }
      }
      return null;
    });

    updatedCards.forEach((card: DashboardCardType) => {
      if (!card) return;
      dispatch(
        updateCard({
          dashboardId: currentSelectedDashboard.id,
          cardObj: card
        }),
      );
    });
  };

  const openCreateCardModal = ({ dashboardId }: { dashboardId: string }) => {
    console.log(dashboardId)
  }

  return (
    currentSelectedDashboard ? <>
      <div>
        <div className=' flex flex-row justify-between items-center'>
          <div className=' flex flex-row gap-3' >
            <DashboardMenu dashboardsList={dashboards} />
            {currentSelectedDashboard && dashboardCards.length !== 0 &&  <TimeFrameMenu />}
          </div>
          <div className="flex justify-center md:mt-0 mt-3">
            <span
              onClick={() => setIsModalOpen(true)}
              className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg p-2 px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300"
            >
              Create New Card
            </span>
          </div>
        </div>
        {!(dashboardCards && dashboardCards.length > 0) ? (
          <EmptyDashboard openCreateCardModal={openCreateCardModal} />
        ) : (
          <div className="mt-3">
            <ResponsiveGridLayout
              className="layout"
              margin={[20, 20]}
              rowHeight={160}
              breakpoints={{ '2xl': 1536, xl: 1280, lg: 1024, md: 768, sm: 640, xs: 480 }}
              cols={{ '2xl': 4, xl: 4, lg: 4, md: 4, sm: 1, xs: 1 }}
              resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
              onLayoutChange={handleLayoutChange}
            >
              {dashboardCards.map((card: DashboardCardType) => (
                <div key={card.id} data-grid={{ x: card.x, y: card.y, w: card.rows, h: card.cols, minW: 2, minH: 2 }}>
                  <CustomCard cardObj={card} />
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        )}
      </div>
      <AddCardModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dashboardId={currentSelectedDashboard.id} />
    </> :
      <div className=' w-full h-full flex justify-center items-center'>
        <Spin />
      </div>
  );
}

export default withDashboardLayout(SingleDashboardView)