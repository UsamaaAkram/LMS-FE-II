import { Route } from "react-router";

// Auth
import Login from "../auth/login/login";
import Register from "../auth/register/register";
import ForgotPassword from "../auth/forgot-password/forgortPassword";
import ResetPassword from "../auth/reset-password/resetPassword";
import Error404 from "../auth/error/error-404/error400";

// Courses (shared)
import AddNewCourse from "../Courses/add-newCourse/addNewCourse";
import EditCourse from "../Courses/edit-course/edit-course";
import CourseDetails from "../Courses/course-details/courseDetails";
import CourseWatch from "../Courses/course-watch/courseWatch";

// Admin
import AdminCourses from "../Instructor/instructor-course/instructorCourse";
import AdminStudents from "../Instructor/student-list/studentList";
import AdminStudentDetails from "../Instructor/student-details/studentsDetails";
import AdminSettings from "../admin/admin-settings/adminSettings";

// Student
import StudentCourse from "../student/student-course/studentCourse";
import StudentSettings from "../student/student-settings/studentSettings";
import StudentChangePassword from "../student/student-settings/student-change-password/studentChangePassword";

import { all_routes } from "./all_routes";

const routes = all_routes;

export const authRoutes = [
  { path: routes.login, element: <Login />, route: Route },
  { path: routes.register, element: <Register />, route: Route },
  { path: routes.forgotpassword, element: <ForgotPassword />, route: Route },
  { path: routes.resetPassword, element: <ResetPassword />, route: Route },
  { path: routes.Error404, element: <Error404 />, route: Route },
];

// Shared routes for any logged-in user (admin or enabled student)
export const sharedRoutes = [
  { path: routes.courseDetails, element: <CourseDetails />, route: Route },
  { path: routes.courseWatch, element: <CourseWatch />, route: Route },
];

// Routes available to admins only
export const adminRoutes = [
  { path: routes.adminCourses, element: <AdminCourses />, route: Route },
  { path: routes.addNewCourse, element: <AddNewCourse />, route: Route },
  { path: routes.editCourse, element: <EditCourse />, route: Route },
  { path: routes.adminStudents, element: <AdminStudents />, route: Route },
  {
    path: routes.adminStudentDetails,
    element: <AdminStudentDetails />,
    route: Route,
  },
  { path: routes.adminSettings, element: <AdminSettings />, route: Route },
];

// Routes available to students only
export const studentRoutes = [
  { path: routes.studentCourses, element: <StudentCourse />, route: Route },
  { path: routes.studentSettings, element: <StudentSettings />, route: Route },
  {
    path: routes.studentChangePassword,
    element: <StudentChangePassword />,
    route: Route,
  },
];
