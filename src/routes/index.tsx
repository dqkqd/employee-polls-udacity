import Home from "../components/Home"
import ProtectedRoutes from "../components/ProtectedRoutes"
import LoginPage from "../features/auth/LoginPage"
import SignupPage from "../features/auth/SignupPage"

export const routesConfig = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
]

export const notProtectedRoutes = ["/login", "/signup"]
