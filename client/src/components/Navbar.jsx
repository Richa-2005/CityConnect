
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, isAuthed, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
        {/* future logo */}
        <div className="nav-logo">CC</div>
        CityConnect
      </Link>
        

        <nav className="nav-links">
          

          {role === "citizen" && (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/citizen/complaints">Complaints</NavLink>
              <NavLink to="/citizen/projects">Projects</NavLink>
            </>
          )}

          {role === "authority" && (
            <>
              <NavLink to="/authority/complaints">Complaints</NavLink>
              <NavLink to="/authority/projects">Projects</NavLink>
              <NavLink to="/authority/alerts">Alerts</NavLink>
            </>
          )}

          {role === "govt" && (
            <>
              <NavLink to="/govt/projects">Projects</NavLink>
              <NavLink to="/govt/analytics">Analytics</NavLink>
            </>
          )}

          {role === "transport" && (
            <NavLink to="/transport/routes">Routes</NavLink>
          )}
        </nav>

        <div className="nav-right">
          {isAuthed ? (
            <>
              <div className="user-info">
                <div className="user-name">{user?.name || "User"}</div>
                <div className="user-meta">
                  {user?.role}
                  {user?.dept ? ` · ${user.dept}` : ""}
                </div>
              </div>

              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" to="/auth/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/auth/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}