import SingleDeviceView from "@/components/Dashboard/Device/SingleDeviceView"
const DevicePage = (props: any) => {
  const { oem } = props.params

  return oem && <SingleDeviceView oem={oem} />

}

export default DevicePage