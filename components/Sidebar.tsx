"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getLatestVersionNumber, logout } from "@/app/store/slice/authSlice";
import Image from "next/image";
import {
  ClipboardIcon,
  UserIcon,
  BellAlertIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  ArrowLeftStartOnRectangleIcon,
  AdjustmentsHorizontalIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

import axiosInstance from "@/lib/axiosInstance";
import { AppDispatch, RootState } from "@/app/store/store";
import SidebarMenu from "@/app/ui/SidebarMenu";
import { activeSidebar } from "@/utils/helper_functions";

interface SidenavProps {
  color: string;
}

const Sidebar: React.FC<SidenavProps> = ({ color }) => {
  const page = usePathname();
  const [activeMenu, setActiveMenu] = useState<string>(activeSidebar(page));
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { isAdmin, version } = useSelector((state: RootState) => state.authReducer);


  useEffect(() => {
    if(version === ''){
      dispatch(getLatestVersionNumber())
    }
  }, [version, dispatch])

  useEffect(() => {
    setActiveMenu(activeSidebar(page));
  }, [page]);

  const LogoutButtonHandler = async () => {
    await axiosInstance.post("/auth/logout");
    dispatch(logout());
    router.push("/login");
  };

  const menuItems = [
    {
      key: "6",
      title: "Dashboard",
      url: "/dashboard",
      menuKey: "dashboard",
      icon: AdjustmentsHorizontalIcon,
    },
    {
      key: "7",
      title: "Floor Plan",
      url: "/dashboard/floor",
      menuKey: "floor",
      icon: ClipboardIcon,
    },
    {
      key: "8",
      title: "Alerts",
      url: "/dashboard/alerts",
      menuKey: "alerts",
      icon: BellAlertIcon,
    },
    {
      key: "14",
      title: "Alert Logs",
      url: "/dashboard/alert-logs",
      menuKey: "alert-logs",
      icon: BookOpenIcon,
      adminOnly: true,
    },
    {
      key: "9",
      title: "Data Sources",
      url: "/dashboard/data-sources",
      menuKey: "data-sources",
      icon: CircleStackIcon,
    },
    {
      key: "10",
      title: "Devices",
      url: "/dashboard/devices",
      menuKey: "devices",
      icon: DevicePhoneMobileIcon,
    },
    {
      key: "11",
      title: "Reports",
      url: "/dashboard/reports",
      menuKey: "reports",
      icon: ClipboardDocumentListIcon,
    },
    {
      key: "12",
      title: "Users",
      url: "/dashboard/users?tab=active",
      menuKey: "users",
      icon: UserIcon,
      adminOnly: true,
    },
    {
      key: "13",
      title: "Change Logs",
      url: "/dashboard/change-logs",
      menuKey: "change-logs",
      icon: BookOpenIcon,
      adminOnly: true,
    },
  ];

  const accountItems = [
    {
      key: "5",
      title: "Profile",
      url: "/dashboard/profile",
      menuKey: "profile",
      icon: UserIcon,
    },
  ];

  const renderMenuItems = (items: any[]) =>
    items.map((item) => {
      if (item.adminOnly && !isAdmin) return null;
      return (
        <SidebarMenu
          key={item.key}
          title={item.title}
          isActive={activeMenu === item.menuKey}
          icon={
            <item.icon
              width={25}
              className={`${activeMenu === item.menuKey ? "!text-blue-700" : "!text-black"
                }`}
            />
          }
          url={item.url}
        />
      );
    });

  return (
    <div className="h-full flex flex-col justify-between !bg-white border-r">
      <div>
        <div className="brand p-5 pb-0">
          <div className=" flex flex-row items-center justify-center gap-5">
            <div className=" w-20">
              <Image
                src="/OriginLogo.svg"
                alt="Website logo"
                width={100}
                height={100}
                className=" w-full h-full"
              />
            </div>
            <div className="">
              <Image
                src="/new-logo.jpg"
                alt="Website logo"
                width={100}
                height={100}
                className=" w-full h-full"
                unoptimized
              />
            </div>
          </div>
          <div className=" flex justify-center mt-2">
            {version ? <p className=" text-sm">(<strong>Version </strong>{version})</p>: <p className=" text-sm">-</p>}
          </div>
        </div>
        <hr className=" !my-2" />
        <Menu theme="dark" mode="inline">
          <div className="flex flex-col justify-between h-full w-full">
            <div className="h-full">{renderMenuItems(menuItems)}</div>
          </div>
        </Menu>
      </div>
      <Menu theme="light" mode="inline">
        <div className="flex flex-col justify-between h-full">
          <div>
            <Menu.Item className="menu-item-header" key="7">
              Account Pages
            </Menu.Item>
            {renderMenuItems(accountItems)}
            <div key="6" className="!w-auto !rounded-none">
              <div
                className="flex !px-4 flex-row gap-3 mb-2 items-center cursor-pointer hover:bg-blue-50 py-2"
                onClick={LogoutButtonHandler}
              >
                <ArrowLeftStartOnRectangleIcon
                  width={27}
                  className="!text-black"
                />
                <span className="text-black text-lg">Log Out</span>
              </div>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default Sidebar;
