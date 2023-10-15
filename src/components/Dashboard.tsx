import { Outlet } from "react-router-dom"
import Nav from "./Nav"

const Dashboard = () => {
  return (
    <div>
      <Nav />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
