'use client'
import React, { useEffect, useState } from 'react'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import { Button, Modal, Table, TableProps, Tag, Form, Input, Select, Card } from 'antd';
import axiosInstance from '@/lib/axiosInstance';
import { CheckIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { User } from '@/type'
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

const initialUserState: User = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'User'
}

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
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User>(initialUserState)
  const [form] = Form.useForm()


  const columns: TableProps<any>['columns'] = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      render: (_, { firstName, profile }) => {
        return (
          <div className='flex gap-2 items-center'>
            <div className=' w-12 h-12'>
              <Image
                src={profile ? profile : '/dummyAvatar.png'}
                alt="User avatar"
                className="w-full h-full object-cover rounded-full"
                unoptimized
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className='!text-sm !text-[#000000e0]'>{firstName}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: (_, { role, id }) => {
        let color = role === 'User' ? 'geekblue' : 'volcano';
        return (
          <div className='flex'>
            <div className='w-16'>
              <Tag color={color}>
                {role.toUpperCase()}
              </Tag>
            </div>
            <p onClick={() => changeUserRole(id, role)} className='!text-blue-500 !text-xs hover:underline duration-200 transition-all transform cursor-pointer flex items-end'>Change Role</p>
          </div>
        );
      },
    },
    {
      title: 'Active',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (_, { isActive }) => {
        let component = isActive ? <CheckIcon width={20} /> : <XMarkIcon width={20} />;
        return (
          <span>{component}</span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      dataIndex: 'aactions',
      render: (_, { id }) => {
        return (
          <Link href={`/dashboard/users/${id}`}>
            <div className=' inline px-2 py-1 bg-blue-500 hover:bg-blue-600 duration-150 transition-all transform rounded-md text-white'>
              Activity Logs
            </div>
          </Link>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const changeUserRole = async (userId: string, role: string) => {

    const newRole = role === 'User' ? 'Admin' : 'User'
    try {
      const response = await axiosInstance.patch(`/users/${userId}/update-role`, { role: newRole });
      if (response.status === 200) {
        setUsers((prevState) => {
          return prevState.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
          );
        });
        toast.success('User role changed successfully');
      } else {
        toast.error('Error changing user role');
      }
    } catch (error) {
      console.log('error ->', error);
      toast.error('Error changing user role');
    }

  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setUser(values);
      console.log(values)

      // Make an API call to create the object
      const response = await axiosInstance.post('/users', values);

      if (response.status === 201) {
        // Assuming the API returns the new user object
        setUsers((prevUsers) => [...prevUsers, response.data]);
        toast.success('User created successfully')
        setIsModalOpen(false);
      } else {
        console.log('Error creating user:', response);
      }
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get('/users')
        if (response.status === 200) {
          setUsers(response.data.results)
          console.log(response)
        } else {
          console.log('error ->', response)
        }
      } catch (error: any) {
        console.log('error ->', error)
      } finally {
        setIsModalOpen(false)
      }
    })()
  }, [])

  const handlePagination = (page: number) => {
    console.log(page)
  }

  const handleChange = (changedValues: any, allValues: any) => {
    setUser(allValues);
  };

  return (
    <Card>
      <h1 className="text-3xl font-semibold">Users</h1>
      <div className='p-4 md:px-16'>
        <div className='flex justify-end mb-5'>
          <Button onClick={showModal} type='default'>Add New User</Button>
        </div>
        <Table
          columns={columns}
          dataSource={users}
          scroll={{ x: 500 }}
          loading={users.length === 0}
          pagination={{
            onChange: handlePagination,
          }}
        />
      </div>
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
            onValuesChange={handleChange}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please add the password' }]}
            >
              <Input type="password" />
            </Form.Item>

            <Form.Item label="Role" name="role">
              <Select defaultValue="User">
                <Select.Option value="User">User</Select.Option>
                <Select.Option value="Admin">Admin</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </Card>
  )
}

export default withDashboardLayout(UserMainView)
