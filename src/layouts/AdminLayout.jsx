import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/ui/Logo";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: "#0B1220" }}>

      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setOpen(true)}>
            ☰
          </button>

          <Logo variant="icon" size={36} />
        </div>
      </div>

      {/* SIDEBAR OVERLAY */}
      <div className={`sidebar-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <Logo variant="wordmark" size={28} />
        </div>

        <div className="sidebar-links">
          <Link className={location.pathname === "/admin" ? "active" : ""} to="/admin">Events</Link>
          <Link className={location.pathname.includes("/drinks") ? "active" : ""} to="/admin/drinks">Drink Database</Link>
          <Link className={location.pathname.includes("/staff") ? "active" : ""} to="/admin/staff">Staff</Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}