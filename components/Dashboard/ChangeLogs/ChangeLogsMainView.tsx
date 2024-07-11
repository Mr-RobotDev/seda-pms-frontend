"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import axiosInstance from "@/lib/axiosInstance";
import { Card, DatePicker, Modal, Tag } from "antd";
import toast from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import { formatDateTime } from "@/utils/helper_functions";
import "./changeLog.css";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { PrimaryInput } from "@/components/ui/Input/Input";
import TextArea from "antd/es/input/TextArea";
import LoadingWrapper from "@/components/ui/LoadingWrapper/LoadingWrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;

interface ChangeLogs {
  version: string;
  change: string
  createdAt: string;
  id: string;
}

interface ChangeLogFormData {
  version: string;
  change: string;
}

const defaultState: ChangeLogFormData = {
  version: '',
  change: '',
}

const ChangeLogsMainView = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'day').startOf('day'),
    dayjs().startOf('day').add(1, 'day').subtract(1, 'millisecond'),
  ]);
  const [activityLogs, setActivityLogs] = useState<ChangeLogs[]>([]);
  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  const [loading, setLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [error, setError] = useState({
    version: '',
    change: '',
    isValid: true,
  })
  const router = useRouter();
  const initialFetchRef = useRef(true);
  const [formData, setFormData] = useState<ChangeLogFormData>(defaultState);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      toast.error('Cannot Access this page')
    }
  }, [isAdmin, router])

  const handleCreateNewLog = async () => {
    const versionRegex = /^\d+\.\d+\.\d+$/;
    let validationErrors = {
      version: '',
      change: '',
      isValid: true,
    };

    if (!versionRegex.test(formData.version)) {
      validationErrors.version = "Version must be in the format X.X.X";
      validationErrors.isValid = false;
    }

    if (formData.change.trim() === "") {
      validationErrors.change = "Change description cannot be empty";
      validationErrors.isValid = false;
    }

    setError(validationErrors);

    if (validationErrors.isValid) {
      setCreateLoading(true)
      try {
        const response = await axiosInstance.post(`/changelogs`, formData)
        if (response.status === 200) {
          toast.success("Change log created successfully");
          setActivityLogs([response.data, ...activityLogs]);
        }
      } catch (error) {
        console.log('Error->', error)
      } finally {
        setIsModalOpen(false);
        setFormData(defaultState)
        setCreateLoading(false)
      }
    }

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchLogs = useCallback(
    async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/changelogs`, {
          params: {
            from: range[0].toISOString(),
            to: range[1].toISOString(),
          },
        });
        if (response.status === 200) {
          console.log(response.data)
          setActivityLogs(response.data)
        } else {
          toast.error("Error fetching the activity logs");
        }
      } catch (error) {
        toast.error("Error fetching the activity logs");
      } finally {
        setLoading(false);
      }
    },
    [range]
  );

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length > 0) {
      setRange(dates);
      setActivityLogs([]);
      initialFetchRef.current = true;
    } else {
      toast.error("Date Range cannot be empty");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData(prevState => {
      if (prevState) {
        return {
          ...prevState,
          [name]: value,
        }
      }
      return prevState;
    });
  };

  const renderLogs = () => {
    let lastDateTag = "";
    return activityLogs?.map((item, index) => {
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
            <div className="flex flex-row items-start gap-1">
              <div>
                <div
                  className={`w-6 h-6 rounded-full flex justify-center items-center mt-[2px]`}
                >
                  <InformationCircleIcon />
                </div>
              </div>
              <div className=" flex flex-col">
                <div className=" flex flex-row items-end gap-2">
                  <p className=" font-semibold text-xl mb-0 ">{item.version}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                  <p className="!mb-0">
                    {item.change}
                  </p>
                  <p className="!mb-0">
                    at{" "}
                    <strong>{`${formatDateTime(item.createdAt).formattedDate
                      }`}</strong>{" "}
                    <span>{`${formatDateTime(item.createdAt).formattedTime
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
    isAdmin && <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div className=" flex flex-row w-full md:w-auto justify-between items-center !mb-4 md:!mb-0">
          <h1 className="text-3xl font-semibold !mb-0">
            Change Logs
          </h1>
          <div className="block md:hidden">
            <span
              onClick={showModal}
              className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faCirclePlus} />
              Create New Log
            </span>
          </div>
        </div>
        <div className=" flex flex-col md:flex-row items-end gap-4 w-full md:w-auto">
          <div className=" w-full md:w-auto order-2 md:order-1">
            <p className=" text-sm mb-1">Date Range:</p>
            <RangePicker
              onChange={handleRangeChange}
              defaultValue={range}
              className="w-full"
            />
          </div>
          <div className=" hidden md:block order-1 md:order-2">
            <span
              onClick={showModal}
              className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faCirclePlus} />
              Create New Log
            </span>
          </div>
        </div>
      </div>
      <Card>
        <LoadingWrapper loading={loading}>
          <div className="overflow-auto h-[700px]">
            {" "}
            {activityLogs?.length === 0 && !loading && (
              <p className="text-xl text-center">No Change Logs</p>
            )}
            {renderLogs()}

          </div>
        </LoadingWrapper>
      </Card>
      <Modal title="Add New Change Log" open={isModalOpen} onOk={handleCreateNewLog} okText="Create" onCancel={handleCancel}>
        <LoadingWrapper loading={createLoading}>
          <div className=" py-8 flex flex-col gap-5">
            <div>
              <p className=" font-semibold mb-1">Version</p>
              <PrimaryInput
                value={formData.version}
                onChange={handleChange}
                placeholder="X.X.X"
                name="version"
              />
              {!error.isValid && <p className=" mb-0 text-red-500">{error.version}</p>}
            </div>
            <div>
              <p className=" font-semibold mb-1">Changings in this version ?</p>
              <TextArea
                value={formData.change}
                onChange={handleChange}
                rows={5}
                className=" !text-black !font-medium"
                placeholder="Describe the changes made in this version"
                name="change"
              />
              {!error.isValid && <p className=" mb-0 text-red-500">{error.change}</p>}
            </div>
          </div>
        </LoadingWrapper>
      </Modal>
    </>
  );
};

export default withDashboardLayout(ChangeLogsMainView);
