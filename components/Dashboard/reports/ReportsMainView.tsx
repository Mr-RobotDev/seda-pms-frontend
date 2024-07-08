"use client";
import React, { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import ReportsTable from "./ReportsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import DashboardMenu from "../dashboardViews/DashboardMenu";
import { AppDispatch, RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboards,
  setCurrentDashboard,
} from "@/app/store/slice/dashboardSlice";

const ReportsMainView = () => {
  const [createNewReport, setCreateNewReport] = useState(false);
  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  const { dashboards, currentDashboard } = useSelector(
    (state: RootState) => state.dashboardReducer
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);

  useEffect(() => {
    console.log(currentDashboard)
  }, [currentDashboard])


  return (
    <div>
      <>
        <>
          <h1 className=" text-3xl font-semibold">Reports</h1>
          <div className=" flex items-center gap-1 justify-between flex-wrap">
            <div className="flex-1  sm:flex-none">
              <DashboardMenu
                dashboardsList={dashboards}
                routingFunctionality={false}
              />
            </div>
            {!createNewReport && isAdmin && (
              <div className="w-auto">
                <div
                  className="flex justify-end sm:flex-none"
                  onClick={() => setCreateNewReport(true)}
                >
                  <span className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center">
                    <FontAwesomeIcon icon={faCirclePlus} />
                    Create Report
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
        {currentDashboard.id !== '' && (
          <ReportsTable
            currentDashboard={currentDashboard}
            createNewReport={createNewReport}
            setCreateNewReport={setCreateNewReport}
          />
        )}
      </>
    </div>
  );
};

export default withDashboardLayout(ReportsMainView);
