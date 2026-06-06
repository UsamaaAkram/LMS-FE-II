import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "../../../core/common/auth/authShell";
import { resetPassword } from "../../../core/redux/authSlice";
import { all_routes } from "../../router/all_routes";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: any) => state.auth);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid or missing reset token.");
    if (password.length < 8)
      return toast.error("Password must be at least 8 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");

    const res = await dispatch(resetPassword({ token, password }) as any);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Password reset successful. Please sign in.");
      navigate(all_routes.login);
    } else {
      toast.error(res.payload || "Reset failed. The link may have expired.");
    }
  };

  return (
    <AuthShell>
      <h1 className="auth-title">Reset password</h1>
      <p className="auth-sub">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium">
            New Password<span className="text-danger ms-1">*</span>
          </label>
          <input
            type={show ? "text" : "password"}
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium">
            Confirm Password<span className="text-danger ms-1">*</span>
          </label>
          <input
            type={show ? "text" : "password"}
            className="form-control form-control-lg"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="showPw"
            checked={show}
            onChange={() => setShow(!show)}
          />
          <label className="form-check-label ms-1" htmlFor="showPw">
            Show password
          </label>
        </div>
        <div className="d-grid">
          <button
            className="btn btn-secondary btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>

      <div className="fs-14 fw-normal d-flex align-items-center justify-content-center mt-4">
        Back to
        <Link to={all_routes.login} className="link-2 ms-1">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
};

export default ResetPassword;
