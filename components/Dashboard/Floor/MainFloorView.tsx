"use client";
import { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesStats from "./DevicesStats";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Card, Spin } from "antd";
import LeafLetMap from "./LeafLetMap";

const MainFloorView = () => {
  const [devicesStats, setDevicesStats] = useState();

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/devices/stats");
        if (response.status === 200) {
          setDevicesStats(response.data);
        } else {
          toast.error("Error fetching devices stats");
        }
      } catch (error) {
        console.log("error->", error);
        toast.error("Error fetching devices stats");
      }
    })();
  }, []);

  return (
    <div>
      {devicesStats ? (
        <>
          <DevicesStats devicesStats={devicesStats} />
          <Card>
            <div className=" w-full h-full">
              <LeafLetMap />
            </div>
          </Card>
        </>
      ) : (
        <div className=" flex justify-center">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default withDashboardLayout(MainFloorView);
