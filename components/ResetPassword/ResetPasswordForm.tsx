'use client'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Card, Input, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import toast from 'react-hot-toast'

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [key, setKey] = useState('')

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const keyParam = searchParams.get('key')
    if (keyParam) {
      setKey(keyParam)
    }
  }, [searchParams])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (e.target.value !== confirmPassword) {
      setError('Passwords do not match')
    } else {
      setError('')
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (password !== e.target.value) {
      setError('Passwords do not match')
    } else {
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!error && password && confirmPassword) {
      const data = {
        password: password
      }
      try {
        const response = await axiosInstance.post(`/auth/reset-password?key=${key}`, data);
        console.log(response)
        if (response.status === 200) {
          console.log('Password changed successfully.');
          router.push('/');
        } else {
          console.log('Error changing password. Status:', response.status);
        }
      } catch (error) {
        toast.error('Error changing the password');
        console.error('Error changing password:', error);
      }

    } else {
      console.log('Passwords do not match.')
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-4'>
      <Card className='xl:w-4/12 lg:w-5/12 md:w-6/12 w-full'>
        <div>
          <h3 className='text-2xl font-semibold my-2 '>Change Password?</h3>
          <p className='text-sm text-gray-700 mb-5'>
            For security reasons, we do <span className=' font-semibold'>NOT</span> store your password. So rest assured
            that we will never send your password via email.
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <div>
            <label className='font-bold'>Password</label>
            <Input.Password
              placeholder="Enter your Password"
              value={password}
              className=' mt-1'
              onChange={handlePasswordChange}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </div>

          <div>
            <label className='font-bold'>Confirm Password</label>
            <Input.Password
              placeholder="Enter your Password Again"
              value={confirmPassword}
              className=' mt-1'
              onChange={handleConfirmPasswordChange}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <Button type='primary' onClick={handleSubmit} disabled={!!error || !password || !confirmPassword} className=' mt-2'>
            Submit
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ResetPasswordForm
