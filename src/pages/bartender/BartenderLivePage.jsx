import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LiveOrders from "../../components/bartender/LiveOrders";
import LiveMenu from "../../components/bartender/LiveMenu";

export default function BartenderLivePage() {
  const { eventId } = useParams();
  const { staff } = useAuth();

  const [tab, setTab] = useState("orders");
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <div className="live-header">
        <h1>Live Event</h1>
        <p className="text-secondary">{staff?.name}</p>
      </div>

      <div className="tabs">

        <button
          onClick={() => setTab("orders")}
          className={tab === "orders" ? "tab active" : "tab"}
        >
          Live Orders
        </button>

        <button
          onClick={() => setTab("menu")}
          className={tab === "menu" ? "tab active" : "tab"}
        >
          Menu
        </button>

        <button
          onClick={() =>
            navigate(`/bartender/events/${eventId}/history`)
          }
          className="tab"
        >
          History
        </button>

        <button
          onClick={() =>
            navigate(`/bartender/events/${eventId}/analytics`)
          }
          className="tab"
        >
          Analytics
        </button>

      </div>

      {tab === "orders" && <LiveOrders eventId={eventId} />}
      {tab === "menu" && <LiveMenu eventId={eventId} />}
    </div>
  );
}