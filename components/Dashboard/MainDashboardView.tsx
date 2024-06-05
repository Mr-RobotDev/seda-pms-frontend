"use client";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import Image from "next/image";

const MainDashboardView = () => {
  return (
    <div className=" flex justify-center items-center mt-20">
      <div className=" max-w-96 max-h-96">
        <Image
          src="/comming-soon.svg"
          alt="Comming Soon"
          className=" w-full h-full"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default withDashboardLayout(MainDashboardView);
