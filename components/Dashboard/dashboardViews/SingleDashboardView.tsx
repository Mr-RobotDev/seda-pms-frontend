'use client'
import React from 'react'
import withDashboardLayout from "@/hoc/withDashboardLayout";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);
import { getDashboardCards, getDashboards } from "@/app/store/slice/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import { DashboardCardType, DashboardType } from "@/type";
import DashboardMenu from "@/components/Dashboard/dashboardViews/DashboardMenu";
import CustomCard from "../../ui/Card/CustomCard";
import EmptyDashboard from './EmptyDashboard';
import { useRouter } from 'next/navigation';
import AddCardModal from '../Modals/AddCardModal';
import TimeFrameMenu from './TimeFrameMenu';

interface singleDashboardViewProps {
  id: string;
}
const SingleDashboardView = ({ id }: singleDashboardViewProps) => {
  const dispatch: AppDispatch = useDispatch()
  const [dashboard, setDashboards] = useState<DashboardType>()
  const [currentDashboard, setCurrentDashboard] = useState<DashboardType>()
  const router = useRouter()
  // const [cards, setDashboardCards] = useState

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dashboards, isLoading, error, currentDashboard: currentSelectedDashboard, dashboardCards } = useSelector((state: RootState) => state.dashboardReducer)

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);


  useEffect(() => {
    if (currentSelectedDashboard.id !== '') {
      dispatch(getDashboardCards({ dashboardId: currentSelectedDashboard.id }))
    }
  }, [currentSelectedDashboard, dispatch])

  useEffect(() => {
    if (currentSelectedDashboard.id === '') {
      router.push('/dashboard')
    }
  }, [currentSelectedDashboard, router])


  const handleLayoutChange = (layout: any, layouts: any) => {
    console.log(layout, layouts)
  };

  const openCreateCardModal = ({ dashboardId }: { dashboardId: string }) => {
    console.log(dashboardId)
  }

  return (
    <>
      <div>
        <div className=' flex flex-row justify-between items-center'>
          <div className=' flex flex-row gap-3' >
            <DashboardMenu dashboardsList={dashboards} />
            {currentSelectedDashboard && <TimeFrameMenu />}
          </div>
          <div className="flex justify-center mt-3">
            <span
              onClick={() => setIsModalOpen(true)}
              className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg p-2 pt-3 px-3 bg-blue-800 text-white hover:bg-hover-primary transition-all ease-in-out duration-300"
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
    </>
  );
}

export default withDashboardLayout(SingleDashboardView)