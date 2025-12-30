// src/pages/auth/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    dept: "",
  });
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
      const res = await api.post("/auth/signup", form);
    
      login(res.data);
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const needsDept = form.role === "authority" || form.role === "govt";

  return (
    <div className="auth-page">
        <div className="auth-layout">
    
    <div className="auth-intro">
      <h1 className="auth-brand">CityConnect</h1>
      <p className="auth-tagline">
        A unified digital platform connecting citizens, authorities,
        and government departments to build smarter, responsive cities.
      </p>

      <ul className="auth-points">
        <li>Report and track civic issues</li>
        <li>Transparent project monitoring</li>
        <li>Smarter transport and alerts</li>
        <li>One city. One system.</li>
      </ul>
    </div>
  <div className="auth-card">
    <h1 className="auth-title">Create account</h1>
    <p className="auth-subtitle">Join CityConnect</p>

    {err && <div className="auth-error">{err}</div>}

    <form className="auth-form" onSubmit={onSubmit}>
      <input className="auth-input" name="name" placeholder="Full name" onChange={onChange} required />
      <input className="auth-input" name="email" placeholder="Email" onChange={onChange} required />
      <input className="auth-input" type="password" name="password" placeholder="Password" onChange={onChange} required />

      <select className="auth-select" name="role" onChange={onChange}>
        <option value="citizen">Citizen</option>
        <option value="authority">Authority</option>
        <option value="govt">Govt</option>
     
      </select>

      {needsDept && (
        <input
          className="auth-input"
          name="dept"
          placeholder="Department"
          onChange={onChange}
        />
      )}

      <button className="auth-btn">
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>

    <div className="auth-footer">
      Already have an account? <Link to="/auth/login">Login</Link>
    </div>
  </div>
  </div>
</div>
  );
}