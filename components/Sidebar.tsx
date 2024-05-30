"use client";

import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/app/store/slice/authSlice";
import Image from "next/image";
import { ClipboardIcon, UserIcon, BellAlertIcon, CircleStackIcon, DevicePhoneMobileIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { MdOutlineDashboard } from "react-icons/md";


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

  const dashboard = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      />
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      />
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      />
    </svg>
  );

  const tables = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={12}
      className=" fill-inherit"
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        className=" fill-inherit"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        className=" fill-inherit"
      />
    </svg>
  );

  const profile = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      />
    </svg>
  );

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
                icon={<MdOutlineDashboard width={25} className={` w-7 h-7 ${page.at(-1) === "dashboard" ? '!text-blue-700 ' : "!text-black"}`} />}
                url={'/dashboard'}
              />

              <SidebarMenu
                key="7"
                title="Floor Plan"
                page={page}
                isActive={page.includes("floor")}
                icon={<ClipboardIcon width={25} className={`${page.includes("floor") ? '!text-blue-700 ' : "!text-black"}`} />}
                url={'/dashboard/floor'}
              />

              <SidebarMenu
                key="8"
                title="Alerts"
                page={page}
                isActive={page.includes("alerts")}
                url={'#'}
                icon={<BellAlertIcon width={25} className={`${page.includes("alerts") ? '!text-blue-700 ' : "!text-black"}`} />}
              />

              <SidebarMenu
                key="9"
                title="Data Sources"
                page={page}
                isActive={page.includes("date-source")}
                icon={<CircleStackIcon width={25} className={`${page.includes("date-source") ? '!text-blue-700 ' : "!text-black"}`} />}
                url={'#'}
              />
              <SidebarMenu
                key="10"
                title="Devices"
                page={page}
                isActive={page.includes("devices")}
                icon={<DevicePhoneMobileIcon width={25} className={`${page.includes("devices") ? '!text-blue-700 ' : "!text-black"}`} />}
                url={'/dashboard/devices'}
              />
              {user?.role === "Admin" && (
                <SidebarMenu
                  key="10"
                  title="Users"
                  page={page}
                  isActive={page.includes("users")}
                  icon={<UserIcon width={25} className={`${page.includes("users") ? '!text-blue-700 ' : "!text-black"}`} />}
                  url={'/dashboard/users'}
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
              icon={<UserIcon width={25} className={`${page.includes("profile") ? '!text-blue-700 ' : "!text-black"}`} />}
              url={'/dashboard/profile'}
            />
            <div key="6" className="!w-auto !rounded-none py-2 !px-5">
              <div className="py-2 flex flex-row gap-3 items-center" onClick={LogoutButtonHandler}>
                <ArrowLeftStartOnRectangleIcon width={25} className=" !text-black" />
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
