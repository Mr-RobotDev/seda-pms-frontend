"use client";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from 'react-grid-layout';
import { getDashboardCards, getDashboards } from "@/app/store/slice/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import { DashboardType } from "@/type";
import DashboardMenu from "@/components/Dashboard/dashboardViews/DashboardMenu";
import CustomCard from "../../ui/Card/CustomCard";
import NoDashboardSelected from "./NoDashboardSelected";
import { useRouter } from "next/navigation";

const MainDashboardView = () => {
  const dispatch: AppDispatch = useDispatch()
  const [dashboard, setDashboards] = useState<DashboardType>()
  const router = useRouter()

  const { currentDashboard } = useSelector((state: RootState) => state.dashboardReducer)

  const { dashboards, isLoading, error, currentDashboard: currentSelectedDashboard, dashboardCards } = useSelector((state: RootState) => state.dashboardReducer)

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);

  useEffect(() => {

    if (currentSelectedDashboard.id !== '') {
      router.push(`/dashboard/${currentSelectedDashboard.id}`)
      dispatch(getDashboardCards({ dashboardId: currentSelectedDashboard.id }))

    }
  }, [currentSelectedDashboard, dispatch, router])


  const handleLayoutChange = (layout: any, layouts: any) => {
    console.log(layout, layouts)
  };

  return (
    <>
      <div className="flex justify-between flex-wrap gap-2">
        <div className="flex gap-x-10 gap-y-2 flex-wrap">
          <DashboardMenu dashboardsList={dashboards} />
        </div>
      </div>
      <NoDashboardSelected />
    </>
  );
};

export default withDashboardLayout(MainDashboardView);
