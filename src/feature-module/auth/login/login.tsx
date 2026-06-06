import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "../../../core/common/auth/authShell";
import { loginUser } from "../../../core/redux/authSlice";
import { all_routes } from "../../router/all_routes";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const route = all_routes;
  const { loading } = useSelector((state: any) => state.auth);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await dispatch(loginUser({ email, password }) as any);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Login successful!");
      window.location.pathname =
        res.payload?.user?.role === "admin"
          ? route.adminCourses
          : route.studentCourses;
    } else {
      toast.error(res.payload || "Login failed. Please check your credentials.");
    }
  };

  return (
    <AuthShell>
      <h1 className="auth-title">Sign in to your account</h1>
      <p className="auth-sub">Welcome back — please enter your details.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label className="form-label fw-medium">
            Email<span className="text-danger ms-1">*</span>
          </label>
          <div className="position-relative">
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="isax isax-sms input-icon text-gray-7" />
          </div>
        </div>

        <div className="mb-3 position-relative">
          <label className="form-label fw-medium">
            Password<span className="text-danger ms-1">*</span>
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              role="button"
              className={`isax ${
                showPassword ? "isax-eye" : "isax-eye-slash"
              } input-icon text-gray-7`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="form-check mb-0">
            <input className="form-check-input" type="checkbox" id="rememberMe" />
            <label className="form-check-label ms-1" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>
          <Link to={route.forgotpassword} className="link-2">
            Forgot Password?
          </Link>
        </div>

        <div className="d-grid">
          <button
            className="btn btn-secondary btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="fs-14 fw-normal d-flex align-items-center justify-content-center mt-4">
        Don't have an account?
        <Link to={route.register} className="link-2 ms-1">
          Sign up
        </Link>
      </div>
    </AuthShell>
  );
};

export default Login;
