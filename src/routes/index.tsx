import Home from "../components/Home"
import ProtectedRoutes from "../components/ProtectedRoutes"
import LoginPage from "../features/auth/LoginPage"
import SignupForm from "../features/auth/SignupForm"

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
    element: <SignupForm />,
  },
]

export const notProtectedRoutes = ["/login", "/signup"]
