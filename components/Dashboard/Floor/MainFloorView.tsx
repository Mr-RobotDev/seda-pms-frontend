"use client";
import { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesStats from "./DevicesStats";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Card, Spin } from "antd";
import LeafLetMap from "./LeafLetMap/LeafLetMap";
import { useDispatch, useSelector } from "react-redux";
import { setDevicesStats } from "@/app/store/slice/StatisticsSlice";
import { RootState } from "@/app/store/store";

const MainFloorView = () => {
  const dispatch = useDispatch();
  const deviceStats = useSelector((state: RootState) => state.statisticsReducer)

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/devices/stats");
        if (response.status === 200) {
          dispatch(setDevicesStats(response.data))
        } else {
          toast.error("Error fetching devices stats");
        }
      } catch (error) {
        console.log("error->", error);
        toast.error("Error fetching devices stats");
      }
    })();
  }, [dispatch]);

  return (
    <>
      <div>
        <h1 className=" text-3xl font-semibold">Floor</h1>
        {deviceStats.totalDevices === 0 ?
          <div className="  w-full h-full flex justify-center items-center">
            <Spin size="large" />
          </div>
          :
          <>
            <DevicesStats />
            <Card>
              <div className=" w-full h-full">
                <LeafLetMap />
              </div>
            </Card>
          </>
        }
      </div>
    </>
  );
};

export default withDashboardLayout(MainFloorView);
