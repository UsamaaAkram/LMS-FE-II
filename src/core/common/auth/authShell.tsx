import React from "react";
import ImageWithBasePath from "../imageWithBasePath";

/**
 * Shared modern auth layout: a brand panel (left) + the form (right).
 * The brand panel collapses on small screens so the form takes the full width.
 */
const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-inner">
          <ImageWithBasePath
            src="assets/img/newLogo.PNG"
            alt="Learn With Husnain"
            className="auth-brand-logo"
          />
          <h3 className="auth-brand-title">
            Welcome to <br />
            Learn With <span>Husnain</span>
          </h3>
          <p className="auth-brand-text">Learn. Create. Earn.</p>
        </div>
      </aside>

      <main className="auth-form-side">
        <div className="auth-card">
          {/* Logo for small screens (brand panel is hidden below lg) */}
          <ImageWithBasePath
            src="assets/img/newLogo.PNG"
            alt="Learn With Husnain"
            className="auth-mobile-logo d-lg-none"
          />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthShell;
