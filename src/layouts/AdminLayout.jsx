import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: 250, background: "#111", color: "white", padding: 20 }}>
        <h2>SipSuite</h2>

        <div style={{ marginTop: 30 }}>
          <Link to="/admin">Events</Link>
          <br />
          <Link to="/admin/drinks">Drink Database</Link>
          <br />
          <Link to="/admin/staff">Staff</Link>
        </div>

        <div style={{ marginTop: 50 }}>
          <p>Meraki Bartending</p>
          <p>email@email.com</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 30 }}>
        <Outlet />
      </div>
    </div>
  );
}