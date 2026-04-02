import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LiveOrders from "../../components/bartender/LiveOrders";
import LiveMenu from "../../components/bartender/LiveMenu";

export default function BartenderLivePage() {
  const { eventId } = useParams();
  const { staff } = useAuth();

  const [tab, setTab] = useState("orders");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Event</h1>
        <p className="text-secondary">{staff?.name}</p>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <button onClick={() => setTab("orders")}  className="btn-secondary">Live Orders</button>
        <button onClick={() => setTab("menu")} className="btn-secondary">Menu</button>
        <button
          onClick={() =>
            navigate(`/bartender/events/${eventId}/history`)
          }
          className="btn-secondary"
        >
          View History
        </button>
        <button
          onClick={() =>
            navigate(`/bartender/events/${eventId}/analytics`)
          }
          className="btn-secondary"
        >
          Analytics
        </button>
      </div>

      {tab === "orders" && <LiveOrders eventId={eventId} />}
      {tab === "menu" && <LiveMenu eventId={eventId} />}
    </div>
  );
}