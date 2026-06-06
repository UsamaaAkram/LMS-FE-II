import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminSettings = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [show, setShow] = useState({
    oldPassword: false,
    newPassword: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);

  const initials = (user?.name || "Admin")
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const toggle = (k: keyof typeof show) =>
    setShow((s) => ({ ...s, [k]: !s[k] }));

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPassword.length < 8)
      return toast.error("New password must be at least 8 characters.");
    if (pw.newPassword !== pw.confirm)
      return toast.error("Passwords do not match.");
    try {
      setSaving(true);
      await axios.patch(`${API_URL}/api/auth/change-password`, {
        oldPassword: pw.oldPassword,
        newPassword: pw.newPassword,
      });
      toast.success("Password updated.");
      setPw({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const pwField = (
    label: string,
    key: "oldPassword" | "newPassword" | "confirm",
    placeholder: string
  ) => (
    <div className="mb-3">
      <label className="form-label fw-medium">{label}</label>
      <div className="position-relative">
        <input
          type={show[key] ? "text" : "password"}
          className="form-control form-control-lg"
          placeholder={placeholder}
          value={pw[key]}
          onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
          required
        />
        <span
          role="button"
          onClick={() => toggle(key)}
          className="text-gray-7"
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <i className={`isax ${show[key] ? "isax-eye" : "isax-eye-slash"}`} />
        </span>
      </div>
    </div>
  );

  return (
    <>
      <Breadcrumb title="Account Settings" />
      <div className="content">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Profile */}
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center p-4">
                  <span
                    className="avatar avatar-xxl avatar-rounded bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 96, height: 96, fontSize: 32, fontWeight: 600 }}
                  >
                    {initials}
                  </span>
                  <h5 className="mb-1">{user?.name || "Admin"}</h5>
                  <span className="badge bg-primary rounded-pill text-capitalize px-3 py-1">
                    {user?.role}
                  </span>

                  <ul className="list-unstyled text-start mt-4 mb-0">
                    <li className="d-flex align-items-center py-2 border-bottom">
                      <span className="avatar avatar-sm bg-light rounded d-inline-flex align-items-center justify-content-center me-3">
                        <i className="isax isax-user text-primary" />
                      </span>
                      <div>
                        <p className="fs-12 text-muted mb-0">Name</p>
                        <p className="fw-medium mb-0">{user?.name || "—"}</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-center py-2 border-bottom">
                      <span className="avatar avatar-sm bg-light rounded d-inline-flex align-items-center justify-content-center me-3">
                        <i className="isax isax-sms text-primary" />
                      </span>
                      <div>
                        <p className="fs-12 text-muted mb-0">Email</p>
                        <p className="fw-medium mb-0">{user?.email || "—"}</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-center py-2">
                      <span className="avatar avatar-sm bg-light rounded d-inline-flex align-items-center justify-content-center me-3">
                        <i className="isax isax-shield-tick text-primary" />
                      </span>
                      <div>
                        <p className="fs-12 text-muted mb-0">Role</p>
                        <p className="fw-medium mb-0 text-capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-1">
                    <span className="avatar avatar-md bg-primary bg-opacity-10 rounded d-inline-flex align-items-center justify-content-center me-2">
                      <i className="isax isax-lock text-primary" />
                    </span>
                    <div>
                      <h5 className="mb-0">Change Password</h5>
                      <p className="fs-12 text-muted mb-0">
                        Use a strong password (8+ characters).
                      </p>
                    </div>
                  </div>
                  <hr />
                  <form onSubmit={changePassword}>
                    {pwField("Current Password", "oldPassword", "Enter current password")}
                    {pwField("New Password", "newPassword", "Enter new password")}
                    {pwField("Confirm New Password", "confirm", "Re-enter new password")}
                    <button
                      className="btn btn-secondary rounded-pill px-4 mt-2"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
