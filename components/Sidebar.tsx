"use client";

import React from "react";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/app/store/slice/authSlice";
import Image from "next/image";
import {
  ClipboardIcon,
  UserIcon,
  BellAlertIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  ArrowLeftStartOnRectangleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import axiosInstance from "@/lib/axiosInstance";
import { RootState } from "@/app/store/store";
import SidebarMenu from "@/app/ui/SidebarMenu";

interface SidenavProps {
  color: string;
}

const Sidebar: React.FC<SidenavProps> = ({ color }) => {
  const page = usePathname().split("/");
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.authReducer);

  const LogoutButtonHandler = async () => {
    await axiosInstance.post("/auth/logout");
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="h-full flex flex-col justify-between !bg-white border-r">
      <div>
        <div className="brand p-5 pb-0">
          <div>
            <Image
              src="/logo.svg"
              alt="Website logo"
              width={100}
              height={100}
              className=" w-full h-full"
            />
          </div>
        </div>
        <hr />
        <Menu theme="dark" mode="inline">
          <div className=" flex flex-col justify-between h-full w-full">
            <div className=" h-full">
              <SidebarMenu
                key="6"
                title="Dashboard"
                page={page}
                isActive={page.at(-1) === "dashboard"}
                icon={
                  <AdjustmentsHorizontalIcon
                    width={25}
                    className={` w-7 h-7 ${
                      page.at(-1) === "dashboard"
                        ? "!text-blue-700 "
                        : "!text-black"
                    }`}
                  />
                }
                url={"/dashboard"}
              />

              <SidebarMenu
                key="7"
                title="Floor Plan"
                page={page}
                isActive={page.includes("floor")}
                icon={
                  <ClipboardIcon
                    width={25}
                    className={`${
                      page.includes("floor") ? "!text-blue-700 " : "!text-black"
                    }`}
                  />
                }
                url={"/dashboard/floor"}
              />

              <SidebarMenu
                key="8"
                title="Alerts"
                page={page}
                isActive={page.includes("alerts")}
                url={"/dashboard/alerts"}
                icon={
                  <BellAlertIcon
                    width={25}
                    className={`${
                      page.includes("alerts")
                        ? "!text-blue-700 "
                        : "!text-black"
                    }`}
                  />
                }
              />

              <SidebarMenu
                key="9"
                title="Data Sources"
                page={page}
                isActive={page.includes("data-sources")}
                url={"/dashboard/data-sources"}
                icon={
                  <CircleStackIcon
                    width={25}
                    className={`${
                      page.includes("data-sources")
                        ? "!text-blue-700 "
                        : "!text-black"
                    }`}
                  />
                }
              />
              <SidebarMenu
                key="10"
                title="Devices"
                page={page}
                isActive={page.includes("devices")}
                icon={
                  <DevicePhoneMobileIcon
                    width={25}
                    className={`${
                      page.includes("devices")
                        ? "!text-blue-700 "
                        : "!text-black"
                    }`}
                  />
                }
                url={"/dashboard/devices"}
              />
              {user?.role === "Admin" && (
                <SidebarMenu
                  key="11"
                  title="Users"
                  page={page}
                  isActive={page.includes("users")}
                  icon={
                    <UserIcon
                      width={25}
                      className={`${
                        page.includes("users")
                          ? "!text-blue-700 "
                          : "!text-black"
                      }`}
                    />
                  }
                  url={"/dashboard/users"}
                />
              )}
            </div>
          </div>
        </Menu>
      </div>
      <Menu theme="light" mode="inline">
        <div className=" flex flex-col justify-between h-full">
          <div>
            <Menu.Item className="menu-item-header" key="7">
              Account Pages
            </Menu.Item>
            <SidebarMenu
              key="5"
              title="Profile"
              page={page}
              isActive={page.includes("profile")}
              icon={
                <UserIcon
                  width={25}
                  className={`${
                    page.includes("profile") ? "!text-blue-700 " : "!text-black"
                  }`}
                />
              }
              url={"/dashboard/profile"}
            />
            <div key="6" className="!w-auto !rounded-none py-2 !px-5">
              <div
                className="py-2 flex flex-row gap-3 items-center"
                onClick={LogoutButtonHandler}
              >
                <ArrowLeftStartOnRectangleIcon
                  width={25}
                  className=" !text-black"
                />
                <span className="label text-black">Log Out</span>
              </div>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default Sidebar;
