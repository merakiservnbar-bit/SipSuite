import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo";

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div>
      {/* NAVBAR */}
      <div className="navbar">
        <div onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
          <Logo type="icon" size={32} />
        </div>

        <div className="nav-links">
          <span onClick={() => navigate("/admin")}>Admin</span>
          <span onClick={() => navigate("/bartender")}>Bartender</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}