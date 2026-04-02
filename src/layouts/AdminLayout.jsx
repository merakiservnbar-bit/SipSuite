import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/ui/Logo";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <div
        className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}
      >
        {/* TOP SECTION */}
        <div className="sidebar-header">
          <button
            className="hamburger"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>

          {!collapsed && <Logo type="wordmark" size={28} />}
        </div>

        {/* NAV LINKS */}
        <div className="sidebar-links">
          <Link to="/admin">{!collapsed && "Events"}</Link>
          <Link to="/admin/drinks">{!collapsed && "Drink Database"}</Link>
          <Link to="/admin/staff">{!collapsed && "Staff"}</Link>
        </div>

        {/* FOOTER */}
        {!collapsed && (
          <div className="sidebar-footer">
            <p>Meraki Bartending</p>
            <p className="text-muted">email@email.com</p>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}