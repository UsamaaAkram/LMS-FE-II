import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../core/common/header/header";
import { all_routes } from "./router/all_routes";

// Generic gate: any logged-in user (admin or student). Used for shared screens.
const ProtectedRoutes = () => {
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.user);

  if (!user) {
    return <Navigate to={all_routes.login} state={{ from: location }} replace />;
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Outlet />
      <div className="sidebar-overlay"></div>
    </div>
  );
};

export default ProtectedRoutes;
