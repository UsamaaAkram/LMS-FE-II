import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { logout } from "../../redux/authSlice";
import { toggleTheme } from "../../redux/themeSettingSlice";
import { all_routes } from "../../../feature-module/router/all_routes";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state: any) => state.auth.user);
  const mode = useSelector((state: any) => state.themeSetting?.mode || "dark");
  const role = user?.role;

  // Active-module detection for the centered nav
  const isCoursesActive =
    pathname.startsWith("/admin/courses") ||
    pathname.startsWith("/student/student-courses") ||
    pathname.startsWith("/course/");
  const isStudentsActive = pathname.startsWith("/admin/student");

  const handleLogout = () => {
    dispatch(logout());
    navigate(all_routes.login);
  };

  const displayName =
    user?.name ||
    (user?.student?.firstName
      ? `${user.student.firstName} ${user.student.lastName || ""}`.trim()
      : user?.student?.userName) ||
    "Account";

  const homeLink =
    role === "admin" ? all_routes.adminCourses : all_routes.studentCourses;
  const settingsLink =
    role === "admin" ? all_routes.adminSettings : all_routes.studentSettings;

  return (
    <header className="header">
      <div className="container-fluid">
        <nav className="d-flex align-items-center py-2">
          {/* Left: logo */}
          <div style={{ flex: 1 }}>
            <Link to={homeLink} className="navbar-brand d-inline-flex align-items-center mb-0">
              <ImageWithBasePath
                src="assets/img/newLogo.PNG"
                className="img-fluid"
                alt="Learn With Husnain"
                style={{ height: "40px", width: "auto" }}
              />
            </Link>
          </div>

          {/* Center: primary nav */}
          <ul className="nav header-center-nav d-flex align-items-center gap-3 gap-md-4 mb-0 flex-shrink-0">
            <li className="nav-item">
              <Link
                className={`nav-link fw-medium ${isCoursesActive ? "active" : ""}`}
                to={homeLink}
              >
                Courses
              </Link>
            </li>
            {role === "admin" && (
              <li className="nav-item">
                <Link
                  className={`nav-link fw-medium ${
                    isStudentsActive ? "active" : ""
                  }`}
                  to={all_routes.adminStudents}
                >
                  Students
                </Link>
              </li>
            )}
          </ul>

          {/* Right: theme toggle + user dropdown */}
          <div
            style={{ flex: 1 }}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent fs-18 header-icon-btn"
              title={mode === "dark" ? "Switch to light" : "Switch to dark"}
              onClick={() => dispatch(toggleTheme())}
            >
              <i className={`isax ${mode === "dark" ? "isax-sun-1" : "isax-moon"}`} />
            </button>
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center gap-2 dropdown-toggle border-0 bg-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span
                  className="avatar avatar-sm avatar-rounded bg-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34 }}
                >
                  <i className="isax isax-user" />
                </span>
                <span className="fw-medium d-none d-sm-inline">{displayName}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li>
                  <h6 className="dropdown-header text-capitalize">{displayName}</h6>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center" to={settingsLink}>
                    <i className="isax isax-setting-2 me-2" />
                    Account settings
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <i className="isax isax-logout me-2" />
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
