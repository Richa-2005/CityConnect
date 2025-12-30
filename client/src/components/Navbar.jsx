
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
        
        <div className="nav-logo"><img src="/logo.jpeg" className="nav-logo"></img></div>
       
      </Link>
        

        <nav className="nav-links">
          

          {role === "citizen" && (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/citizen/complaints">Complaints</NavLink>
              <NavLink to="/citizen/projects">Projects</NavLink>
              <Link to="/transport">Transport</Link>
            </>
          )}

          {role === "authority" && (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/authority/complaints">Complaints</NavLink>
              <NavLink to="/authority/projects">Projects</NavLink>
              <NavLink to="/authority/alerts">Alerts</NavLink>
            </>
          )}

          {role === "govt" && (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/govt/projects">Projects</NavLink>
             <NavLink to="/govt/analytics">Analytics</NavLink>
              <NavLink to="/govt/complaints">Complaints</NavLink>
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
  {user?.role?.toUpperCase()}
  {user?.department ? ` · ${user.department}` : ""}
  <span className="demo-pill">DEMO</span>
</div>
              </div>
<button
  className="btn btn-demohelp"
  onClick={() => window.dispatchEvent(new CustomEvent("cc:open-help"))}
>
  ❓ Help
</button>
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