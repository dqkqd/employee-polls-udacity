import { Outlet } from "react-router-dom";
import { useAuth } from "../app/hook";

const ProtectedRoutes = () => {
  useAuth();
  return <Outlet />;
};

export default ProtectedRoutes;
