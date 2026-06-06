import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { AppDispatch } from "../core/redux/store";
import { getStudentById } from "../core/redux/studentSlice";
import Header from "../core/common/header/header";
import TeacherApprovalScreen from "./Instructor/approval-screen/approval-screen";
import { all_routes } from "./router/all_routes";

// Student-only gate. Disabled students see the approval/disable screen.
const StudentRoute: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const user: any = useSelector((state: any) => state.auth.user);
  const studentProfile = useSelector((state: any) => state.student.profile);

  useEffect(() => {
    if (user?.role === "student" && user?._id) {
      dispatch(getStudentById(user._id));
    }
  }, [user?._id, location.pathname, user?.role, dispatch]);

  if (!user) {
    return <Navigate to={all_routes.login} state={{ from: location }} replace />;
  }
  if (user.role !== "student") {
    return <Navigate to={all_routes.adminCourses} replace />;
  }

  // Disabled (awaiting admin approval) → show the disable screen only.
  const isDisabled =
    studentProfile?.student?.isDisable ?? user?.student?.isDisable ?? true;
  if (isDisabled) {
    return (
      <div className="main-wrapper">
        <Header />
        <TeacherApprovalScreen />
        <div className="sidebar-overlay"></div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Outlet />
      <div className="sidebar-overlay"></div>
    </div>
  );
};

export default StudentRoute;
