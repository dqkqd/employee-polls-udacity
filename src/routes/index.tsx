import Home from "../components/Home";
import ProtectedRoutes from "../components/ProtectedRoutes";
import LoginPage from "../features/auth/LoginPage";

export const routesConfig = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
];
