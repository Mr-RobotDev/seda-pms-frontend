import SingleDeviceView from "@/components/Dashboard/Device/SingleDeviceView"
import UserActivityLog from "@/components/Dashboard/Users/UserActivityLog"
const UserPage = (props: any) => {
  const { id } = props.params

  return id && <UserActivityLog id={id} />

}

export default UserPage