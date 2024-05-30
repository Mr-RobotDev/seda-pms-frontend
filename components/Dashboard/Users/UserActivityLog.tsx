"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import axiosInstance from "@/lib/axiosInstance";
import { DatePicker, Spin, Tag } from "antd";
import toast from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import { formatDateTime, formatToTitleCase } from "@/lib/helperfunctions";
import "./UserTable.css";
import Link from "next/link";
import { useTimeAgo } from "next-timeago";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  EyeIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/16/solid";

const { RangePicker } = DatePicker;

interface UserActivityLogProps {
  id: string;
}

const paginationInitialState = {
  current: 1,
  pageSize: 50,
  total: 0,
};

interface ActivityLog {
  page: string;
  action: string;
  createdAt: string;
  id: string;
  user: {
    firstName: string;
    lastName: string;
    id: string;
  };
  device?: {
    name: string;
    id: string;
  };
  userAgent: string;
}

const UserActivityLog = ({ id }: UserActivityLogProps) => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("day"),
    dayjs().endOf("day"),
  ]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState(paginationInitialState.current);
  const [pageSize, setPageSize] = useState(paginationInitialState.pageSize);
  const [total, setTotal] = useState(paginationInitialState.total);
  const { TimeAgo } = useTimeAgo();
  const initialFetchRef = useRef(true);

  const actionTailwindColorMapping: { [key: string]: string } = {
    viewed: "bg-blue-400",
    "logged in": "bg-green-400",
    default: "bg-red-400",
    updated: "bg-orange-400",
  };

  const actionIcons: { [key: string]: any } = {
    viewed: <EyeIcon width={20} className=" text-white" />,
    "logged in": (
      <ArrowLeftEndOnRectangleIcon
        width={20}
        className=" text-white rotate-180"
      />
    ),
    "logged out": (
      <ArrowLeftStartOnRectangleIcon width={20} className=" text-white" />
    ),
    default: <PresentationChartBarIcon width={20} className=" text-white" />,
  };

  const fetchLogs = useCallback(
    async (page: number, limit: number) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/logs`, {
          params: {
            page,
            limit,
            from: range[0].toISOString(),
            to: range[1].toISOString(),
            user: id,
          },
        });
        if (response.status === 200) {
          setActivityLogs((prevLogs) => [
            ...prevLogs,
            ...response.data.results.filter(
              (log: ActivityLog) => !prevLogs.find((l) => l.id === log.id)
            ),
          ]);
          setCurrent(response.data.pagination.page);
          setPageSize(response.data.pagination.limit);
          setTotal(response.data.pagination.totalResults);
        } else {
          toast.error("Error fetching the activity logs");
        }
      } catch (error) {
        toast.error("Error fetching the activity logs");
      } finally {
        setLoading(false);
      }
    },
    [id, range]
  );

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length > 0) {
      setRange(dates);
      setCurrent(paginationInitialState.current);
      setPageSize(paginationInitialState.pageSize);
      setActivityLogs([]);
      initialFetchRef.current = true;
    } else {
      toast.error("Date Range cannot be empty");
    }
  };

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          activityLogs.length < total
        ) {
          setCurrent((prevCurrent) => prevCurrent + 1);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 1.0,
      }
    );

    const currentSentinalRef = sentinelRef.current;

    if (currentSentinalRef) {
      observer.observe(currentSentinalRef);
    }

    return () => {
      if (currentSentinalRef) {
        observer.unobserve(currentSentinalRef);
      }
    };
  }, [loading, activityLogs.length, total]);

  useEffect(() => {
    if (initialFetchRef.current) {
      initialFetchRef.current = false;
      fetchLogs(current, pageSize);
    } else if (current > 1) {
      fetchLogs(current, pageSize);
    }
  }, [current, fetchLogs, pageSize]);

  const getRelativeDateTag = (date: Dayjs) => {
    const now = dayjs();
    if (date.isSame(now, "day")) {
      return "Today";
    } else if (date.isSame(now.subtract(1, "day"), "day")) {
      return "Yesterday";
    } else {
      return date.format("MMMM D, YYYY");
    }
  };

  const renderLogs = () => {
    let lastDateTag = "";
    return activityLogs.map((item, index) => {
      const logDate = dayjs(item.createdAt);
      const dateTag = getRelativeDateTag(logDate);
      const showDateTag = dateTag !== lastDateTag;
      lastDateTag = dateTag;

      return (
        <div key={index}>
          {showDateTag && (
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <Tag color="blue" className="!text-base mx-4">
                {dateTag}
              </Tag>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          )}
          <div className="p-3 mb-3 rounded-lg">
            <div className="flex flex-row items-start md:items-center gap-1">
              <div>
                <div
                  className={`w-10 h-10 rounded-full mr-5 flex justify-center items-center ${
                    actionTailwindColorMapping[item.action] ||
                    actionTailwindColorMapping["default"]
                  }`}
                >
                  {actionIcons[item.action] || actionIcons["default"]}
                </div>
              </div>
              <div className=" flex flex-col">
                <div>
                  <p className="!mb-0 !text-xs">
                    {item.action} -{" "}
                    <span className=" !text-[10px]">
                      <TimeAgo date={new Date(item.createdAt)} locale="en" />
                    </span>
                  </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                  <p className="!mb-0">
                    {item.user.firstName + " " + item.user.lastName}
                  </p>
                  <p className="!mb-0">
                    <strong>{item.action}</strong>
                  </p>

                  {item.userAgent && (
                    <p className="!mb-0">
                      on <strong>{item.userAgent}</strong>
                    </p>
                  )}

                  {item.page && (
                    <p className="!mb-0">{formatToTitleCase(item.page)}</p>
                  )}
                  {item.device && (
                    <Link
                      target="_blank"
                      className="text-blue-500"
                      href={`/dashboard/devices/${item.device.id}`}
                    >
                      ({item.device.name})
                    </Link>
                  )}
                  <p className="!mb-0">
                    at{" "}
                    <strong>{`${
                      formatDateTime(item.createdAt).formattedDate
                    }`}</strong>{" "}
                    <span>{`${
                      formatDateTime(item.createdAt).formattedTime
                    }`}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <h1 className="text-3xl font-semibold !mb-4 md:!mb-0">
          User Activity Logs
        </h1>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <p className="mb-0 font-semibold">Date Range: </p>
          <RangePicker
            onChange={handleRangeChange}
            showTime
            defaultValue={range}
          />
        </div>
      </div>
      <div className="overflow-auto h-[700px]">
        {" "}
        {/* Set a fixed height for the scrollable container */}
        {activityLogs.length === 0 && !loading && (
          <p className="text-xl text-center">No Activity Logs</p>
        )}
        {renderLogs()}
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <Spin />}
        </div>
      </div>
    </div>
  );
};

export default withDashboardLayout(UserActivityLog);
