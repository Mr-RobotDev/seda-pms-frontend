"use client";
import withDashboardLayout from "@/hoc/withDashboardLayout";

const MainDashboardView = () => {
  return (
    <div>
      <h1 className=" text-3xl font-semibold">Dashboard</h1>
    </div>
  )
};

export default withDashboardLayout(MainDashboardView);
