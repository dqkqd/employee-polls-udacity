import Dashboard from "../components/Dashboard"
import Home from "../components/Home"
import Leaderboard from "../components/Leaderboard"
import NewQuestion from "../components/NewQuestion"
import LoginPage from "../features/auth/LoginPage"
import SignupPage from "../features/auth/SignupPage"
import UserLoginSelection from "../features/users/UserLoginSelection"

export const routesConfig = [
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "new-question",
        element: <NewQuestion />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login/users",
    element: <UserLoginSelection />,
  },
]

export const notProtectedRoutes = ["/login", "/signup", "/login/users"]
