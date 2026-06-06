import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { logout } from "../../../core/redux/authSlice";

// Admin sidebar: Courses + Students + Settings.
const InstructorSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(all_routes.login);
  };

  const isActive = (route: string) => location.pathname === route;

  return (
    <div className="col-lg-3 ">
      <div className="settings-sidebar mb-lg-0 theiaStickySidebar">
        <div>
          <h6 className="mb-3">Main Menu</h6>
          <ul className="mb-3 pb-1">
            <li>
              <Link
                to={all_routes.adminCourses}
                className={`d-inline-flex align-items-center ${
                  location.pathname.includes("/admin/courses") ||
                  location.pathname.includes("/course/")
                    ? "active"
                    : ""
                }`}
              >
                <i className="isax isax-book-1 me-2" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                to={all_routes.adminStudents}
                className={`d-inline-flex align-items-center ${
                  location.pathname.includes("student") ? "active" : ""
                }`}
              >
                <i className="isax isax-user me-2" />
                Students
              </Link>
            </li>
          </ul>
          <hr />
          <h6 className="mb-3">Account Settings</h6>
          <ul>
            <li>
              <Link
                to={all_routes.adminSettings}
                className={`d-inline-flex align-items-center ${
                  isActive(all_routes.adminSettings) ? "active" : ""
                }`}
              >
                <i className="isax isax-setting-25 me-2" />
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={handleLogout}
                className="d-inline-flex align-items-center"
              >
                <i className="isax isax-logout5 me-2" />
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructorSidebar;
