"use client";
import React from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesTable from "./DevicesTable";
import { Card } from "antd";
import QRParentComponent from "@/components/QRCodePlugin/QRParentComponent";

const DeviceMainView = () => {
  return (
    <Card>
      <div className=" flex flex-row justify-between items-center">
        <h1 className=" text-3xl font-semibold mb-0">Devices</h1>
        <QRParentComponent />
      </div>
      <DevicesTable />
    </Card>
  );
};

export default withDashboardLayout(DeviceMainView);
