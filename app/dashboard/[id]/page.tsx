import SingleDashboardView from "@/components/Dashboard/dashboardViews/SingleDashboardView"
const SingleDashboardPage = (props: any) => {
  const { id } = props.params

  return id && <SingleDashboardView id={id} />

}

export default SingleDashboardPage