import { Outlet } from "react-router-dom"
import { useAuth } from "../app/hook"
import Nav from "./Nav"

const Dashboard = () => {
  useAuth()
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
