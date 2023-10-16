import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "../app/hook"
import { selectAuthedUser } from "../features/auth/authSlice"
import Nav from "./Nav"

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector(selectAuthedUser)
  const location = useLocation()
  if (auth.status !== "success") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return (
    <>
      <Nav />
      {children}
    </>
  )
}
