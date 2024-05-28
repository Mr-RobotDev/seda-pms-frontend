import SingleDeviceView from "@/components/Dashboard/Device/SingleDeviceView"
const DevicePage = (props: any) => {
  const { id } = props.params

  return id && <SingleDeviceView id={id} />

}

export default DevicePage