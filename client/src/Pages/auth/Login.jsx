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

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
    
      const res = await api.post("/auth/login", { userId: form.id.trim(), password: form.password });
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
        A unified digital platform connecting citizens, authorities,
        and government departments to build smarter, responsive cities.
      </p>

      <ol className="auth-points">
        <li>Report and track civic issues</li>
        <li>Transparent project monitoring</li>
        <li>Smarter transport and alerts</li>
        <li>One city. One system.</li>
      </ol>
    </div>

    <div className="auth-card">
     <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Login to CityConnect</p>

        {err && <div className="auth-error">{err}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <input
            className="auth-input"
            name="id"
            placeholder="User ID (e.g., citizen001)"
            value={form.id}
            onChange={onChange}
            required
          />
          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password (demo)"
            value={form.password}
            onChange={onChange}
            required
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
    </div>
  );
}