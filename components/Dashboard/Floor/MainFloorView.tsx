"use client";
import { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesStats from "./DevicesStats";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Card, Col, Row, Spin } from "antd";
import LeafLetMap from "./LeafLetMap/LeafLetMap";
import { useDispatch, useSelector } from "react-redux";
import { setDevicesStats } from "@/app/store/slice/StatisticsSlice";
import { RootState } from "@/app/store/store";
import DeviceStatsPieChart from "./DeviceStatsPieChart";
import FullScreenButton from "@/components/ui/FullScreenButton/FullScreenButton";

const MainFloorView = () => {
  const dispatch = useDispatch();
  const deviceStats = useSelector(
    (state: RootState) => state.statisticsReducer
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/devices/stats");
        if (response.status === 200) {
          dispatch(setDevicesStats(response.data));
        } else {
          setError(true);
          toast.error("Error fetching devices stats");
        }
      } catch (error) {
        console.log("error->", error);
        setError(true);
        toast.error("Error fetching devices stats");
      }
    })();
  }, [dispatch]);

  return (
    <>
      <div className=" flex items-center justify-between mb-3">
        <h1 className=" text-3xl font-semibold">Floor Plan</h1>
        <FullScreenButton />
      </div>
      {error ? (
        <h1 className=" text-2xl font-semibold mt-20 text-center">
          Error Loading the Resources
        </h1>
      ) : (
        <div>
          {deviceStats.totalDevices === 0 ? (
            <div className="  w-full h-full flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <DevicesStats />
              <Row className="rowgap-vbox" gutter={[24, 0]}>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={16}
                  xl={16}
                  className="mb-24 md:mb-0"
                >
                  <Card>
                    <LeafLetMap />
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <Card className="!p-0">
                    <h2 className=" text-xl font-semibold">Devices Status</h2>
                    <DeviceStatsPieChart />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default withDashboardLayout(MainFloorView);
