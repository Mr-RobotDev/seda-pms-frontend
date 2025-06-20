"use client";
import React, { useEffect, useState, useCallback } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import {
  Button,
  Modal,
  Table,
  TableProps,
  Tag,
  Form,
  Input,
  Tabs,
  Card,
} from "antd";
import axiosInstance from "@/lib/axiosInstance";
import { User } from "@/type";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { SyncOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { formatToTitleCase } from "@/utils/helper_functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import CustomMenu from "@/components/ui/Menu/CustomMenu";
import { userOrganizationOptions, userRoleOptions } from "@/utils/form";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

const initialUserState: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "User",
  organization: "Origin Smart",
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const UserMainView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>(initialUserState);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user: loggedInUser } = useSelector((state: RootState) => state.authReducer);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState("active");

  const fetchUsers = useCallback(async (page: number, limit: number, isActive: boolean) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users", {
        params: { page, limit, isActive },
      });
      if (response.status === 200) {
        setUsers(response.data.results);
        setCurrentPage(response.data.pagination.page);
        setPageSize(response.data.pagination.limit);
        setTotalItems(response.data.pagination.totalResults);
      } else {
        console.log("error ->", response);
      }
    } catch (error) {
      console.log("error ->", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role !== "Admin") {
      router.push("/dashboard");
    }
  }, [loggedInUser, router]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tab = queryParams.get("tab") || "active";
    setActiveTab(tab);
    fetchUsers(currentPage, pageSize, tab === "active");
  }, [fetchUsers, currentPage, pageSize]);

  const handleTableChange = (newPagination: any) => {
    setCurrentPage(newPagination);
    setPageSize(10);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);

    const queryParams = new URLSearchParams();
    queryParams.append('tab', key);

    const queryString = queryParams.toString();
    router.push(`/dashboard/users?${queryString}`);
    fetchUsers(1, pageSize, key === "active");
  };

  const toggleStatus = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/users/${id}/toggle-active`);
      if (response.status === 200) {
        toast.success("User status updated successfully");
        const updatedUsers = users.map((user) =>
          user.id === id ? { ...user, isActive: !user.isActive } : user
        );
        setUsers(updatedUsers);
      } else {
        toast.error("Error, updating the user status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error, updating the user status");
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "User",
      dataIndex: "user",
      render: (_, { firstName, profile, lastName }) => {
        return (
          <div className="flex gap-2 items-center">
            <div className=" w-12 h-12">
              <Image
                src={profile ? profile : "/dummyAvatar.png"}
                alt="User avatar"
                className="w-full h-full object-cover rounded-full"
                unoptimized
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="!text-sm !text-[#000000e0]">
                {firstName + " " + lastName}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Organization",
      key: "organization",
      dataIndex: "organization",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (_, { role }) => {
        let color = role === "User" ? "geekblue" : "volcano";
        return (
          <div className="flex">
            <div className="w-16">
              <Tag color={color}>{formatToTitleCase(role)}</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "isActive",
      dataIndex: "isActive",
      render: (_, { id, isActive }) => {
        let color = isActive ? "green" : "red";
        let statusText = isActive ? "Active" : "Inactive";
        return (
          <div className="flex items-center">
            <div className="w-16">
              <Tag color={color}>{statusText}</Tag>
            </div>
            <Button
              type="link"
              icon={<SyncOutlined />}
              onClick={() => toggleStatus(id)}
              title="Click to toggle status"
            />
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_, { id, role }) => {
        return (
          <div className=" flex flex-row gap-4 items-center">
            <p
              onClick={() => changeUserRole(id, role)}
              className="!text-blue-500 hover:text-blue-600 duration-200 transition-all transform cursor-pointer flex flex-row gap-2 items-center"
            >
              <span>Change Role</span>
              <UserSwitchOutlined />
            </p>
            <Link target="_blank" href={`/dashboard/users/${id}/activity-logs`}>
              <div className="group px-2 py-1 text-blue-500 hover:text-blue-600 duration-150 transition-all transform rounded-md flex flex-row gap-1">
                Activity Logs
                <ArrowUpRightIcon
                  width={16}
                  className="transform transition-transform duration-150"
                />
              </div>
            </Link>
          </div>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const changeUserRole = async (userId: string, role: string) => {
    const newRole = role === "User" ? "Admin" : "User";
    try {
      const response = await axiosInstance.patch(
        `/users/${userId}/update-role`,
        { role: newRole }
      );
      if (response.status === 200) {
        setUsers((prevState) => {
          return prevState.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          );
        });
        toast.success("User role changed successfully");
      } else {
        toast.error("Error changing user role");
      }
    } catch (error) {
      console.log("error ->", error);
      toast.error("Error changing user role");
    }
  };

  const handleOk = async () => {
    try {
      delete user.id;
      const response = await axiosInstance.post("/users", user);
      if (response.status === 200) {
        setUsers((prevUsers) => [...prevUsers, response.data.user]);
        toast.success("User created successfully");
        setIsModalOpen(false);
      } else {
        console.log("Error creating user:", response);
      }
    } catch (error) {
      toast.error('Error creating user');
      console.log("Validate Failed:", error);
    } finally {
      setUser(initialUserState);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    loggedInUser?.role === "Admin" && (
      <Card>
        <div className=" flex flex-row justify-between items-center">
          <div className=" flex items-center justify-center my-auto">
            <h1 className="text-3xl font-semibold !mb-0">Users</h1>
          </div>
          <div>
            <div className="flex justify-center" onClick={showModal}>
              <span className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center">
                <FontAwesomeIcon icon={faCirclePlus} />
                Create New User
              </span>
            </div>
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <Tabs.TabPane tab="Active Users" key="active">
            <Table
              columns={columns}
              dataSource={users}
              scroll={{ x: 500 }}
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: handleTableChange,
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Inactive Users" key="inactive">
            <Table
              columns={columns}
              dataSource={users}
              scroll={{ x: 500 }}
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: handleTableChange,
              }}
            />
          </Tabs.TabPane>
        </Tabs>

        <Modal
          title="Create New User"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Create User"
          cancelText="Cancel"
        >
          <div>
            <Form
              {...formItemLayout}
              form={form}
              variant="filled"
              style={{ maxWidth: 600 }}
            >
              <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: "First name is required" }]}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  className="custom-form-item"
                >
                  <Input
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    value={user.firstName}
                  />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: "Last name is required" }]}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  className="custom-form-item"
                >
                  <Input
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    value={user.lastName}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="custom-form-item"
              >
                <Input
                  type="email"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  value={user.email}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please add the password" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="custom-form-item"
              >
                <Input
                  type="password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  value={user.password}
                />
              </Form.Item>

              <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2 !mb-8">
                <div>
                  <label>Role</label>
                  <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0">
                    <CustomMenu
                      isAdmin={true}
                      handleTypeChange={(value: string[]) => setUser({ ...user, role: value[0] })}
                      options={userRoleOptions}
                      initialValue={[user.role as string]}
                    />
                  </div>
                </div>
                <div>
                  <label>Organization</label>
                  <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0">
                    <CustomMenu
                      isAdmin={true}
                      handleTypeChange={(value: string[]) => setUser({ ...user, organization: value[0] })}
                      options={userOrganizationOptions}
                      initialValue={[user.organization as string]}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </Card>
    )
  );
};

export default withDashboardLayout(UserMainView);
