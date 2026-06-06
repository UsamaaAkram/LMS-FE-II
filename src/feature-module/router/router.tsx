import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import {
  adminRoutes,
  authRoutes,
  sharedRoutes,
  studentRoutes,
} from "./router.link";
import AuthFeature from "../authFeature";
import ProtectedRoutes from "../privateRoute";
import AdminRoute from "../adminRoute";
import StudentRoute from "../studentRoute";
import Error404 from "../auth/error/error-404/error400";
import { all_routes } from "./all_routes";

// Entry point: send users to the right place based on auth/role.
const EntryRedirect = () => {
  const user = useSelector((state: any) => state.auth.user);
  if (!user) return <Navigate to={all_routes.login} replace />;
  return (
    <Navigate
      to={user.role === "admin" ? all_routes.adminCourses : all_routes.studentCourses}
      replace
    />
  );
};

const ALLRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={all_routes.root} element={<EntryRedirect />} />

      {/* Shared (any logged-in user) */}
      <Route element={<ProtectedRoutes />}>
        {sharedRoutes.map((route, idx) => (
          <Route path={route.path} element={route.element} key={"shared-" + idx} />
        ))}
      </Route>

      {/* Admin only */}
      <Route element={<AdminRoute />}>
        {adminRoutes.map((route, idx) => (
          <Route path={route.path} element={route.element} key={"admin-" + idx} />
        ))}
      </Route>

      {/* Student only */}
      <Route element={<StudentRoute />}>
        {studentRoutes.map((route, idx) => (
          <Route path={route.path} element={route.element} key={"student-" + idx} />
        ))}
      </Route>

      {/* Auth pages */}
      <Route element={<AuthFeature />}>
        {authRoutes.map((route, idx) => (
          <Route path={route.path} element={route.element} key={"auth-" + idx} />
        ))}
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default ALLRoutes;
