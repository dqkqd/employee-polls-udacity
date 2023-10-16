import { Outlet } from "react-router-dom"

const Dashboard = () => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
