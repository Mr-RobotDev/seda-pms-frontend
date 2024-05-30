'use client'
import { RootState } from "@/app/store/store"
import UserMainView from "@/components/Dashboard/Users/UserMainView"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

const UsersPage = () => {
  const { user } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()

  useEffect(() => {
    if(user && user?.role !== 'Admin'){
      router.push('/dashboard/floor')
    }
  }, [router, user])

  return (
    <div>
      {user?.role === 'Admin' && <UserMainView /> }
    </div>
  )
}

export default UsersPage