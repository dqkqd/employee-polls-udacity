import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../app/hook"

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth()
  const location = useLocation()
  if (auth.status !== "success") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
