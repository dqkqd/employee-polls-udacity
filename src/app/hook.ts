import { useEffect } from "react"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { selectAuthedUser } from "../features/auth/authSlice"
import { notProtectedRoutes } from "../routes"
import type { AppDispatch, RootState } from "./store"

export const useAuth = () => {
  const authedUser = useAppSelector(selectAuthedUser)

  const location = useLocation()
  const { pathname } = location

  const isAuthenticated = [
    authedUser.id,
    authedUser.name,
    authedUser.password,
  ].every(Boolean)

  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated && !notProtectedRoutes.includes(pathname)) {
      navigate("/login")
    }
  }, [isAuthenticated, pathname, navigate])

  return authedUser
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
