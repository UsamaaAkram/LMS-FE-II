import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { logout } from "../../../core/redux/authSlice";
import { useDispatch } from "react-redux";

// Student sidebar: Courses + Settings.
const StudentSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(all_routes.login);
  };

  return (
    <div className="col-lg-3 ">
      <div className="settings-sidebar theiaStickySidebar">
        <div>
          <h6 className="mb-3">Main Menu</h6>
          <ul className="mb-3 pb-1">
            <li>
              <Link
                to={all_routes.studentCourses}
                className={`d-inline-flex align-items-center ${
                  location.pathname.includes("course") ? "active" : ""
                }`}
              >
                <i className="isax isax-book-1 me-2" />
                Courses
              </Link>
            </li>
          </ul>
          <hr />
          <h6 className="mb-3">Account Settings</h6>
          <ul>
            <li>
              <Link
                to={all_routes.studentSettings}
                className={`d-inline-flex align-items-center ${
                  location.pathname.includes("settings") ? "active" : ""
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

export default StudentSidebar;
