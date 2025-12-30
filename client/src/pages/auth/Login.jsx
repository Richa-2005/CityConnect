// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ id: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // ✅ Demo users (match your users.json IDs)
  const demoUsers = {
    CITIZEN: { id: "citizen001", role: "CITIZEN", name: "Demo Citizen" },
    GOVT_ROADS: {
      id: "gov001",
      role: "GOVT",
      name: "Roads Officer",
      department: "roads",
      zone: "Zone-2",
    },
    GOVT_TRANSPORT: {
      id: "gov002",
      role: "GOVT",
      name: "Transport Officer",
      department: "transport",
      zone: "Zone-1",
    },
    AUTHORITY: { id: "auth001", role: "AUTHORITY", name: "City Commissioner" },
  };

  // ✅ One-click demo login (NO password)
  const demoLogin = (user) => {
    setErr("");
    login(user);
    navigate("/"); // your app can route based on role from home
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        userId: form.id.trim(),
        password: form.password,
      });
      const u = res.data.user ?? res.data;

      login(u);
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-intro">
          <h1 className="auth-brand">CityConnect</h1>
          <p className="auth-tagline">
            A unified digital platform connecting citizens, authorities, and
            government departments to build smarter, responsive cities.
          </p>

          <ol className="auth-points">
            <li>Report and track civic issues</li>
            <li>Transparent project monitoring</li>
            <li>Smarter transport and alerts</li>
            <li>One city. One system.</li>
          </ol>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Demo Access</h1>
          <p className="auth-subtitle">
            One-click entry for evaluation (no credentials required)
          </p>

          <div className="demo-grid">
            <button
              type="button"
              className="demo-btn"
              onClick={() => demoLogin(demoUsers.CITIZEN)}
            >
              Continue as Citizen
            </button>

            <button
              type="button"
              className="demo-btn"
              onClick={() => demoLogin(demoUsers.GOVT_ROADS)}
            >
              Continue as Govt (Roads)
            </button>

            <button
              type="button"
              className="demo-btn"
              onClick={() => demoLogin(demoUsers.GOVT_TRANSPORT)}
            >
              Continue as Govt (Transport)
            </button>

            <button
              type="button"
              className="demo-btn demo-btn-danger"
              onClick={() => demoLogin(demoUsers.AUTHORITY)}
            >
              Continue as Authority
            </button>
          </div>

          <div className="demo-divider">
            <span>or login manually</span>
          </div>

          {err && <div className="auth-error">{err}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <input
              className="auth-input"
              name="id"
              placeholder="User ID (e.g., citizen001)"
              value={form.id}
              onChange={onChange}
            />
            <input
              className="auth-input"
              name="password"
              type="password"
              placeholder="Password (demo)"
              value={form.password}
              onChange={onChange}
            />

            <button className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            Don’t have an account? <Link to="/auth/signup">Signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}