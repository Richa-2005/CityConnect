import Button from "../common/Button";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">CityConnect</div>

      <ul className="nav-links">
        <li><a href="">Home</a></li>
        <li>Alerts</li>
        <li>Discover</li>
        <li>Dashboard</li>
      </ul>

      <button className="nav-cta">Report Issue</button>
    </nav>
  );
}

