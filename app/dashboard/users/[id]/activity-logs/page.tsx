'use client'
import { RootState } from "@/app/store/store"
import UserActivityLog from "@/components/Dashboard/Users/UserActivityLog"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSelector } from "react-redux"
const UserPage = (props: any) => {
  const { user } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()

  useEffect(() => {
    if (user && user?.role !== 'Admin') {
      router.push('/dashboard/floor')
    }
  }, [router, user])

  const { id } = props.params

  return (
    <>
      {user?.role === 'Admin' && id &&
        <UserActivityLog id={id} />
      }
    </>
  )

}

export default UserPage