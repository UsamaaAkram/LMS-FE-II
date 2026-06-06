import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "../../../core/common/auth/authShell";
import { forgotPassword } from "../../../core/redux/authSlice";
import { all_routes } from "../../router/all_routes";

const ForgortPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.auth);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(forgotPassword({ email }) as any);
    if (res.meta.requestStatus === "fulfilled") {
      setSent(true);
      toast.success(
        res.payload?.message ||
          "If an account with that email exists, a reset link has been sent."
      );
    } else {
      toast.error(res.payload || "Request failed. Please try again.");
    }
  };

  return (
    <AuthShell>
      <h1 className="auth-title">Forgot password?</h1>
      <p className="auth-sub">
        Enter your email and we'll send you a reset link. It's valid for 15
        minutes.
      </p>

      {sent ? (
        <div className="alert alert-info">
          If an account with that email exists, a reset link has been sent. Please
          check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-medium">
              Email<span className="text-danger ms-1">*</span>
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button
              className="btn btn-secondary btn-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      )}

      <div className="fs-14 fw-normal d-flex align-items-center justify-content-center mt-4">
        Back to
        <Link to={all_routes.login} className="link-2 ms-1">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
};

export default ForgortPassword;
