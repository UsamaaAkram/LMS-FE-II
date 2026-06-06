import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthShell from "../../../core/common/auth/authShell";
import { registerUser } from "../../../core/redux/authSlice";
import { all_routes } from "../../router/all_routes";

const PK_PHONE = /^(?:\+92|0092|92|0)?3\d{9}$/;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PK_PHONE.test(form.phoneNumber.trim()))
      return toast.error("Enter a valid Pakistani phone number (e.g. 03001234567).");
    if (form.password.length < 8)
      return toast.error("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match.");

    const { confirmPassword, ...payload } = form;
    const res = await dispatch(registerUser(payload) as any);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Account created. An admin will approve it before access.");
      navigate(all_routes.login);
    } else {
      toast.error(res.payload || "Registration failed.");
    }
  };

  return (
    <AuthShell>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">Join Learn With Husnain to access your courses.</p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label fw-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control form-control-lg"
              value={form.firstName}
              onChange={onChange}
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label fw-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control form-control-lg"
              value={form.lastName}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium">
            Username<span className="text-danger ms-1">*</span>
          </label>
          <input
            type="text"
            name="userName"
            className="form-control form-control-lg"
            value={form.userName}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium">
            Email<span className="text-danger ms-1">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="form-control form-control-lg"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium">
            Phone Number<span className="text-danger ms-1">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            className="form-control form-control-lg"
            placeholder="03001234567"
            value={form.phoneNumber}
            onChange={onChange}
            required
          />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">
              Password<span className="text-danger ms-1">*</span>
            </label>
            <input
              type={show ? "text" : "password"}
              name="password"
              className="form-control form-control-lg"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">
              Confirm Password<span className="text-danger ms-1">*</span>
            </label>
            <input
              type={show ? "text" : "password"}
              name="confirmPassword"
              className="form-control form-control-lg"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
          </div>
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
            {loading ? "Creating..." : "Sign up"}
          </button>
        </div>
      </form>

      <div className="fs-14 fw-normal d-flex align-items-center justify-content-center mt-4">
        Already have an account?
        <Link to={all_routes.login} className="link-2 ms-1">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
};

export default Register;
