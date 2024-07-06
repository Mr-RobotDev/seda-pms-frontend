'use client'
import React, { useState } from 'react'
import { PrimaryInput } from '../ui/Input/Input'
import { Button, Card } from 'antd'
import { toast } from 'react-hot-toast'
import axiosInstance from '@/lib/axiosInstance'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValidEmail(validateEmail(value))
  }

  const handleSubmit = async () => {
    if (!isValidEmail) {
      toast.error('Please enter a valid email address')
      return
    }

    const formData = {
      email,
    }

    try {
      const response = await axiosInstance.post('/auth/forgot-password', formData)
      if (response.status === 200) {
        toast.success('Reset instructions sent to your email')
      } else {
        toast.error('Error sending reset instructions')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-4'>
      <Card className=''>
        <Link
          className="text-blue-500 cursor-pointer flex flex-row gap-2 items-center group"
          href={'/login'}
        >
          <ArrowLeftIcon className="w-3 duration-200 group-hover:text-blue-700" />
          <p className="!mb-0 text-blue-500 cursor-pointer duration-200 group-hover:text-blue-700">
            Back to login
          </p>
        </Link>
        <div className='flex flex-col rounded-md w-[350px] sm:w-[400px] md:w-96 mx-auto'>
          <div>
            <h3 className='text-2xl font-semibold my-2 '>Forgot Password?</h3>
            <p className='text-sm text-gray-700 mb-5'>
              Enter the email address you used when you joined and we’ll send
              you instructions to reset your password.
            </p>
          </div>
          <label className="!text-base font-bold !mb-1">Email</label>
          <PrimaryInput
            name="email"
            value={email}
            onChange={handleEmailChange}
            className='w-full'
          />
          {!isValidEmail && (
            <p className='!text-red-500 text-sm mt-1'>
              Please enter a valid email address
            </p>
          )}
          <Button
            type='primary'
            size='large'
            disabled={email === '' || !isValidEmail}
            className='mt-7'
            onClick={handleSubmit}
          >
            Send Reset Instructions
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPasswordForm
