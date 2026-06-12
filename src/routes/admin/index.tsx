import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { resolveImagePath } from "../../lib/resolveImagePath";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
});

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(resolveImagePath("/admin/api/login.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        // Store admin session info
        localStorage.setItem("admin_token", data.token || "authenticated");
        localStorage.setItem("admin_name", data.name || "Admin");
        window.location.href = resolveImagePath("/admin/dashboard");
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch {
      setError("Unable to connect. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

        .admin-login-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #08111c;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(13,27,42,0.8) 0%, transparent 60%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .admin-login-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(circle at 30% 70%, rgba(201,168,76,0.03) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(201,168,76,0.02) 0%, transparent 50%);
          animation: subtleRotate 60s linear infinite;
        }

        @keyframes subtleRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.15); }
          50% { box-shadow: 0 0 40px rgba(201,168,76,0.25); }
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: 52px 44px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.03) inset;
          animation: fadeInUp 0.8s ease-out;
        }

        .login-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(201,168,76,0.2) 0%,
            transparent 40%,
            transparent 60%,
            rgba(201,168,76,0.1) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 44px;
        }

        .logo-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #c9a84c, #a07830);
          border-radius: 18px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0d1b2a;
          margin-bottom: 20px;
          animation: pulse-glow 3s ease-in-out infinite;
          transition: transform 0.3s ease;
        }

        .logo-mark:hover {
          transform: scale(1.05) rotate(-3deg);
        }

        .logo-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .logo-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin: 0;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .error-banner {
          background: rgba(220,50,50,0.1);
          border: 1px solid rgba(220,50,50,0.25);
          border-radius: 14px;
          padding: 14px 18px;
          color: #ff7070;
          font-size: 13px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: fadeInUp 0.3s ease-out;
        }

        .error-icon {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          color: #fff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #c9a84c;
          background: rgba(201,168,76,0.05);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .btn-login {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #c9a84c, #a07830);
          border: none;
          border-radius: 14px;
          color: #0d1b2a;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          letter-spacing: 0.04em;
          position: relative;
          overflow: hidden;
        }

        .btn-login::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.2) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-login:hover::before {
          opacity: 1;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,168,76,0.3);
        }

        .btn-login:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-text {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(13,27,42,0.3);
          border-top-color: #0d1b2a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 32px 0;
        }

        .hint-text {
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          line-height: 1.5;
        }

        .hint-text code {
          background: rgba(255,255,255,0.06);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          font-family: 'SF Mono', 'Fira Code', monospace;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 36px 28px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="admin-login-page">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo-mark">BI</div>
            <h1 className="logo-title">Brand Illumination</h1>
            <p className="logo-subtitle">Admin Control Panel</p>
          </div>

          {error && (
            <div className="error-banner">
              <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-username">Username</label>
              <input
                className="form-input"
                type="text"
                id="admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                className="form-input"
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              <span className="btn-text">
                {loading ? (
                  <>
                    <div className="spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}
              </span>
            </button>
          </form>

          <hr className="divider" />
          <p className="hint-text">
            Default credentials: <code>admin</code> / <code>admin123</code>
          </p>
        </div>
      </div>
    </>
  );
}
