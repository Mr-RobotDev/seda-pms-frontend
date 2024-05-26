"use client";
import { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesStats from "./DevicesStats";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Card, Spin } from "antd";
import LeafLetMap from "./LeafLetMap/LeafLetMap";
import { useDispatch } from "react-redux";
import { setDevicesStats } from "@/app/store/slice/StatisticsSlice";

const MainFloorView = () => {
  const dispatch = useDispatch();

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
    <div>
      <>
        <DevicesStats />
        <Card>
          <div className=" w-full h-full">
            <LeafLetMap />
          </div>
        </Card>
      </>
    </div>
  );
};

export default withDashboardLayout(MainFloorView);
